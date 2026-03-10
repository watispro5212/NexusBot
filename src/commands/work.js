const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../utils/embed');
const economy = require('../utils/EconomyManager');

const COOLDOWN_MS = 60 * 60 * 1000; // 1 hour
const MIN_PAY = 150;
const MAX_PAY = 400;

const JOBS = [
    'hacked a mainframe',
    'delivered pizzas',
    'mined some crypto',
    'fixed a broken spaceship',
    'sold custom Discord bots',
    'streamed some games',
    'invested in the stock market',
    'walked the neighbor\'s dogs'
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('work')
        .setDescription('Work a shift to earn some credits (1 hour cooldown).'),
    async execute(interaction) {
        const userId = interaction.user.id;
        const data = economy.getUser(userId);

        const now = Date.now();
        const last = data.lastWork || 0;
        const diff = now - last;

        if (diff < COOLDOWN_MS) {
            const minutes = Math.ceil((COOLDOWN_MS - diff) / 60000);
            return interaction.reply({ 
                embeds: [createEmbed({
                    title: '⏳ You are too tired...',
                    description: `You must rest for **${minutes} more minutes** before working again.`,
                    color: '#ED4245'
                })],
                ephemeral: true 
            });
        }

        const payout = Math.floor(Math.random() * (MAX_PAY - MIN_PAY + 1)) + MIN_PAY;
        const jobDesc = JOBS[Math.floor(Math.random() * JOBS.length)];

        data.wallet += payout;
        data.lastWork = now;
        economy.saveUser(userId, data);

        const embed = createEmbed({
            title: '💼 Shift Complete!',
            description: `You ${jobDesc} and earned **${payout} Credits**!\nYour new wallet balance is **${data.wallet.toLocaleString()} Credits**.`,
            color: '#3498DB'
        });

        await interaction.reply({ embeds: [embed] });
    },
};
