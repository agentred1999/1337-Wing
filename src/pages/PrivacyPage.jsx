import { Link } from 'react-router-dom'

export default function PrivacyPage() {
  return (
    <div className="privacy-page">
      <div className="privacy-container">
        <p className="privacy-back"><Link to="/">&lt; back to shop</Link></p>

        <h1>Privacy Policy</h1>
        <p className="privacy-updated">Last updated: 8-8-26 </p>

        <section>
          <h2>Our Approach</h2>
          <p>1337 Wing is built by hackers, for hackers. We collect the minimum data required to run the site, sell gear, and support the community — nothing more. We don't sell your data, we don't run third-party ad trackers, and we don't pad this policy with vague language designed to hide what we actually do. If something changes, we'll say so plainly, right here.</p>
        </section>

        <section>
          <h2>1. What We Collect</h2>
          <p><strong>Account information.</strong> Username, email, and a bcrypt-hashed password. We never store your password in plaintext, and we cannot recover it.</p>
          <p><strong>Order information.</strong> Products, quantities, prices, and order status tied to your account.</p>
          <p><strong>Community submissions.</strong> Payloads, write-ups, or other content you submit to the community hub, stored with your username as author.</p>
          <p><strong>Contact form messages.</strong> Name, email, and message so we can respond.</p>
          <p><strong>Server logs.</strong> Standard access logs (IP, request path, timestamp, user agent) for debugging, abuse prevention, and security — not behavioral tracking.</p>
        </section>

        <section>
          <h2>2. What We Don't Collect</h2>
          <ul>
            <li>No third-party advertising trackers or pixels</li>
            <li>No cross-site tracking cookies</li>
            <li>No sale or rental of your data</li>
            <li>No plaintext password storage</li>
            <li>No unnecessary analytics beyond basic server logs</li>
          </ul>
        </section>

        <section>
          <h2>3. How We Use Your Data</h2>
          <p>Strictly to authenticate you, process orders, display community submissions you choose to publish, respond to messages, detect and prevent abuse, and keep the site running.</p>
        </section>

        <section>
          <h2>4. How We Protect It</h2>
          <p>Passwords are hashed with bcrypt before storage. Account and order data lives in a database that's never directly exposed to the internet — only reachable through our authenticated API. Admin functions are restricted by role-based access control.</p>
          <p>No system is perfectly secure, and we won't pretend otherwise. If we discover a breach affecting your data, we'll notify affected users as soon as practically possible.</p>
        </section>

        <section>
          <h2>5. Data Sharing</h2>
          <p>We don't sell, rent, or trade your data. Limited exceptions:</p>
          <ul>
            <li><strong>Payment processors</strong> — only what's needed to complete a transaction. We don't store full card numbers.</li>
            <li><strong>Legal obligations</strong> — if compelled by valid legal process.</li>
          </ul>
        </section>

        <section>
          <h2>6. Your Control Over Your Data</h2>
          <ul>
            <li>View and update your account info anytime while logged in</li>
            <li>Request a copy of the data we hold on you</li>
            <li>Request account deletion, subject to legal retention requirements</li>
            <li>Delete community submissions you've authored</li>
          </ul>
          <p>Reach out via <a href="https://github.com/agentred1999/1337-Wing/issues" target="_blank" rel="noreferrer">GitHub <span className="sr-only">(opens in new tab)</span></a> for any of the above — dedicated contact info coming soon.</p>
        </section>

        <section>
          <h2>7. Cookies</h2>
          <p>Only what's strictly necessary for authentication. No ad or cross-site tracking cookies.</p>
        </section>

        <section>
          <h2>8. Children's Privacy</h2>
          <p>Not directed at children under 13. We don't knowingly collect data from anyone under that age.</p>
        </section>

        <section>
          <h2>9. Changes to This Policy</h2>
          <p>If this policy changes in a way that matters, we'll update the date above and, for significant changes, make a visible announcement — not bury it in a silent edit.</p>
        </section>

        <section>
          <h2>10. Contact</h2>
          <p>Dedicated contact info coming soon. In the meantime, open a <a href="https://github.com/agentred1999/1337-Wing/issues" target="_blank" rel="noreferrer">GitHub issue <span className="sr-only">(opens in new tab)</span></a> for anything non-sensitive.</p>
        </section>

        <section>
          <h2>11. Reporting Security Issues</h2>
          <p>Found a vulnerability in our site, backend, or how we handle your data? We'd genuinely rather hear about it from you first, before anyone else finds it.</p>
          <p>Report it privately through <a href="https://github.com/agentred1999/1337-Wing/security/advisories/new" target="_blank" rel="noreferrer">GitHub Security Advisories <span className="sr-only">(opens in new tab)</span></a> — this keeps the report visible only to us until it's fixed, instead of a public issue that tips off anyone watching the repo. We don't publish security reports as public GitHub issues or pull requests, and we ask that you don't either, until we've had a chance to patch it.</p>
          <p>General bugs and feature ideas (non-security) are welcome as regular <a href="https://github.com/agentred1999/1337-Wing/issues" target="_blank" rel="noreferrer">GitHub issues <span className="sr-only">(opens in new tab)</span></a>.</p>
        </section>
      </div>
    </div>
  )
}
