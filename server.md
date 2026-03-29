# NexusBot — Support Server Blueprint

Use this file as a **checklist** while you click through Discord. Work **top to bottom** — skipping steps (especially **role order** and **bot role height**) breaks tickets, verification, and moderation.

---

## How to read this

| Symbol | Meaning |
|--------|---------|
| **Do this** | Concrete action in Discord (or your bot). |
| **Pick one** | Choose option A *or* B — don’t mix unless you know why. |
| `@everyone` | Discord’s base role — not a role you create. |

**Discord UI paths** use arrows: `Server name (top left) → Server Settings → …`

---

## TL;DR — build order

1. Create the **server** and set **Server Settings → Community** (optional) / verification level.  
2. Create **roles** in **Server Settings → Roles** — **exact order matters** (see §2). Drag roles so **Architect** is at the **top** of the list.  
3. Create **categories** first (empty), then **channels** inside each category (§3).  
4. Set **category permissions** (§4), then **channel overrides** only where something differs.  
5. Invite **Nexus bot** with `applications.commands`; **drag `🤖 Nexus Bot` role above** `✅ Verified` and any role the bot assigns.  
6. Configure **Welcome** / **Membership Screening** (§5).  
7. Paste **start-here** and **rules** text (§6–7). Run **`/ticket-setup`** and **`/verify-setup`** in your server (§8).

---

## 1. Server basics — first 10 minutes

Do these in **Server Settings** (gear icon next to server name).

| Step | Where to click | What to choose |
|------|----------------|----------------|
| 1 | `Overview` | **Server name** — e.g. `Nexus Protocol` or `NexusBot · Support`. |
| 2 | `Overview` | **Icon** — match your site branding. |
| 3 | `Overview` | **Description** — one line, e.g. *Official Nexus bot · help · docs · self-hosting*. |
| 4 | `Safety Setup` or `Moderation` | **Verification level** — **Medium** recommended for public invite links; **High** if you get raids. |
| 5 | `Default notification settings` | **Only @mentions** — stops new members from getting pinged by every message. |
| 6 | `Privacy` (user) | Remind mods: enable **2FA** on their Discord account for mod actions. |
| 7 | `Roles` | See §2 next — **before** creating many channels. |

**Optional — Community features:**  
`Server Settings → Enable Community` gives you **Rules/Guidelines** screening and **Welcome** screens. Use it if you want Discord’s native “agree to rules” flow (§5).

---

## 2. Roles — create in this order (top = highest power)

### 2.1 Why order matters

- Users **only receive permissions** from roles **below** conflicting roles in the list (Discord compares highest role first).  
- **Bots** only apply roles **below the bot’s own role**. Put **`🤖 Nexus Bot` above** every role it must assign (e.g. `✅ Verified`).

### 2.2 Create each role

**Path:** `Server Settings → Roles → Create Role`

Create **one at a time**, then **drag** to match this order (**top of list = row 1**):

| # | Role name (copy-paste) | Color (hex) | Who gets it |
|---|------------------------|-------------|-------------|
| 1 | `👑 Nexus Architect` | `#FF4444` | You / owners only |
| 2 | `⚙️ Core Team` | `#9D00FF` | Leads: full server management |
| 3 | `🛡️ Moderator` | `#00FFEA` | Moderation + tickets |
| 4 | `💠 Support Staff` | `#5CE1E6` | Help desk + tickets (no server structure) |
| 5 | `✨ Contributor` | `#8899AA` | Optional helpers / docs |
| 6 | `🤖 Nexus Bot` | *(default)* | **The bot account** — assign this role **to the bot** after invite |
| 7 | `📡 Booster` | *(auto)* | Optional — use Server Boost settings |
| 8 | `✅ Verified` | `#57F287` | Members who passed rules / verification |

**Do not** give `Administrator` to everyone. Prefer **Core Team** with: *Manage Server, Manage Roles, Manage Channels, Manage Webhooks, View Audit Log* — add only what you need.

### 2.3 Permission presets (Server Settings → Roles → [role] → Permissions)

| Permission | Architect | Core | Mod | Support | Verified |
|------------|-----------|------|-----|---------|----------|
| Administrator | ✓ or use granular* | optional | ✗ | ✗ | ✗ |
| Manage Server | ✓ | ✓ | ✗ | ✗ | ✗ |
| Manage Roles | ✓ | ✓ | ✗* | ✗ | ✗ |
| Manage Channels | ✓ | ✓ | ✗* | ✗ | ✗ |
| Kick Members | ✓ | ✓ | ✓ | optional | ✗ |
| Ban Members | ✓ | ✓ | ✓ | ✗ | ✗ |
| Moderate Members (timeout) | ✓ | ✓ | ✓ | ✓ | ✗ |
| Manage Messages | ✓ | ✓ | ✓ | ✓ | ✗ |
| Manage Threads | ✓ | ✓ | ✓ | ✓ | ✗ |
| Read Message History | ✓ | ✓ | ✓ | ✓ | ✓ |
| Send Messages | ✓ | ✓ | ✓ | ✓ | ✓ |
| Embed Links / Attach Files | ✓ | ✓ | ✓ | ✓ | ✓ |

\*If Mod shouldn’t change server layout, leave **Manage Channels / Roles** off at server level; use **per-channel** overrides for tickets only.

**`✅ Verified`:** Turn **off** every permission except what `@everyone` has — it’s a **tag**, not a power role, unless you use it to **unlock** channels (§4).

---

## 3. Categories and channels — build list

**Path:** Right-click server → `Create Category` → name it exactly as below. Then **right-click category → Create Channel** for each row.

Use the **`┃`** character between emoji and name (optional) — it keeps names aligned in the sidebar.

### 3.1 `📌 INFORMATION`

| # | Channel name | Type | Slowmode | Purpose |
|---|--------------|------|----------|---------|
| 1 | `📢┃announcements` | Text | Off | Staff-only posts; ping `@everyone` only for big news |
| 2 | `📜┃rules` | Text | Off | One pinned rules message + link to site Terms |
| 3 | `🚀┃start-here` | Text | Off | **Onboarding** — paste text from §6 |
| 4 | `🔗┃links` | Text | Off | Bot invite, website, GitHub, status URL |
| 5 | `📊┃status` | Text | Off | Optional: manual status or webhook |

### 3.2 `💬 COMMUNITY`

| # | Channel name | Slowmode |
|---|--------------|----------|
| 1 | `💬┃general` | 5 seconds |
| 2 | `🎨┃showcase` | 30 seconds |
| 3 | `💡┃suggestions` | 1 minute (or use **Forum** channel type) |

### 3.3 `🆘 SUPPORT`

| # | Channel name | Slowmode |
|---|--------------|----------|
| 1 | `❓┃faq` | Off |
| 2 | `🧰┃help` | 10 seconds |
| 3 | `🐛┃bug-reports` | 30 seconds |
| 4 | `🔧┃self-hosting` | 30 seconds |

**Optional:** Replace these with one **Forum** channel `🆘┃support` with tags: `question`, `bug`, `self-host`, `api`.

### 3.4 `🎫 TICKETS`

| # | Channel name | Notes |
|---|--------------|--------|
| 1 | `📩┃open-a-ticket` | Text + **button** from Nexus `/ticket-setup` (see §8) |
| *(auto)* | `ticket-username` | **Created by bot** — not created by hand |

### 3.5 `📚 DOCS & DEV`

| # | Channel name |
|---|--------------|
| 1 | `📖┃wiki-links` |
| 2 | `🔌┃api` |
| 3 | `🧪┃bot-sandbox` | *(optional — mute spam)* |

### 3.6 `🔒 STAFF` (private)

| # | Channel name |
|---|--------------|
| 1 | `📋┃staff-chat` |
| 2 | `📌┃staff-notes` |
| 3 | `⚠️┃mod-log` | *(optional webhooks)* |

### 3.7 `🔊 VOICE` *(optional)*

| # | Channel name |
|---|--------------|
| 1 | `🔊┃Lounge` |
| 2 | `🎙️┃Support Desk` |

---

## 4. Permissions — two clear setups

**Pick A or B** for your whole server. B is stricter (better against spam bots).

### Setup A — Open support (simplest)

- `@everyone` can **View** and **Send** in **COMMUNITY**, **SUPPORT**, and **DOCS** (not STAFF, not TICKETS category).  
- **INFORMATION:** `@everyone` can **View** all channels; **Send** only where you want chat (often: **only** `💬┃general` and support channels — **not** `📢┃announcements` or `📜┃rules`).

**How to set “read-only” info channels:**

1. Open `📢┃announcements` → **Edit Channel** (gear) → **Permissions**.  
2. Add `@everyone` → **View Channel: Allow**, **Send Messages: Deny**.  
3. Add `⚙️ Core Team` (and Mod if needed) → **Send Messages: Allow**.  
4. Repeat for `📜┃rules`, `🚀┃start-here`, `🔗┃links`, `📊┃status` if they should be read-only.

### Setup B — Verified gate (recommended for public listing)

- **Before** someone gets `✅ Verified`, they only see **INFORMATION** + maybe `🚀┃start-here`.  
- After **Verified**, they see **COMMUNITY**, **SUPPORT**, **DOCS**.

**Steps:**

1. **Server Settings → Safety → Membership Screening** — enable and paste short rules (§7).  
2. For **COMMUNITY** category: **Edit Category → Permissions** → `@everyone` → **View Channel: Deny** → Add `✅ Verified` → **View: Allow**, **Send: Allow**.  
3. Same for **SUPPORT** and **DOCS** if you want them gated.  
4. **INFORMATION** stays **View: Allow** for `@everyone` so they can read rules and links.

### TICKETS category (always)

1. **Edit Category `🎫 TICKETS` → Permissions**.  
2. `@everyone` → **View Channel: Deny**.  
3. Add `💠 Support Staff`, `🛡️ Moderator`, `⚙️ Core Team`, `👑 Nexus Architect` → **View: Allow**, **Send: Allow**.  
4. `🤖 Nexus Bot` → **View: Allow**, **Manage Channels: Allow** *(if your ticket flow creates channels)*.

### STAFF category (always)

1. `@everyone` → **View: Deny**.  
2. `🛡️ Moderator` and above → **View: Allow** (add Support if they need staff chat).

---

## 5. Welcome & join messages

### 5.1 System welcome channel

**Path:** `Server Settings → Overview → System Messages Channel`

- Set to **`🚀┃start-here`** (or create `👋┃welcome` if you prefer).  
- Turn **off** “Send a random welcome message” if you use a **custom bot** embed instead.

### 5.2 What new members should see first

In **`🚀┃start-here`**, they must see (in order):

1. What this server is (one sentence).  
2. Link to **`📜┃rules`**.  
3. How to get **`✅ Verified`** (reaction, screening, or `/verify`).  
4. Where to ask for help: **`🧰┃help`** or **`📩┃open-a-ticket`**.  
5. Link to **`🔗┃links`** for the bot OAuth.

Paste the full template from **§6** below.

### 5.3 Optional: join log

Create a **private** webhook or bot log to **`📋┃staff-chat`** or **`⚠️┃mod-log`** with: user ID, account age, invite used — helps catch alt abuse.

---

## 6. Onboarding — copy-paste for `🚀┃start-here`

Edit channel names if yours differ.

```markdown
# Welcome to Nexus Protocol

Thanks for joining. Do this **in order**:

**1.** Read **📜┃rules** — no harassment, no sharing tokens or database passwords in public.  
**2.** Complete verification (button or reaction below) to get **✅ Verified** if the server uses it.  
**3.** Add Nexus: open **🔗┃links** and use the bot invite (OAuth).  
**4.** Need help? Post in **🧰┃help** with your issue (one message, clear steps).  
**5.** Bug? Use **🐛┃bug-reports** — include bot version and what you tried.  
**6.** Self-hosting? Use **🔧┃self-hosting** — never paste your `.env` in chat.

**Staff:** **📖┃wiki-links** · **🔌┃api** for HTTP endpoints.
```

---

## 7. Rules text — paste into `📜┃rules` or screening

Short version (expand as needed):

1. **Be respectful** — no hate, harassment, or NSFW.  
2. **No secrets in public** — never post **bot tokens**, **MongoDB URIs**, passwords, or DMs you didn’t send. Use **tickets** or staff DMs.  
3. **Support format** — what you did, what you expected, error text, Nexus version (e.g. v6). Screenshots OK.  
4. **Language** — English (or state your server language) in support channels.  
5. **Discord** — follow [Community Guidelines](https://discord.com/guidelines) and [Terms](https://discord.com/terms).  
6. **Enforcement** — mods may warn, timeout, kick, or ban.

---

## 8. Nexus bot — setup checklist (run in your server)

Do this **after** roles exist and **Nexus Bot** role is **high enough** on the list.

| Step | Command / action | What to verify |
|------|------------------|----------------|
| 1 | Invite bot with **Administrator** or at least: Manage Channels, Send Messages, Embed Links, Use Slash Commands, Manage Roles (if verify) | Bot appears online |
| 2 | Drag **`🤖 Nexus Bot`** role **above** `✅ Verified` | Bot can assign Verified |
| 3 | `npm run deploy` (on your machine) + slash commands synced | `/help` works |
| 4 | `/ticket-setup` in **`📩┃open-a-ticket`** | Button creates private channels |
| 5 | `/verify-setup` *(optional)* | Matches your Verified role name |
| 6 | `/log-setup` / `/automod-setup` *(optional)* | Point to **`⚠️┃mod-log`** / `💬┃general` |
| 7 | `/starboard-setup` *(optional)* | Starboard channel if you use it |

**If tickets fail:** Almost always **bot role too low** or **missing Manage Channels**. Fix role order first.

---

## 9. Emoji reference (Unicode)

| Area | Emojis |
|------|--------|
| Info | 📌 📢 📜 🚀 🔗 📊 |
| Community | 💬 🎨 💡 |
| Support | 🆘 ❓ 🧰 🐛 🔧 |
| Tickets | 🎫 📩 |
| Staff | 🔒 📋 ⚠️ |
| Voice | 🔊 🎙️ |

---

## 10. Maintenance (monthly)

- [ ] Archive or delete old **ticket** channels.  
- [ ] Check **slowmode** on busy channels.  
- [ ] Update **`📊┃status`** when you deploy.  
- [ ] Remove unused **roles** and stale **permissions**.  
- [ ] Confirm **bot invite** link in **`🔗┃links`** still uses correct `client_id` and scopes.

---

*This file documents only Discord server layout. It does not change the Nexus codebase. Adjust names and strictness to your team size and threat model.*
