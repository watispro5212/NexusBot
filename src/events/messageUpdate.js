const { Events, EmbedBuilder } = require('discord.js');
const GuildConfig = require('../models/GuildConfig');

module.exports = {
    name: Events.MessageUpdate,
    async execute(oldMessage, newMessage, client) {
        if (!oldMessage.guild || oldMessage.author?.bot) return;
        if (oldMessage.content === newMessage.content) return; // Ignore embeds loading

        try {
            const config = await GuildConfig.findOne({ guildId: oldMessage.guild.id });
            if (!config || !config.logChannelId) return;

            const logChannel = oldMessage.guild.channels.cache.get(config.logChannelId);
            if (!logChannel) return;

            const embed = new EmbedBuilder()
                .setTitle('✏️ Message Edited')
                .setAuthor({ name: oldMessage.author.tag, iconURL: oldMessage.author.displayAvatarURL() })
                .setDescription(`[Jump to message](${newMessage.url})`)
                .addFields(
                    { name: 'Before', value: oldMessage.content || '*(No text)*' },
                    { name: 'After', value: newMessage.content || '*(No text)*' }
                )
                .setColor('#FEE75C')
                .setTimestamp();

            await logChannel.send({ embeds: [embed] });
        } catch (err) {
            console.error('[LOG ERROR] messageUpdate:', err);
        }
    }
};
