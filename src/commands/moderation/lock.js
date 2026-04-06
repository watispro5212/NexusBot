const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder');

/**
 * Firewall Engagement Protocol (Lock)
 * Revokes SendMessages permissions for the @everyone role in the current node.
 */
module.exports = {
    data: new SlashCommandBuilder()
        .setName('lock')
        .setDescription('Engage firewall on the current channel.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

    async execute(interaction, client) {
        try {
            await interaction.channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
                SendMessages: false
            });

            const lockEmbed = embedBuilder({
                title: 'Security Protocol // FIREWALL_ENGAGED',
                description: 'Bandwidth for public transmissions has been throttled to zero.',
                color: '#ED4245'
            });

            await interaction.reply({ embeds: [lockEmbed] });
        } catch (err) {
            const errEmbed = embedBuilder({
                title: 'Firewall Failure',
                description: 'Permission sync failed. Check system hierarchy.',
                color: '#ED4245'
            });

            await interaction.reply({ embeds: [errEmbed], ephemeral: true });
        }
    },
};
