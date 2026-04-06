const { SlashCommandBuilder } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder');

/**
 * Node Info & Diagnostics Command
 * Extracts comprehensive server metadata for the current guild.
 */
module.exports = {
    data: new SlashCommandBuilder()
        .setName('serverinfo')
        .setDescription('Scan current node parameters and guild data.'),

    async execute(interaction, client) {
        const { guild } = interaction;
        const { members, channels, roles, ownerId } = guild;

        // Fetch counts for better accuracy
        const totalMembers = guild.memberCount;
        const botCount = members.cache.filter(m => m.user.bot).size;
        const humanCount = totalMembers - botCount;

        const serverEmbed = embedBuilder({
            title: `Node Identity // ${guild.name}`,
            description: `**ID:** \`${guild.id}\`\n**Owner ID:** \`${ownerId}\`\n**Created:** <t:${Math.floor(guild.createdTimestamp / 1000)}:R>`,
            fields: [
                { name: 'Entity Density', value: `Total: \`${totalMembers}\`\nHumans: \`${humanCount}\`\nBots: \`${botCount}\``, inline: true },
                { name: 'Channel Matrix', value: `Text: \`${channels.cache.filter(c => c.type === 0).size}\`\nVoice: \`${channels.cache.filter(c => c.type === 2).size}\`\nCategory: \`${channels.cache.filter(c => c.type === 4).size}\``, inline: true },
                { name: 'Clearance Levels', value: `Roles: \`${roles.cache.size}\``, inline: true },
                { name: 'Shard / Locale', value: `Preferred Locale: \`${guild.preferredLocale}\`\nShard ID: \`${guild.shardId}\``, inline: true }
            ],
            color: '#BC82FF', // Cyber Purple
            thumbnail: guild.iconURL({ dynamic: true, size: 512 })
        });

        await interaction.reply({ embeds: [serverEmbed] });
    },
};
