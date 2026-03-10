const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../utils/embed');
const economy = require('../utils/EconomyManager');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('balance')
        .setDescription('Check your current account balance.')
        .addUserOption(opt => 
            opt.setName('target')
                .setDescription('Check someone else\'s balance')
                .setRequired(false)
        ),
    async execute(interaction) {
        const target = interaction.options.getUser('target') || interaction.user;
        
        if (target.bot) {
            return interaction.reply({ content: 'Bots do not have bank accounts!', ephemeral: true });
        }

        const data = economy.getUser(target.id);
        const netWorth = data.wallet + data.bank;

        const embed = createEmbed({
            title: `💰 ${target.username}'s Account`,
            thumbnail: target.displayAvatarURL(),
            fields: [
                { name: '👛 Wallet', value: `\`${data.wallet.toLocaleString()} Credits\``, inline: true },
                { name: '🏦 Bank', value: `\`${data.bank.toLocaleString()} / ${data.bankCapacity.toLocaleString()} Credits\``, inline: true },
                { name: '🌐 Net Worth', value: `\`${netWorth.toLocaleString()} Credits\``, inline: false },
            ],
            color: '#F1C40F'
        });

        await interaction.reply({ embeds: [embed] });
    },
};
