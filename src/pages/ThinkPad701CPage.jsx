import { Link } from 'react-router-dom'

function StatusBadge({ status }) {
  const colors = {
    PLANNED: '#888',
    'IN DEVELOPMENT': '#FFCC00',
    IMPLEMENTED: '#00ff9c',
    TESTED: '#4da6ff',
    VERIFIED: '#00ff9c',
  }
  return (
    <span
      className="status-badge"
      style={{
        color: colors[status] || '#888',
        border: `1px solid ${colors[status] || '#888'}`,
        borderRadius: 4,
        padding: '2px 8px',
        fontSize: '0.75rem',
        fontFamily: 'monospace',
        letterSpacing: '0.05em',
      }}
    >
      {status}
    </span>
  )
}

export default function ThinkPad701CPage() {
  return (
    <div className="privacy-page">
      <div className="privacy-container">
        <p className="privacy-back"><Link to="/">&lt; back to shop</Link></p>

        <h1>1337 Wing — ThinkPad 701C Project</h1>
        <p className="privacy-updated"><StatusBadge status="PLANNED" /> &nbsp;Project status: planning / design phase</p>

        <section>
          <h2>Project Overview</h2>
          <p>1337 Wing's ThinkPad 701C project is a long-term hardware engineering and security research effort centered on the classic IBM ThinkPad 701C/701CS — the "Butterfly" keyboard machine. The goal is not to replace the character of the original computer, but to preserve its mechanical and historical identity while engineering a modern, maintainable, Linux-capable computer inside it.</p>
          <p>This project is currently in the planning and design phase. Nothing on this page represents finished hardware, verified security controls, or completed testing unless explicitly marked as such.</p>
        </section>

        <section>
          <h2>Core Philosophy</h2>
          <p><em>Preserve what makes the machine special. Replace what has become obsolete. Design the replacements to be serviceable, modular, and maintainable.</em></p>
          <p>The original ThinkPad should remain recognizable — this is intended to be a functional computer, not a museum piece behind glass.</p>
        </section>

        <section>
          <h2>Original Hardware to Preserve</h2>
          <p>Where technically practical, the following will be preserved from the original machine:</p>
          <ul>
            <li>IBM ThinkPad 701C/701CS chassis</li>
            <li>Butterfly keyboard mechanism and its original feel — a major preservation priority</li>
            <li>TrackPoint</li>
            <li>Original display assembly, if it can be retained reliably</li>
            <li>Original audio hardware where practical</li>
            <li>Durable mechanical components and vintage external appearance</li>
          </ul>
        </section>

        <section>
          <h2>Modern Hardware Targets <StatusBadge status="PLANNED" /></h2>
          <p>Target specifications for the internal replacement platform. None of the following has been sourced, built, or verified yet.</p>
          <table className="spec-table">
            <tbody>
              <tr><td>Processor</td><td>Intel, x86-64 architecture</td></tr>
              <tr><td>Operating System</td><td>Linux-compatible</td></tr>
              <tr><td>Memory</td><td>32 GB RAM</td></tr>
              <tr><td>Storage</td><td>SSD</td></tr>
              <tr><td>Connectivity</td><td>USB-C, USB-A, Ethernet, Wi-Fi, Bluetooth</td></tr>
              <tr><td>Audio</td><td>Modern audio subsystem</td></tr>
              <tr><td>Display</td><td>Modern display connectivity, interfacing with original or replacement panel</td></tr>
            </tbody>
          </table>
          <p>Additional interfaces will be considered based on physical space and engineering feasibility. The design favors modular components over a single disposable board, so failed or obsolete parts can be replaced individually.</p>
        </section>

        <section>
          <h2>Security Research & Penetration Testing</h2>
          <p>1337 Wing is intended to become a security research and penetration-testing platform, not just a restoration. The design considers attack surfaces at multiple levels — the goal is to understand, document, protect, and test these interfaces, not hide them.</p>

          <h3>Hardware Attack Surface</h3>
          <ul>
            <li>USB, Ethernet, Wi-Fi, Bluetooth</li>
            <li>Storage and removable media</li>
            <li>Physical access</li>
            <li>Internal expansion interfaces</li>
          </ul>

          <h3>Firmware Attack Surface</h3>
          <ul>
            <li>Boot firmware and update mechanisms</li>
            <li>Secure boot and firmware integrity</li>
            <li>Recovery mechanisms</li>
            <li>SPI flash and hardware debugging interfaces</li>
          </ul>

          <h3>Operating System Attack Surface</h3>
          <ul>
            <li>Linux configuration and bootloader</li>
            <li>Disk encryption and authentication</li>
            <li>Privilege boundaries</li>
            <li>Network services and local attack surface</li>
          </ul>

          <h3>Internal Debug Interfaces</h3>
          <p>Where practical, the build will expose documented internal development/test interfaces — UART, SPI, I²C, GPIO, and JTAG/debug interfaces — and document them as part of the project's attack surface rather than concealing them.</p>
        </section>

        <section>
          <h2>Testing Philosophy</h2>
          <p>The machine will eventually be subjected to legitimate security testing by experienced testers, performed against this project's own hardware and within clearly defined rules of engagement. The process follows:</p>
          <p style={{ fontFamily: 'monospace', color: '#00ff9c' }}>BUILD &rarr; HARDEN &rarr; ATTACK &rarr; FIND &rarr; FIX &rarr; RETEST</p>
          <p>As testing occurs, this page will document the threat model, attack surface, security assumptions, controls, methodology, findings, severity, remediation, and retesting results. No vulnerabilities or completed controls are claimed here until they genuinely exist.</p>
        </section>

        <section>
          <h2>Project Lifecycle</h2>
          <p>The project will move through these stages, each documented as it happens:</p>
          <ol className="lifecycle-list">
            <li><strong>Mission</strong> — why this project exists</li>
            <li><strong>Preservation</strong> — document the original ThinkPad and determine what stays original</li>
            <li><strong>Architecture</strong> — design the modern computer around the 701 chassis</li>
            <li><strong>Engineering</strong> — develop replacement boards, power systems, interfaces, mechanical adaptations</li>
            <li><strong>Build</strong> — assemble the prototype</li>
            <li><strong>Firmware</strong> — develop and secure the boot/firmware architecture</li>
            <li><strong>Linux</strong> — install and configure the operating system</li>
            <li><strong>Harden</strong> — implement security controls</li>
            <li><strong>Attack</strong> — perform controlled penetration testing</li>
            <li><strong>Remediate</strong> — fix vulnerabilities and weaknesses</li>
            <li><strong>Retest</strong> — verify the fixes</li>
            <li><strong>Document</strong> — publish the final architecture and lessons learned</li>
          </ol>
          <p>Current stage: <StatusBadge status="PLANNED" /> &nbsp;Mission / Architecture planning</p>
        </section>

        <section>
          <h2>Long-Term Vision</h2>
          <p>A longer-term goal is producing replacement parts through 1337 Wing as a company — a custom motherboard, power-management board, battery-management system, I/O board, network module, display controller, and firmware/recovery hardware, designed as a platform rather than a one-off modification.</p>
          <p>If a modern component becomes obsolete or fails, the goal is that the machine never needs to be discarded — only that one part gets replaced.</p>
          <p style={{ marginTop: 20, fontFamily: 'monospace', color: '#00ff9c' }}>A 1990s ThinkPad, resurrected for the modern era.<br/>Preserve the machine. Rebuild the computer. Harden the platform.<br/>Attack the defenses. Learn from the results. Keep it repairable.</p>
        </section>





      </div>
    </div>
  )
}
