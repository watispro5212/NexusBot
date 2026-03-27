const { Events, EmbedBuilder } = require('discord.js');
const GuildConfig = require('../models/GuildConfig');

module.exports = {
    name: Events.MessageDelete,
    async execute(message, client) {
        if (!message.guild || message.author?.bot) return;

        try {
            const config = await GuildConfig.findOne({ guildId: message.guild.id });
            if (!config || !config.logChannelId) return;

            const logChannel = message.guild.channels.cache.get(config.logChannelId);
            if (!logChannel) return;

            const embed = new EmbedBuilder()
                .setTitle('🗑️ Message Deleted')
                .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
                .setDescription(`**Content:**\n${message.content || '*(No text, maybe an embed/image)*'}`)
                .addFields(
                    { name: 'Channel', value: `<#${message.channel.id}>`, inline: true },
                    { name: 'User ID', value: message.author.id, inline: true }
                )
                .setColor('#ED4245')
                .setTimestamp();

            await logChannel.send({ embeds: [embed] });
        } catch (err) {
            console.error('[LOG ERROR] messageDelete:', err);
        }
    }
};
