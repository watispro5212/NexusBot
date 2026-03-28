# Security Policy — Nexus Protocol

## Supported versions

| Version | Status        | Support                          |
|---------|---------------|----------------------------------|
| **5.x** | Current       | Full security patches            |
| 4.x     | Previous      | Critical fixes on a best-effort basis |
| &lt; 4.0 | End of life  | No support                       |

## Scope

This policy covers:

- The **Discord bot** (`src/`, sharding, commands, events)  
- The **Express static + API layer** (`src/web/server.js`) that serves the HTML/CSS/JS site and JSON endpoints  
- **Operational** issues (token leak, misconfigured permissions, insecure hosting)

It does **not** cover Discord Ltd.’s platform security or your hosting provider’s infrastructure beyond configuration guidance below.

## Security measures (summary)

### Bot

- Owner-only gate for destructive and eval-class commands  
- Global blacklist before command execution  
- Guild-only command execution (no DMs)  
- Per-category cooldowns (including utility, media, and advanced command groups)  
- Guild module toggles (economy, casino, fun, leveling) with corrected mapping: economy leaderboard and `/rob` respect economy; `/rank` respects leveling; casino games respect casino only  
- Automod, audit logging, and starboard features with permission checks where applicable  

### Web / API

- Static files are served from the repository root only with **`dotfiles: 'deny'`** and middleware that blocks `src/`, `node_modules/`, `scripts/`, dot-paths, `.env`, and `package-lock.json` from being downloaded as static assets  
- **`GET /api/health`** — lightweight liveness JSON (no shard broadcast)  
- **`GET /api/version`** — package name, version, description  
- **`GET /api/stats`** — aggregated guild/member/ping data via shard broadcast (same as the companion site’s live counters when the bot process hosts the site)

**Recommendation:** In production, place a reverse proxy (nginx, Caddy, Cloudflare) in front of the Node process, enforce TLS, and restrict admin routes if you add any.

### Secrets

- Never commit `.env` or tokens  
- Use `DISCORD_CLIENT_ID` (or `CLIENT_ID`) for deploy scripts and the `/invite` command  
- Rotate a leaked bot token immediately in the Discord Developer Portal  

## Reporting a vulnerability

> **Do not** open a public GitHub issue for undisclosed security problems.

1. Email **williamdelilah3@gmail.com** or **altericjohnson2@gmail.com** with:
   - Description and impact  
   - Steps to reproduce (if safe to share)  
   - Affected version / commit (if known)  
   - Severity (Critical / High / Medium / Low)

2. We aim to acknowledge within **48 hours** and share a remediation timeline within **7 days** when practical.

3. Coordinated disclosure after a patch or mitigation is available.

## Contact

**Email:** williamdelilah3@gmail.com, altericjohnson2@gmail.com  

Thank you for helping keep Nexus Protocol and its operators safe.
