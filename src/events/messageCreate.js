const { Events } = require('discord.js');
const { createEmbed } = require('../utils/embed');
const economy = require('../utils/EconomyManager');
const GuildConfig = require('../models/GuildConfig');

// Anti-spam cooldown (1 minute for XP)
const cooldowns = new Set();
const COOLDOWN_MS = 60000;

// Spam tracker (5 messages in 5 seconds)
const spamTracker = new Map();
const SPAM_LIMIT = 5;
const SPAM_TIME = 5000; 

// XP required = 100 * (level ^ 1.5)
function getXpRequirement(level) {
    return Math.floor(100 * Math.pow(level, 1.5));
}

module.exports = {
    name: Events.MessageCreate,
    async execute(message, client) {
        // Ignore bots and webhooks
        if (message.author.bot || !message.guild) return;

        const userId = message.author.id;
        const guildId = message.guild.id;

        // Fetch Guild Config
        let config = await GuildConfig.findOne({ guildId });
        if (!config) config = { levelingEnabled: true, antiSpam: false, badWords: [] }; // Fallback

        // --- AUTO-MODERATION: BAD WORDS ---
        if (config.badWords && config.badWords.length > 0) {
            const contentLimit = message.content.toLowerCase();
            const containsBadWord = config.badWords.some(word => contentLimit.includes(word.toLowerCase()));

            if (containsBadWord) {
                try {
                    await message.delete();
                    await message.channel.send({
                        content: `<@${userId}>`,
                        embeds: [createEmbed({ title: '🚨 Action Blocked', description: 'Your message contained blacklisted terminology and was removed.', color: '#ED4245' })]
                    });
                } catch (e) { /* ignore if missing perms */ }
                return; // Stop processing further
            }
        }

        // --- AUTO-MODERATION: ANTI-SPAM ---
        if (config.antiSpam) {
            const now = Date.now();
            if (!spamTracker.has(userId)) {
                spamTracker.set(userId, []);
            }
            
            const userMessages = spamTracker.get(userId);
            // Remove messages older than SPAM_TIME
            const recentMessages = userMessages.filter(timestamp => now - timestamp < SPAM_TIME);
            recentMessages.push(now);
            spamTracker.set(userId, recentMessages);

            if (recentMessages.length > SPAM_LIMIT) {
                try {
                    await message.delete();
                    await message.channel.send({
                        content: `<@${userId}>`,
                        embeds: [createEmbed({ title: '⚠️ Slow Down!', description: 'You are sending messages too quickly. Please wait a moment.', color: '#E67E22' })]
                    });
                } catch (e) { /* ignore */ }
                return; // Stop processing further
            }
        }

        // --- LEVELING MODULE CHECK ---
        if (!config.levelingEnabled) return;

        // Check if user is on cooldown to prevent spam grinding XP
        if (cooldowns.has(userId)) return;

        // Apply XP cooldown
        cooldowns.add(userId);
        setTimeout(() => cooldowns.delete(userId), COOLDOWN_MS);

        // Fetch user data
        const data = economy.getUser(userId);

        // Grant 15 to 25 XP
        const xpGained = Math.floor(Math.random() * 11) + 15;
        data.xp += xpGained;

        const requiredXp = getXpRequirement(data.level);

        // Level Up Logic
        if (data.xp >= requiredXp) {
            data.xp -= requiredXp; // carry over remainder
            data.level += 1;

            const reward = data.level * 500; // E.g., level 5 = 2500 credits
            data.wallet += reward;

            const embed = createEmbed({
                title: '🎉 Level Up!',
                description: `Congratulations <@${userId}>, you leveled up to **Level ${data.level}**!\n\nYou earned **${reward.toLocaleString()} Credits** as a reward!`,
                color: '#FEE75C'
            });

            // Try to find a good channel to send the message in
            try {
                await message.channel.send({ content: `<@${userId}>`, embeds: [embed] });
            } catch (err) {
                // Ignore if bot can't send messages there
            }
        }

        // Save
        economy.saveUser(userId, data);
    },
};
