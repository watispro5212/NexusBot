const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../utils/embed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('coinflip')
        .setDescription('Flips a coin returning Heads or Tails.'),
    async execute(interaction) {
        const result = Math.random() < 0.5 ? 'Heads' : 'Tails';
        const emoji = result === 'Heads' ? '🪙' : '⚪';

        const embed = createEmbed({
            title: 'Coin Flip',
            description: `The coin landed on...\n\n# ${emoji} **${result}**`,
            color: result === 'Heads' ? '#F1C40F' : '#95A5A6'
        });

        await interaction.reply({ embeds: [embed] });
    },
};
