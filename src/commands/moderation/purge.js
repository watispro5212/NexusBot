const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder');

/**
 * Data Deletion Protocol (Purge)
 * Mass deletes messages in the current channel.
 */
module.exports = {
    data: new SlashCommandBuilder()
        .setName('purge')
        .setDescription('Initiate a mass data deletion in the current channel.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .addIntegerOption(option => 
            option.setName('amount')
                .setDescription('The number of data packets (messages) to delete (1-100).')
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(100)),

    async execute(interaction, client) {
        const amount = interaction.options.getInteger('amount');

        try {
            const deleted = await interaction.channel.bulkDelete(amount, true);

            const successEmbed = embedBuilder({
                title: 'Data Deletion // SUCCESS',
                description: `Successfully purged \`${deleted.size}\` data packets from the local node.`,
                color: '#2ECC71'
            });

            await interaction.reply({ embeds: [successEmbed], ephemeral: true });
        } catch (err) {
            const errEmbed = embedBuilder({
                title: 'Deletion Failure',
                description: 'The system encountered an error while purging transmissions. Messages older than 14 days cannot be mass deleted.',
                color: '#ED4245'
            });

            await interaction.reply({ embeds: [errEmbed], ephemeral: true });
        }
    },
};
