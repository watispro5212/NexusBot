const { SlashCommandBuilder } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder');
const User = require('../../models/User');

/**
 * Operative Inventory & Hardware Check
 * Displays all acquired items for the target operative.
 */
module.exports = {
    data: new SlashCommandBuilder()
        .setName('inventory')
        .setDescription('View your locally stored items.')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The user whose inventory you want to scan.')
                .setRequired(false)),

    async execute(interaction, client) {
        const target = interaction.options.getUser('target') || interaction.user;

        // Find or create user
        const userData = await User.findOne({ userId: target.id, guildId: interaction.guild.id });
        
        if (!userData || !userData.inventory || userData.inventory.length === 0) {
            return interaction.reply({
                embeds: [embedBuilder({
                    title: 'Inventory Scan // EMPTY',
                    description: `${target.username} has no hardware assets in their local terminal.`,
                    color: '#ED4245'
                })]
            });
        }

        const inventoryEmbed = embedBuilder({
            title: `Entity Assets // ${target.username}`,
            description: userData.inventory.map(item => `\`${item}\``).join(', '),
            color: '#BC82FF',
            thumbnail: target.displayAvatarURL({ dynamic: true })
        });

        await interaction.reply({ embeds: [inventoryEmbed] });
    },
};
