const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../utils/embed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('meme')
        .setDescription('Fetches a random top meme.'),
    async execute(interaction) {
        await interaction.deferReply();

        try {
            // Using meme-api which scrapes r/memes and r/dankmemes
            const res = await fetch('https://meme-api.com/gimme');
            if (!res.ok) throw new Error('API failed');
            
            const data = await res.json();

            // SFW check just in case, though the API generally returns sfw by default
            if (data.nsfw) {
                return interaction.editReply('I found a meme, but it was marked NSFW. Try again!');
            }

            const embed = createEmbed({
                title: data.title,
                url: data.postLink,
                color: '#9B59B6'
            }).setImage(data.url)
              .setFooter({ text: `👍 ${data.ups} | r/${data.subreddit}` });

            await interaction.editReply({ embeds: [embed] });

        } catch (error) {
            await interaction.editReply('Could not fetch a meme at this time.');
        }
    },
};
