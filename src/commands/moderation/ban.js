const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder');

/**
 * Node Severance Protocol (Ban)
 * Permanently severs an entity's connection to the current node.
 */
module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Permanently sever a user from the node.')
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The entity to sever.')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('reason')
                .setDescription('The reason for protocol execution.')
                .setRequired(false)),

    async execute(interaction, client) {
        const target = interaction.options.getMember('target');
        const reason = interaction.options.getString('reason') || 'No reason provided.';

        if (!target) {
            return interaction.reply({
                content: 'The target entity is not reachable in this node.',
                ephemeral: true
            });
        }

        if (!target.bannable) {
            return interaction.reply({
                content: 'System error: Target clearance level is superior to your own.',
                ephemeral: true
            });
        }

        try {
            await target.ban({ reason });

            const banEmbed = embedBuilder({
                title: 'Security Protocol // NODE_SEVERANCE',
                description: `**Entity:** ${target.user.tag}\n**Reason:** ${reason}\n**Admin:** ${interaction.user.tag}`,
                color: '#ED4245',
                thumbnail: target.user.displayAvatarURL({ dynamic: true })
            });

            await interaction.reply({ embeds: [banEmbed] });
        } catch (err) {
            await interaction.reply({
                content: `Protocol failed. Error: \`${err.message}\``,
                ephemeral: true
            });
        }
    },
};
