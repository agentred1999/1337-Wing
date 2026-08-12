export const fieldNotes = [
  {
    id: 'deployment-audit',
    date: '2026-08-10',
    title: 'Self-hosting this site on a Pi 5, then breaking into it myself',
    summary: 'Deployment notes and a full security audit — firewall, SSH, SQL injection checks, and a timing-attack fix in the login flow.',
    body: `This site runs on a Raspberry Pi 5, not a cloud host. Backend is Node/Express, database is Postgres, Caddy sits in front as a reverse proxy handling TLS. Both services run under systemd so a crash or reboot doesn't take the site down — they restart on their own.

Once it was up, I ran it through an actual audit instead of assuming it was fine:

Checked every database query for injection risk. All parameterized — no string-concatenated SQL anywhere in the codebase.

Locked down SSH to key-based auth only, disabled password login entirely, and scoped it to a private network overlay so it's not sitting open to the raw internet.

Set up a default-deny firewall (ufw) — nothing gets in that isn't explicitly allowed.

Found and fixed a real bug in the login endpoint: it responded faster when a username didn't exist versus when the password was just wrong. That timing gap is enough for an attacker to enumerate valid usernames without ever guessing a password. Fixed by running a dummy password comparison even on a miss, so both paths take the same time.

Confirmed rate limiting was already in place on auth routes, and passwords are hashed with bcrypt, not stored in any reversible form.

Set up nightly encrypted-at-rest backups with rotation, so a bad deploy or a dead SD card doesn't mean losing the database.

None of this is theoretical. It's the actual stack this page loaded from.`,
  },
];
