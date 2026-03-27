const mongoose = require('mongoose');

const guildConfigSchema = new mongoose.Schema({
    guildId: { type: String, required: true, unique: true },
    prefix: { type: String, default: '/' },
    welcomeChannelId: { type: String, default: null },
    logChannelId: { type: String, default: null },
    strictMode: { type: Boolean, default: false },
    // Modules
    economyEnabled: { type: Boolean, default: true },
    casinoEnabled: { type: Boolean, default: true },
    funEnabled: { type: Boolean, default: true },
    levelingEnabled: { type: Boolean, default: true },
    // Auto-Mod
    antiSpam: { type: Boolean, default: false },
    antiLinks: { type: Boolean, default: false },
    badWords: { type: Array, default: [] },
    // Starboard
    starboardChannelId: { type: String, default: null },
    starboardCount: { type: Number, default: 3 }
}, { timestamps: true });

module.exports = mongoose.model('GuildConfig', guildConfigSchema);
