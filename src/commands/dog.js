const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../utils/embed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dog')
        .setDescription('Fetches a random picture of a cute dog.'),
    async execute(interaction) {
        await interaction.deferReply();

        try {
            const res = await fetch('https://dog.ceo/api/breeds/image/random');
            if (!res.ok) throw new Error('API failed');
            const data = await res.json();
            const imageUrl = data.message;

            const embed = createEmbed({
                title: '🐶 Woof',
                color: '#F1C40F'
            }).setImage(imageUrl);

            await interaction.editReply({ embeds: [embed] });

        } catch (error) {
            await interaction.editReply('Could not fetch a dog picture at this time. 🐕');
        }
    },
};
