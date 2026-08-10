# 1337 Wing

Cybersecurity hardware and merch shop. React/Vite frontend, Node/Express backend, PostgreSQL database, self-hosted infrastructure.

## Stack
- Frontend: React + Vite
- Backend: Node.js / Express
- Database: PostgreSQL
- Reverse proxy / TLS: Caddy
- Process management: systemd

## Architecture
Traffic is terminated at HTTPS by a reverse proxy, which routes API requests to the backend service and everything else to the built frontend. TLS certificates are issued and renewed automatically. There is no unencrypted HTTP endpoint exposed publicly.

## Local development
cd frontend && npm install && npm run dev
cd backend && npm install && npm run dev

## Production build
The frontend is served in production from a built static bundle, not the dev server. Any source change requires a rebuild and a service restart to go live.

cd frontend
npm run build
# then restart the frontend service

### Notes on the preview/production server
The production static server validates the Host header by default and will reject unrecognized hosts. The deployment's public hostname must be explicitly allowlisted, or requests routed through the reverse proxy will be rejected at the application layer.

## Process management
Backend and frontend each run as an isolated, non-root systemd service with an on-failure restart policy, rather than as ad hoc foreground shell processes. This means the app recovers automatically from crashes or a reboot without manual intervention.

## Reverse proxy configuration
The reverse proxy is configured to talk to backend services over explicit loopback addresses rather than the hostname `localhost`, to avoid IPv4/IPv6 resolution mismatches that can cause silent upstream connection failures.

## Database backups
Automated nightly database dumps, compressed, with a rotation window that removes old backups after a set retention period. Backup authentication credentials are kept in a locked-down, mode-600 credentials file rather than embedded in scripts, cron entries, or the repo.

## Environment variables
Backend configuration (DB host, port, name, user, password) is supplied via a local .env file that is git-ignored and never committed. See .env.example (if present) for the required keys without real values.

## Cart
Cart state lives in src/context/CartContext.jsx (React Context + useState, no external store). Supports addToCart(product), removeFromCart(productId), decreaseQuantity(productId) which auto-removes an item at 0, and increaseQuantity(productId).

## Security

Practices in place for this deployment:

- **Transport**: All public traffic is served exclusively over HTTPS with automatically renewed TLS certificates. No unencrypted endpoint is exposed.
- **Response headers**: Strict-Transport-Security, X-Content-Type-Options (nosniff), X-Frame-Options (DENY), and Referrer-Policy are applied at the proxy layer. Server identification headers are stripped where possible.
- **Secrets management**: Credentials live only in a git-ignored .env file and a locked-down credentials file for automated jobs. Nothing is hardcoded in source, scripts, or committed configs.
- **Credential rotation**: Database passwords are rotated off scaffold/framework defaults before production use.
- **Process isolation**: Services run under a non-root user, each with its own restart policy, rather than in a shared ad hoc shell session.
- **Backups**: Automated, compressed, rotated database backups are taken on a nightly schedule, stored locally, with a planned offsite copy.
- **Network exposure**: Public access is scoped through a proxy layer rather than direct port-forwarding, limiting the exposed attack surface to what the proxy explicitly serves.

### Known gaps / TODO
- No CI/CD; deploys are manual
- No automated tests
- No offsite backup copy yet, beyond local rotation
- No uptime or intrusion monitoring configured yet
- Secrets are not yet managed via a dedicated secrets manager — acceptable for current scale, worth revisiting if this grows
