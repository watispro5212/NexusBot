const { SlashCommandBuilder, ChannelType } = require('discord.js');
const { createEmbed } = require('../utils/embed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('serverinfo')
        .setDescription('Displays detailed information about the current server.'),
    async execute(interaction) {
        await interaction.deferReply();
        const { guild } = interaction;
        
        // Ensure members are fetched so bot/human counts are accurate
        await guild.members.fetch();
        
        const bots = guild.members.cache.filter(member => member.user.bot).size;
        const humans = guild.memberCount - bots;
        
        const textChannels = guild.channels.cache.filter(c => c.type === ChannelType.GuildText).size;
        const voiceChannels = guild.channels.cache.filter(c => c.type === ChannelType.GuildVoice).size;
        
        const rolesCount = guild.roles.cache.size - 1; // Subtract @everyone
        
        const owner = await guild.fetchOwner();

        const embed = createEmbed({
            title: `📊 ${guild.name} Server Info`,
            thumbnail: guild.iconURL({ dynamic: true, size: 256 }),
            fields: [
                { name: '👑 Owner', value: `${owner.user.tag}`, inline: true },
                { name: '🗓️ Created', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:D>`, inline: true },
                { name: '🌍 Region', value: guild.preferredLocale, inline: true },
                
                { name: '👥 Members', value: `Total: **${guild.memberCount}**\nHumans: ${humans}\nBots: ${bots}`, inline: true },
                { name: '💬 Channels', value: `Total: **${textChannels + voiceChannels}**\nText: ${textChannels}\nVoice: ${voiceChannels}`, inline: true },
                { name: '🏷️ Roles', value: `${rolesCount} roles`, inline: true },
                
                { name: '🎭 Verification', value: `${guild.verificationLevel}`, inline: true },
                { name: '🔥 Boosts', value: `Level ${guild.premiumTier} (${guild.premiumSubscriptionCount} boosts)`, inline: true },
                { name: '🆔 Server ID', value: guild.id, inline: true }
            ]
        });

        await interaction.editReply({ embeds: [embed] });
    },
};
