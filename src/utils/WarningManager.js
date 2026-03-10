const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data');
const WARNS_FILE = path.join(DATA_DIR, 'warnings.json');

if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(WARNS_FILE)) {
    fs.writeFileSync(WARNS_FILE, JSON.stringify({}));
}

class WarningManager {
    constructor() {
        this.cache = this._loadData();
    }

    _loadData() {
        try {
            return JSON.parse(fs.readFileSync(WARNS_FILE, 'utf-8'));
        } catch (err) {
            console.error('[WarningManager] Error loading data:', err);
            return {};
        }
    }

    _saveData() {
        try {
            fs.writeFileSync(WARNS_FILE, JSON.stringify(this.cache, null, 4));
        } catch (err) {
            console.error('[WarningManager] Error saving data:', err);
        }
    }

    getWarnings(guildId, userId) {
        if (!this.cache[guildId]) this.cache[guildId] = {};
        if (!this.cache[guildId][userId]) this.cache[guildId][userId] = [];
        return this.cache[guildId][userId];
    }

    addWarning(guildId, userId, moderatorId, reason) {
        if (!this.cache[guildId]) this.cache[guildId] = {};
        if (!this.cache[guildId][userId]) this.cache[guildId][userId] = [];
        
        const timestamp = Date.now();
        this.cache[guildId][userId].push({
            reason: reason,
            moderator: moderatorId,
            timestamp: timestamp
        });
        
        this._saveData();
    }

    clearWarnings(guildId, userId) {
        if (this.cache[guildId] && this.cache[guildId][userId]) {
            this.cache[guildId][userId] = [];
            this._saveData();
            return true;
        }
        return false;
    }
}

module.exports = new WarningManager();
