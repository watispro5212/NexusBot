const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { createEmbed } = require('../utils/embed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('invite')
        .setDescription('Get a link to add Nexus to another server you manage.'),
    async execute(interaction) {
        const clientId = process.env.DISCORD_CLIENT_ID || process.env.CLIENT_ID;
        if (!clientId) {
            return interaction.reply({
                content: '`[ERROR]` DISCORD_CLIENT_ID (or CLIENT_ID) is not set on this node.',
                flags: 64,
            });
        }

        const url = `https://discord.com/oauth2/authorize?client_id=${clientId}&permissions=8&scope=bot%20applications.commands`;

        const embed = createEmbed({
            title: 'Invite Nexus',
            description:
                'Authorize the bot with **applications.commands** so slash commands register.\nAfter install, place the bot role above channels it should manage.',
            color: '#00FFCC',
        });

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setLabel('Add to server').setStyle(ButtonStyle.Link).setURL(url),
        );

        await interaction.reply({ embeds: [embed], components: [row] });
    },
};
