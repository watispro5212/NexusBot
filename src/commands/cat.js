const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../utils/embed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cat')
        .setDescription('Fetches a random picture of a cute cat.'),
    async execute(interaction) {
        await interaction.deferReply();

        try {
            const res = await fetch('https://api.thecatapi.com/v1/images/search');
            if (!res.ok) throw new Error('API failed');
            const data = await res.json();
            const imageUrl = data[0].url;

            const embed = createEmbed({
                title: '🐱 Meow',
                color: '#FFCC00'
            }).setImage(imageUrl);

            await interaction.editReply({ embeds: [embed] });

        } catch (error) {
            await interaction.editReply('Could not fetch a cat picture at this time. 😿');
        }
    },
};
