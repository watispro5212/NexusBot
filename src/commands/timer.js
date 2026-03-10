const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../utils/embed');
const logger = require('../utils/logger');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timer')
        .setDescription('Sets a temporary countdown timer that will ping you when finished.')
        .addIntegerOption(option => 
            option.setName('minutes')
                .setDescription('Number of minutes')
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(1440)) // Max 24 hours
        .addStringOption(option => 
            option.setName('reminder')
                .setDescription('What should I remind you about?')
                .setRequired(false)),
    async execute(interaction) {
        const minutes = interaction.options.getInteger('minutes');
        const reminder = interaction.options.getString('reminder') || 'Timer is up!';
        const ms = minutes * 60 * 1000;

        const embed = createEmbed({
            title: '⏱️ Timer Set',
            description: `I will remind you in **${minutes} minute(s)** about:\n> *${reminder}*`,
            color: '#57F287'
        });

        await interaction.reply({ embeds: [embed] });
        logger.info(`${interaction.user.tag} set a ${minutes}m timer.`);

        setTimeout(async () => {
            const upEmbed = createEmbed({
                title: '⏰ Timer Finished!',
                description: `> *${reminder}*`,
                color: '#FEE75C' // Yellow alert
            });

            try {
                // Ping the user in the channel where they set it
                await interaction.followUp({ 
                    content: `<@${interaction.user.id}>`, 
                    embeds: [upEmbed] 
                });
            } catch (error) {
                // If they deleted the channel, try to DM them
                await interaction.user.send({ embeds: [upEmbed] }).catch(() => null);
            }
        }, ms);
    },
};
