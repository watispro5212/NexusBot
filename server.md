# 🌐 NexusBot — Complete Discord Server Blueprint

Welcome to the **NexusBot Support Server Blueprint**. Use this comprehensive guide as a checklist to build and structure your Discord server perfectly from scratch. Avoid skipping steps—**especially role hierarchy positioning**—to ensure that tickets, verification, and moderation systems function correctly.

---

## 📖 How to read this guide

| Syntax | Meaning |
|--------|---------|
| **Take Action** | Concrete action to perform in your server settings. |
| **Pick one** | Choose option A *or* B — don’t mix unless you have a specific use case. |
| `@everyone` | The default Discord base role — not a custom role. |
| `⚙️` | Settings navigation, e.g. `Server name (top left) → Server Settings → …` |

---

## 🏗️ TL;DR — Quick Build Order

1. **Initialize Server:** Create the server and set `Server Settings → Community` (optional) / verification level.  
2. **Setup Roles:** Create roles in `Server Settings → Roles`. **Exact order is critical** (see Section 2). Drag powerful roles like **Architect** to the top.  
3. **Draft Categories:** Create empty categories first, then populate them with channels (see Section 3).  
4. **Configure Category Permissions:** Set **permissions directly on the categories** (see Section 4). Then click "Sync Permissions" on channels inside them.
5. **Invite Bots:** Invite **Nexus bot** and any other utility bots. Ensure their roles are dragged above the users they interact with.  
6. **Screening & Welcome:** Configure **Welcome** / **Membership Screening** features (see Section 5).  
7. **Populate Content:** Paste the **start-here** and **rules** text (see Sections 6 & 7). Run setup commands like `/ticket-setup` and `/verify-setup` (see Section 8).

---

## 1. ⚙️ Server Basics — First 10 Minutes

Navigate to **Server Settings** (click the gear icon or server name drop-down).

| Step | Navigation | Action Requirements |
|------|------------|---------------------|
| 1 | `Overview` | **Server name:** Choose a clean name, e.g., `Nexus Protocol` or `NexusBot · Support`. |
| 2 | `Overview` | **Icon:** Upload a high-quality icon matching your branding. |
| 3 | `Overview` | **Description:** Summarize your server. |
| 4 | `Safety Setup` | **Verification level:** Set to **Medium** or **High** to stop spammers. |
| 5 | `Notifications`| **Default Setting:** Set to **Only @mentions** so new members aren't spammed. |
| 6 | `Privacy` | **Moderation:** Enforce **2FA** on moderation actions for extra security. |

---

## 2. 🎭 Role Hierarchy & Global Permissions

### ⚠️ Why order is crucial

- Users **only receive permissions** depending on their position in the role hierarchy. A role cannot moderate or assign a role higher than its own.
- **Bots** can only interact with or assign roles **below their own highest role**. Put **Bots above** levels, verified flags, and regular members.

### 🗂️ Create Roles (Top to Bottom)

**Path:** `Server Settings → Roles → Create Role`

Create **one by one** and drag to match this exact order (Row 1 is highest priority). This includes staff ranks, integrations, fun roles, and leveling roles:

| # | Role Name | Hex Color | Who gets it |
|---|-----------|-----------|-------------|
| 1 | `👑 Nexus Architect` | `#FF4444` | Server Owner & Founders |
| 2 | `📈 Administrator` | `#FF0055` | Senior Staff / Co-Owners |
| 3 | `⚙️ Core Team` | `#9D00FF` | Lead Devs & Management |
| 4 | `🛡️ Moderator` | `#00FFEA` | Moderation & Enforcement Staff |
| 5 | `🔨 Trial Mod` | `#20B2AA` | Mods in training |
| 6 | `💠 Support Staff` | `#5CE1E6` | Help desk agents & Ticket handlers |
| 7 | `🤝 Partner` | `#00FF00` | Partnered Server Representatives |
| 8 | `🎥 Content Creator` | `#FF33CC` | YouTubers / Streamers |
| 9 | `💎 Donator / VIP` | `#FFD700` | Financial supporters or premium users |
| 10 | `👾 Beta Tester` | `#FF9900` | Users designated for alpha/beta testing |
| 11 | `🤖 Nexus Bot` | *(bot preset)* | **Main Bot Application** |
| 12 | `🛠️ Utility Bots` | *(bot preset)* | Other bots (Music bots, Logging bots, Economy) |
| 13 | `👑 Level 50 · Legend` | `#E6E6FA` | Max active chatter rank |
| 14 | `🏆 Level 30 · Master` | `#DDA0DD` | High active chatter rank |
| 15 | `🌟 Level 10 · Adept` | `#BA55D3` | Mid active chatter rank |
| 16 | `✨ Level 5 · Novice` | `#8A2BE2` | Base active chatter rank |
| 17 | `📡 Server Booster` | *(auto)* | Discord Nitro Boosters |
| 18 | `✅ Verified` | `#57F287` | Users who passed the rule-screening |
| 19 | `👤 Member` | *(default)* | General authenticated members |
| 20 | `🔊 Muted` | `#111111` | For custom manual muting (Deny Send Msgs) |

### 🔐 Global Permissions per Role

*(Configure these toggles via `Server Settings → Roles`. For global roles, if a permission is not listed below, leave its toggle **OFF**. Also ensure `Send Messages` and `View Channels` are ON for everyone except the Muted role!)*

#### 👑 Owners & Senior Staff
- **`👑 Nexus Architect` & `📈 Administrator`**
  - **ON**: `Administrator` (This automatically grants all other permissions).
- **`⚙️ Core Team`**
  - **ON**: `Manage Server`, `Manage Roles`, `Manage Channels`, `Kick Members`, `Ban Members`, `Moderate Members` (Timeout), `Manage Messages`, `Manage Webhooks`.

#### 🛡️ Moderation Team
- **`🛡️ Moderator`**
  - **ON**: `Kick Members`, `Ban Members`, `Moderate Members` (Timeout), `Manage Messages`.
- **`🔨 Trial Mod`**
  - **ON**: `Moderate Members` (Timeout), `Manage Messages`.
- **`💠 Support Staff`**
  - All moderation/admin toggles stay **OFF**. (They will get special access specifically in the Tickets category).

#### 🤖 Bots
- **`🤖 Nexus Bot`**
  - **ON**: `Administrator` (Strongly recommended so it can freely create/manage private ticket channels and moderate users).
- **`🛠️ Utility Bots`**
  - **ON**: `Manage Channels` (if voice bot), `Manage Messages` (if automod bot), `Manage Webhooks` (if logging bot).

#### 👤 Community & Vanity Roles (Levels, VIPs, Members)
- **`🤝 Partner`, `🎥 Content Creator`, `💎 Donator / VIP`, `👾 Beta Tester`**
- **All `Level` Roles & `📡 Server Booster`**
- **`✅ Verified` & `👤 Member`**
  - All moderation/admin toggles stay **OFF**. These are purely cosmetic, cosmetic-perk, or gatekeeping roles.

#### 🔊 The Muted Role
- **`🔊 Muted`**
  - Clear ALL permissions. Ensure that `Send Messages`, `Send Messages in Threads`, `Add Reactions`, and `Speak` (Voice) are explicitly **OFF** globally.

---

## 3. 📂 Categories & Channels Structure

**Path:** Right-click server layout → `Create Category`. Then `Create Channel` inside. Use the vertical bar **`┃`** separator.

**Do NOT set individual channel permissions unless specifically instructed. Let them "Sync" automatically from the category.**

| Category | Channel Name | Type | Notes |
|----------|--------------|------|-------|
| `📌 INFORMATION`| `📢┃announcements` | Text (📢)| Staff-only posts. |
| `📌 INFORMATION`| `📰┃updates` | Text | Minor bot, server, or codebase updates. |
| `📌 INFORMATION`| `📜┃rules` | Text | Hard rules, guidelines. |
| `📌 INFORMATION`| `🚀┃start-here` | Text | **Onboarding flow.** |
| `📌 INFORMATION`| `🔗┃links` | Text | Invites, Github, Socials, Status URLs. |
| `💬 COMMUNITY` | `💬┃general` | 5s | The main hub for conversation. |
| `💬 COMMUNITY` | `🤖┃bot-commands` | 15s | Spam zone for `/commands` and levels. |
| `💬 COMMUNITY` | `🎨┃showcase` | 30s | Sharing projects, setups, or artwork. |
| `💬 COMMUNITY` | `💡┃suggestions`| Forum | Dedicated community feedback forum. |
| `🆘 SUPPORT` | `❓┃faq` | Text | Read-only frequently asked questions. |
| `🆘 SUPPORT` | `🧰┃help` | Forum | Community support space. |
| `🆘 SUPPORT` | `🐛┃bug-reports` | Forum | Structured bug tracking zone. |
| `🆘 SUPPORT` | `🔧┃self-hosting` | Text | Developer deployment assistance channel. |
| `🎫 TICKETS` | `📩┃open-a-ticket` | Text | Read-only. Houses your bot ticket button. |
| `📚 DOCS & DEV` | `📖┃wiki` | Text | Links to external documentation. |
| `📚 DOCS & DEV` | `🔌┃api-updates` | Text | Specific API/Webhook changelogs. |
| `📚 DOCS & DEV` | `🧪┃sandbox` | Text | Test zone for beta stuff. |
| `🔒 STAFF AREA` | `📋┃staff-chat` | Text | General administrative chat. |
| `🔒 STAFF AREA` | `📌┃staff-notes` | Text | To-do lists, architecture planning. |
| `🔒 STAFF AREA` | `⚠️┃mod-log` | Text | Auto-logged events. |

---

## 4. 🔏 Category-Level Permissions (Sync Strategy)

To make everything cleaner, **set your permissions on the Categories themselves**. The channels inside will automatically sync.

**Path:** Right-click Category → `Edit Category` → `Permissions`. Add the specific roles listed under each category below.

### `📌 INFORMATION` Category
These are your global read-only info channels.
- **`@everyone`**: View Channel (**✓**), Send Messages (**✗**), Read Message History (**✓**)
- **`Administrators` / `Core Team`**: Send Messages (**✓**)
- **`🤖 Nexus Bot`**: Send Messages (**✓**)

### `💬 COMMUNITY` Category
Gated chatting zone for people who accepted the rules.
- **`@everyone`**: View Channel (**✗**) *(Hides chat from random unverified users)*
- **`✅ Verified`**: View Channel (**✓**), Send Messages (**✓**), Read Message History (**✓**), Attach Files (**✓**), Embed Links (**✓**)
- **`🔊 Muted`**: Send Messages (**✗**), Add Reactions (**✗**), Create Threads (**✗**), Speak in Voice (**✗**)

### `🆘 SUPPORT` Category
Gated support area.
- **`@everyone`**: View Channel (**✗**)
- **`✅ Verified`**: View Channel (**✓**), Send Messages (**✓**)
- **`🔊 Muted`**: Send Messages (**✗**)

### `🎫 TICKETS` Category
Should be mostly invisible except for the open ticket channel.
- **`@everyone`**: View Channel (**✗**)
- **`✅ Verified`**: View Channel (**✓**), Send Messages (**✗**) *(Allows them to click the ticket button without chatting)*
- **`💠 Support Staff` / `🛡️ Moderator`**: View Channel (**✓**), Send Messages (**✓**)
- **`🤖 Nexus Bot`**: View Channel (**✓**), Send Messages (**✓**), Manage Channels (**✓**) *(Allows bot to create private ticket sub-channels)*

### `📚 DOCS & DEV` Category
Gated read-only developer resources.
- **`@everyone`**: View Channel (**✗**)
- **`✅ Verified`**: View Channel (**✓**), Send Messages (**✗**)
- **`Administrators` / `Core Team`**: Send Messages (**✓**)

### `🔒 STAFF AREA` Category
Highly restricted.
- **`@everyone`**: View Channel (**✗**)
- **`🔨 Trial Mod`**, **`💠 Support Staff`**: View Channel (**✓**)
- **`🛡️ Moderator`**, **`⚙️ Core Team`**, **`Administrator`**: View Channel (**✓**), Send Messages (**✓**)
- **`🤖 Nexus Bot`**, **`🛠️ Utility Bots`**: View Channel (**✓**), Send Messages (**✓**) *(For mod-logging and alerts)*

---

## 5. 👋 Welcome & Member Screening

1. **System Welcome:** Go to `Server Settings → System Messages Channel`. Set it to `🚀┃start-here` or a dedicated `👋┃welcome`.
2. **Screening:** Enable standard built-in rules screening via the **Community Settings** tab to force users to click "I Agree" before interacting.
3. **Optional Log:** Send automated welcome logs into your `⚠️┃mod-log` channel to easily catch suspicious account creation dates.

---

## 6. 📝 Onboarding Message Template (Paste in `🚀┃start-here`)

```markdown
# Welcome to the Nexus Protocol Server! 🚀

Thanks for stopping by! Please take a quick moment to orient yourself:

**1.** 📜 Read our rules in <#CHANNEL_ID_HERE>. We strongly prohibit toxicity and sharing sensitive/secret tokens here.
**2.** ✅ Verify your account by hitting the button below or interacting with the screening popup to gain full server access.
**3.** 🤖 Looking to add NexusBot? Head straight over to <#CHANNEL_ID_HERE> to find the official invite link.
**4.** 🆘 Need assistance? Use the community <#CHANNEL_ID_HERE> or open a private ticket over at <#CHANNEL_ID_HERE>.
**5.** 🐛 Found a bug or glitch? Make a post in <#CHANNEL_ID_HERE> outlining exactly what happened.

Have an amazing time here!
— The Nexus Team
```

---

## 7. ⚖️ Basic Server Rules Template (Paste in `📜┃rules`)

```markdown
1. **Be Respectful:** No hate speech, organized harassment, or NSFW content. Keep things PG-13.
2. **Protect Your Data (No Secrets in Public):** Never post Bot Tokens, MongoDB URLs, Passwords, or exact `.env` files in public. Staff will never DM you for a password.
3. **High-Quality Support Format:** When asking for help, explain what you did, what you expected, the exact error provided, and your Nexus version. Include screenshots if possible.
4. **Use Appropriate Channels:** Keep spam command execution in the `🤖┃bot-commands` channel. 
5. **Follow Discord Guidelines:** See the official [Discord Guidelines](https://discord.com/guidelines).
6. **Enforcement:** Moderators have the final say and may timeout, kick, or ban users who intentionally disrupt the server.
```

---

## 8. 🛠️ Final Setup: Bot Commands

Execute these slash commands when the server layout is fully polished:

| Step | Command / Action | Result |
|------|------------------|--------|
| 1 | Invite Bot & ensure highest placement | Resolves hierarchy-related permission errors. |
| 2 | `/ticket-setup` in `📩┃open-a-ticket` | Creates the core interactive ticket UI. |
| 3 | `/verify-setup` in `🚀┃start-here` | Maps your customized `✅ Verified` role. |
| 4 | `/log-setup` pointing to `⚠️┃mod-log` | Routes automated moderation logging. |
| 5 | `/automod-setup` | Configures automated anti-spam and word filters. |
| 6 | `/starboard-setup` | Engages the fun starboard module! |

---

## 9. 🧽 Regular Maintenance (Monthly)

- [ ] Clear out or archive ancient, dead support tickets.
- [ ] Evaluate and update channel slowmode timings.
- [ ] Ensure **`📊┃status`** reflects the latest version numbers.
- [ ] Cull unused or empty permission roles.
- [ ] Re-test your **bot invite link** to make sure OAuth permissions are still optimal.

---
*Generated by the Nexus Team. Tailor specific channel names or moderation strictness strictly based on your personal community metrics.*
