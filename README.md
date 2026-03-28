# Nexus Protocol

<div align="center">

**Elite-tier Discord integration — neural economy, moderation, casino, leveling, and a hardened companion site.**

[![Discord.js](https://img.shields.io/badge/discord.js-v14-5865F2?style=for-the-badge&logo=discord&logoColor=white)](https://discord.js.org)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com)
[![License](https://img.shields.io/badge/License-BSL--Attribution-FF4444?style=for-the-badge)](LICENSE)
[![Version](https://img.shields.io/badge/Version-5.0.0-00FFCC?style=for-the-badge)](changelog.html)

</div>

---

## Overview

Nexus Protocol is a **sharded** Discord.js v14 bot with MongoDB persistence: economy, quests, casino, XP/rank cards, moderation, tickets, verification, automod hooks, starboard, audit logging, and owner tooling. A static **companion website** ships in-repo; when you run the shard manager, **Express** serves those pages plus JSON APIs for health, version, and live stats.

## Requirements

- **Node.js** 18+  
- **MongoDB** (connection string in `.env`)  
- **Discord** application with bot token and privileged intents as needed (`Message Content`, etc.)

## Quick start

```bash
git clone https://github.com/watispro5212/shiny-giigles.git
cd shiny-giigles
npm install
cp .env.example .env
# Edit .env: TOKEN, DISCORD_CLIENT_ID, MONGODB_URI
npm run deploy   # register global slash commands
npm start        # shards + web server (PORT default 3000)
```

## Environment variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `TOKEN` | Yes | Discord bot token |
| `MONGODB_URI` | Yes* | MongoDB connection string |
| `DISCORD_CLIENT_ID` | Yes* | Application ID (slash deploy + `/invite`) |
| `CLIENT_ID` | No | Alias for `DISCORD_CLIENT_ID` |
| `GUILD_ID` | No | Dev-only fast command registration (see `deploy-commands.js`) |
| `PORT` | No | HTTP port for site + API (default `3000`) |

\*The process will start without MongoDB, but data-backed commands will fail until `MONGODB_URI` is set.

## Scripts

| Script | Command |
|--------|---------|
| Start bot + web | `npm start` |
| Dev (nodemon) | `npm run dev` |
| Deploy slash commands | `npm run deploy` |

## Commands (high level)

**67** registered slash commands (including **8** owner-only: `shutdown`, `eval`, `set-credits`, `set-level`, `announce`, `blacklist`, `server-list`, `reload`). Public surface **59** commands.

| Area | Examples |
|------|----------|
| Utility | `ping`, **`invite`**, `help`, `info`, `profile`, `poll`, `remind`, … |
| Economy | `balance`, `daily`, `work`, `rob`, `leaderboard`, `shop`, `quests`, … |
| Casino | `blackjack`, `slots`, `coinflip` |
| Leveling | `rank` |
| Moderation | `ban`, `kick`, `warn`, `purge`, `ticket-setup`, `automod-setup`, `log-setup`, `starboard-setup`, … |
| Fun / media | `8ball`, `trivia`, `meme`, `cat`, `urban`, … |
| Advanced | `cyber-heist`, `giveaway`, `network-stats`, `shards` |

Full lists: run `/help` in Discord or open **`commands.html`** on the site.

## Web & API

With `npm start`, static assets are served from the project root with **guards** against exposing `src/`, `node_modules/`, dotfiles, and `.env`.

| Endpoint | Description |
|----------|-------------|
| `/` … `*.html` | Companion pages (home, commands, wiki, FAQ, dashboard, …) |
| `GET /api/health` | `{ ok, service, version, uptime }` |
| `GET /api/version` | Package metadata |
| `GET /api/stats` | Guild/member/ping aggregates (requires running shard manager) |

## Repository layout

```
├── src/
│   ├── index.js           # ShardingManager + web bootstrap
│   ├── bot.js             # Per-shard client, MongoDB, command/event load
│   ├── commands/          # Slash command modules
│   ├── events/            # Discord event handlers
│   ├── models/            # Mongoose schemas
│   ├── utils/             # Economy, embeds, cooldowns, etc.
│   └── web/server.js      # Express static + API
├── *.html, style.css, script.js   # Companion site
├── deploy-commands.js
├── package.json
├── LICENSE                # BSL-Attribution
└── SECURITY.md
```

## Companion site

Pages include **Home**, **Commands**, **Wiki**, **FAQ**, **Staff**, **Premium**, **Features**, **Changelog**, **Status**, **Dashboard**, **Privacy**, and **Terms**. Live counters call `/api/stats` when the bot hosts the site on the same origin.

## Authors

**watispro5212** · **watispro1**

## License

[Nexus Protocol License (BSL-Attribution)](LICENSE) — attribution required; commercial use needs written permission. See the license file for full terms.

## Security

See [SECURITY.md](SECURITY.md) for supported versions, reporting vulnerabilities, and hosting notes.
