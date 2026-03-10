const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../utils/embed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription('Displays detailed information about a user.')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The user to inspect')
                .setRequired(false)),
    async execute(interaction) {
        const targetUser = interaction.options.getUser('target') || interaction.user;
        const targetMember = await interaction.guild.members.fetch(targetUser.id).catch(() => null);

        const embedColor = targetMember ? targetMember.displayHexColor : '#5865F2';
        
        let rolesValue = 'User is not in the server.';
        if (targetMember) {
            // Filter out @everyone, sort top-down, grab top 15, map to mentions
            const roles = targetMember.roles.cache
                .filter(role => role.id !== interaction.guild.id)
                .sort((a, b) => b.position - a.position)
                .map(role => `<@&${role.id}>`);
                
            rolesValue = roles.length > 0 
                ? (roles.length > 15 ? roles.slice(0, 15).join(' ') + ` *...and ${roles.length - 15} more*` : roles.join(' '))
                : 'None';
        }

        const embedFields = [
            { name: '👤 Username', value: targetUser.tag, inline: true },
            { name: '🆔 User ID', value: targetUser.id, inline: true },
            { name: '🤖 Bot?', value: targetUser.bot ? 'Yes' : 'No', inline: true },
            { name: '📆 Account Created', value: `<t:${Math.floor(targetUser.createdTimestamp / 1000)}:D>`, inline: true }
        ];

        if (targetMember) {
            embedFields.push(
                { name: '📥 Joined Server', value: `<t:${Math.floor(targetMember.joinedTimestamp / 1000)}:D>`, inline: true },
                { name: '🎨 Nickname', value: targetMember.nickname || 'None', inline: true },
                { name: `🏷️ Roles (${targetMember.roles.cache.size - 1})`, value: rolesValue, inline: false }
            );
        }

        const embed = createEmbed({
            title: 'User Information',
            thumbnail: targetUser.displayAvatarURL({ dynamic: true, size: 256 }),
            color: embedColor === '#000000' ? '#5865F2' : embedColor, // fallback if default role color
            fields: embedFields
        });

        await interaction.reply({ embeds: [embed] });
    },
};
