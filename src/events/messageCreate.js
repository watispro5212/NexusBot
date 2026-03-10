const { Events } = require('discord.js');
const { createEmbed } = require('../utils/embed');
const economy = require('../utils/EconomyManager');

// Anti-spam cooldown (1 minute)
const cooldowns = new Set();
const COOLDOWN_MS = 60000;

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

        // Check if user is on cooldown to prevent spam grinding
        if (cooldowns.has(userId)) return;

        // Apply cooldown
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
