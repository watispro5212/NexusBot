const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../utils/embed');
const economy = require('../utils/EconomyManager');

const DAILY_REWARD = 1000;
const COOLDOWN_MS = 24 * 60 * 60 * 1000;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('daily')
        .setDescription('Claim your daily reward!'),
    async execute(interaction) {
        const userId = interaction.user.id;
        const data = economy.getUser(userId);

        const now = Date.now();
        const last = data.lastDaily || 0;
        const diff = now - last;

        if (diff < COOLDOWN_MS) {
            const remaining = COOLDOWN_MS - diff;
            const hours = Math.floor(remaining / 3600000);
            const minutes = Math.floor((remaining % 3600000) / 60000);

            return interaction.reply({ 
                embeds: [createEmbed({
                    title: '⏳ Cooldown Active',
                    description: `You already claimed your daily reward!\nCome back in **${hours}h ${minutes}m**.`,
                    color: '#ED4245'
                })],
                ephemeral: true 
            });
        }

        // Apply reward
        data.wallet += DAILY_REWARD;
        data.lastDaily = now;
        data.dailyStreak = (data.dailyStreak || 0) + 1;
        
        // Streak logic (reset if they waited longer than 48 hours)
        if (diff > COOLDOWN_MS * 2) {
            data.dailyStreak = 1;
        }

        economy.saveUser(userId, data);

        const embed = createEmbed({
            title: '🎁 Daily Reward Claimed!',
            description: `You received **${DAILY_REWARD.toLocaleString()} Credits**!\nYour new wallet balance is **${data.wallet.toLocaleString()} Credits**.`,
            fields: [
                { name: '🔥 Current Streak', value: `${data.dailyStreak} day(s) in a row`, inline: true }
            ],
            color: '#57F287'
        });

        await interaction.reply({ embeds: [embed] });
    },
};
