const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder');

/**
 * Firewall Disengagement Protocol (Unlock)
 * Restores SendMessages permissions for the @everyone role in the current node.
 */
module.exports = {
    data: new SlashCommandBuilder()
        .setName('unlock')
        .setDescription('Disengage firewall on the current channel.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

    async execute(interaction, client) {
        try {
            await interaction.channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
                SendMessages: null
            });

            const unlockEmbed = embedBuilder({
                title: 'Security Protocol // FIREWALL_DISENGAGED',
                description: 'Transmission parameters restored to default.',
                color: '#2ECC71'
            });

            await interaction.reply({ embeds: [unlockEmbed] });
        } catch (err) {
            const errEmbed = embedBuilder({
                title: 'Restoration Failure',
                description: 'Permission sync failed. Check system hierarchy.',
                color: '#ED4245'
            });

            await interaction.reply({ embeds: [errEmbed], ephemeral: true });
        }
    },
};
