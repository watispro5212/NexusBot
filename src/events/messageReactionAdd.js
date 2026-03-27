const { Events, EmbedBuilder } = require('discord.js');
const GuildConfig = require('../models/GuildConfig');

// Global cache for starboarded messages to avoid spamming the log if someone keeps adding/removing reactions
const starboardCache = new Set();

module.exports = {
    name: Events.MessageReactionAdd,
    async execute(reaction, user, client) {
        if (reaction.emoji.name !== '⭐') return;
        if (reaction.partial) {
            try { await reaction.fetch(); } catch (error) { return; }
        }
        if (reaction.message.partial) {
            try { await reaction.message.fetch(); } catch (error) { return; }
        }

        const message = reaction.message;
        if (!message.guild || message.author?.bot) return;

        // Skip if already starboarded in this session
        if (starboardCache.has(message.id)) return;

        try {
            const config = await GuildConfig.findOne({ guildId: message.guild.id });
            if (!config || !config.starboardChannelId) return;
            if (reaction.count < config.starboardCount) return;

            const starboardChannel = message.guild.channels.cache.get(config.starboardChannelId);
            if (!starboardChannel) return;

            const embed = new EmbedBuilder()
                .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
                .setDescription(`${message.content || '*(No text)*'}\n\n[Jump to message](${message.url})`)
                .setColor('#FEE75C')
                .setTimestamp();
            
            // Attach image if present
            if (message.attachments.size > 0) {
                const img = message.attachments.find(a => a.contentType && a.contentType.startsWith('image/'));
                if (img) embed.setImage(img.url);
            }

            // Post to starboard
            await starboardChannel.send({ content: `⭐ ${reaction.count} | <#${message.channel.id}>`, embeds: [embed] });
            starboardCache.add(message.id);

        } catch (err) {
            console.error('[STARBOARD ERROR]', err);
        }
    }
};
