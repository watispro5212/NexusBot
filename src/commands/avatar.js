const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../utils/embed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Displays a user\'s avatar in high resolution.')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The user whose avatar you want to view.')
                .setRequired(false)),
    async execute(interaction) {
        const targetUser = interaction.options.getUser('target') || interaction.user;
        const avatarUrl = targetUser.displayAvatarURL({ dynamic: true, size: 2048 });

        const embed = createEmbed({
            title: `📸 ${targetUser.username}'s Avatar`,
            image: avatarUrl,
            footer: `Requested by ${interaction.user.tag}`
        });

        await interaction.reply({ embeds: [embed] });
    },
};
