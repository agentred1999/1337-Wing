import '../pages/SecurityPage.css';

interface AuditItem {
  cmd: string;
  detail: string;
}

interface AuditGroup {
  label: string;
  items: AuditItem[];
}

const AUDIT: AuditGroup[] = [
  {
    label: "infra",
    items: [
      { cmd: "reverse-proxy", detail: "Caddy in front of the app, bound to 127.0.0.1" },
      { cmd: "headers", detail: "HSTS + standard security headers on every response" },
      { cmd: "transport", detail: "TLS terminated at the edge, gzip enabled" },
    ],
  },
  {
    label: "auth",
    items: [
      { cmd: "passwords", detail: "bcrypt, cost factor 12" },
      { cmd: "sessions", detail: "JWT-based, rate limited on auth endpoints" },
      { cmd: "timing", detail: "fixed a timing side-channel in login comparison" },
    ],
  },
  {
    label: "data",
    items: [
      { cmd: "queries", detail: "parameterized everywhere — no string-built SQL" },
      { cmd: "backups", detail: "nightly PostgreSQL dumps, 14-day rotation" },
    ],
  },
  {
    label: "ops",
    items: [
      { cmd: "ssh", detail: "key-only auth, password login disabled" },
      { cmd: "firewall", detail: "ufw, default-deny inbound" },
    ],
  },
];

const REPO_URL = "https://github.com/agentred1999/1337-Wing";

export default function SecurityPage() {
  return (
    <main className="sec-page">
      <header className="sec-head">
        <span className="sec-prompt">root@1337</span>
        <span className="sec-sep">:</span>
        <span className="sec-path">~/security</span>
        <span className="sec-sep">$</span>
        <span className="sec-cmd">cat audit.log</span>
      </header>

      <p className="sec-intro">
        Everything below is live on this deployment, not a slide. Check the
        response headers yourself, or read the code — link at the bottom.
      </p>

      <div className="sec-groups">
        {AUDIT.map((group) => (
          <section key={group.label} className="sec-group">
            <h2 className="sec-group-label">{group.label}</h2>
            <ul className="sec-list">
              {group.items.map((item) => (
                <li key={item.cmd} className="sec-item">
                  <span className="sec-item-cmd">{item.cmd}</span>
                  <span className="sec-item-detail">{item.detail}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <footer className="sec-foot">
        <a href={REPO_URL} className="sec-repo-link" target="_blank" rel="noreferrer">
          source: agentred1999/1337-Wing
        </a>
      </footer>
    </main>
  );
}
