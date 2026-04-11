const { Events } = require('discord.js');
const GuildConfig = require('../../models/GuildConfig');
const embedBuilder = require('../../utils/embedBuilder');
const { guildConfigCache } = require('../../utils/cache');

// Track messages already posted to starboard to prevent duplicates
const postedMessages = new Set();

module.exports = {
    name: Events.MessageReactionAdd,
    async execute(reaction, user) {
        // Ignore bot reactions
        if (user.bot) return;

        // Handle partial reactions (uncached messages)
        if (reaction.partial) {
            try {
                await reaction.fetch();
            } catch {
                return;
            }
        }

        if (reaction.message.partial) {
            try {
                await reaction.message.fetch();
            } catch {
                return;
            }
        }

        // Only track star reactions
        if (reaction.emoji.name !== '⭐') return;

        const guildId = reaction.message.guild?.id;
        if (!guildId) return;

        // Check guild config for starboard settings
        let config = guildConfigCache.get(`guild:${guildId}`);
        if (!config) {
            config = await GuildConfig.findOne({ guildId });
            if (config) guildConfigCache.set(`guild:${guildId}`, config);
        }

        if (!config?.starboardChannel) return;

        const threshold = config.starboardThreshold || 5;
        const starCount = reaction.count;

        if (starCount < threshold) return;

        // Prevent duplicate starboard posts
        const messageKey = `${guildId}-${reaction.message.id}`;
        if (postedMessages.has(messageKey)) return;
        postedMessages.add(messageKey);

        const starboardChannel = reaction.message.guild.channels.cache.get(config.starboardChannel);
        if (!starboardChannel) return;

        const msg = reaction.message;
        const embed = embedBuilder({
            title: '⭐ Starboard',
            description: msg.content || '*[No text content]*',
            fields: [
                { name: 'Author', value: `${msg.author}`, inline: true },
                { name: 'Channel', value: `${msg.channel}`, inline: true },
                { name: 'Stars', value: `⭐ ${starCount}`, inline: true },
                { name: 'Jump to Message', value: `[Click here](${msg.url})` }
            ],
            color: '#FFD700',
            thumbnail: msg.author.displayAvatarURL({ dynamic: true, size: 128 })
        });

        // Attach first image if present
        if (msg.attachments.size > 0) {
            const firstAttach = msg.attachments.first();
            if (firstAttach.contentType?.startsWith('image/')) {
                embed.setImage(firstAttach.url);
            }
        }

        try {
            await starboardChannel.send({ embeds: [embed] });
        } catch {}
    },
};
