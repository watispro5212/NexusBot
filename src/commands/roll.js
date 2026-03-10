const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../utils/embed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('roll')
        .setDescription('Rolls a die.')
        .addIntegerOption(option => 
            option.setName('sides')
                .setDescription('Number of sides on the die (defaults to 6).')
                .setRequired(false)
                .setMinValue(2)
                .setMaxValue(100)),
    async execute(interaction) {
        const sides = interaction.options.getInteger('sides') || 6;
        const result = Math.floor(Math.random() * sides) + 1;

        const embed = createEmbed({
            title: `🎲 Rolled a d${sides}`,
            description: `You rolled a **${result}**!`,
            color: '#00B4D8'
        });

        await interaction.reply({ embeds: [embed] });
    },
};
