import os from 'os';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

function getCpuLoadPercent() {
  const cpus = os.cpus();
  const totals = cpus.map((cpu) => {
    const times = cpu.times;
    const total = times.user + times.nice + times.sys + times.idle + times.irq;
    return { idle: times.idle, total };
  });
  const idle = totals.reduce((sum, c) => sum + c.idle, 0);
  const total = totals.reduce((sum, c) => sum + c.total, 0);
  return Math.round((1 - idle / total) * 100);
}

async function getDiskUsage() {
  try {
    const { stdout } = await execAsync("df -h / | tail -1 | awk '{print $2, $3, $5}'");
    const [size, used, percent] = stdout.trim().split(/\s+/);
    return { size, used, percentUsed: percent };
  } catch {
    return { size: 'unknown', used: 'unknown', percentUsed: 'unknown' };
  }
}

export async function getServerStatus(req, res, next) {
  try {
    const totalMemMB = Math.round(os.totalmem() / 1024 / 1024);
    const freeMemMB = Math.round(os.freemem() / 1024 / 1024);
    const usedMemPercent = Math.round(((totalMemMB - freeMemMB) / totalMemMB) * 100);

    const disk = await getDiskUsage();

    res.json({
      status: 'online',
      cpu: { loadPercent: getCpuLoadPercent(), cores: os.cpus().length },
      ram: { totalMB: totalMemMB, freeMB: freeMemMB, usedPercent: usedMemPercent },
      disk,
      uptimeSeconds: Math.round(os.uptime()),
      hostname: os.hostname(),
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    next(err);
  }
}

