const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data');
const ECONOMY_FILE = path.join(DATA_DIR, 'economy.json');

// Ensure data directory and file exist
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(ECONOMY_FILE)) {
    fs.writeFileSync(ECONOMY_FILE, JSON.stringify({}));
}

class EconomyManager {
    constructor() {
        this.cache = this._loadData();
    }

    _loadData() {
        try {
            const raw = fs.readFileSync(ECONOMY_FILE, 'utf-8');
            return JSON.parse(raw);
        } catch (err) {
            console.error('[EconomyManager] Error loading data:', err);
            return {};
        }
    }

    _saveData() {
        try {
            fs.writeFileSync(ECONOMY_FILE, JSON.stringify(this.cache, null, 4));
        } catch (err) {
            console.error('[EconomyManager] Error saving data:', err);
        }
    }

    getUser(userId) {
        if (!this.cache[userId]) {
            this.cache[userId] = {
                wallet: 0,
                bank: 0,
                bankCapacity: 5000,
                lastDaily: null,
                lastWork: null,
                dailyStreak: 0,
                xp: 0,
                level: 1,
                inventory: []
            };
            this._saveData();
        } else {
            // Hot-patch existing users with new Phase 5 fields
            let needsSave = false;
            if (this.cache[userId].xp === undefined) { this.cache[userId].xp = 0; needsSave = true; }
            if (this.cache[userId].level === undefined) { this.cache[userId].level = 1; needsSave = true; }
            if (!this.cache[userId].inventory) { this.cache[userId].inventory = []; needsSave = true; }
            if (needsSave) this._saveData();
        }
        return this.cache[userId];
    }

    saveUser(userId, data) {
        this.cache[userId] = data;
        this._saveData();
    }

    getLeaderboard() {
        return Object.entries(this.cache)
            .map(([id, data]) => ({ id, net: (data.wallet || 0) + (data.bank || 0) }))
            .sort((a, b) => b.net - a.net)
            .slice(0, 10);
    }
}

module.exports = new EconomyManager();
