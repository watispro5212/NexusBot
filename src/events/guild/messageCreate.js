const { Events } = require('discord.js');
const User = require('../../models/User');
const GuildConfig = require('../../models/GuildConfig');
const embedBuilder = require('../../utils/embedBuilder');
const { guildConfigCache } = require('../../utils/cache');

const xpCooldowns = new Map();
const spamTracker = new Map();

/**
 * Fetch GuildConfig with cache-first strategy
 * @param {string} guildId
 * @returns {Promise<Object|null>}
 */
async function getConfig(guildId) {
    const cached = guildConfigCache.get(`guild:${guildId}`);
    if (cached) return cached;

    const config = await GuildConfig.findOne({ guildId });
    if (config) {
        guildConfigCache.set(`guild:${guildId}`, config);
    }
    return config;
}

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        if (message.author.bot || !message.guild) return;

        const guildId = message.guild.id;
        const userId = message.author.id;

        // ═══════════════════════════════
        // AUTO-MODERATION PIPELINE
        // ═══════════════════════════════
        try {
            const config = await getConfig(guildId);
            if (config?.automod) {
                // Anti-Spam Detection
                if (config.automod.antiSpam) {
                    const key = `${guildId}-${userId}`;
                    const now = Date.now();
                    const timestamps = spamTracker.get(key) || [];
                    const recent = timestamps.filter(t => now - t < 5000);
                    recent.push(now);
                    spamTracker.set(key, recent);

                    if (recent.length >= 5) {
                        await message.delete().catch(() => {});
                        await message.channel.send({
                            embeds: [embedBuilder({
                                title: '🛡️ Anti-Spam',
                                description: `${message.author}, you are sending messages too fast!`,
                                color: '#FF4444'
                            })]
                        }).then(m => setTimeout(() => m.delete().catch(() => {}), 5000));
                        spamTracker.delete(key);
                        return;
                    }
                }

                // Anti-Link Detection
                if (config.automod.antiLink) {
                    const linkRegex = /(https?:\/\/[^\s]+)|(discord\.gg\/[^\s]+)|(discord\.com\/invite\/[^\s]+)/gi;
                    if (linkRegex.test(message.content) && !message.member.permissions.has('ManageMessages')) {
                        await message.delete().catch(() => {});
                        await message.channel.send({
                            embeds: [embedBuilder({
                                title: '🛡️ Anti-Link',
                                description: `${message.author}, links are not allowed in this server!`,
                                color: '#FF4444'
                            })]
                        }).then(m => setTimeout(() => m.delete().catch(() => {}), 5000));
                        return;
                    }
                }

                // Word Filter
                if (config.automod.wordFilter && config.automod.blacklistedWords?.length > 0) {
                    const content = message.content.toLowerCase();
                    const detected = config.automod.blacklistedWords.find(word => content.includes(word));
                    if (detected && !message.member.permissions.has('ManageMessages')) {
                        await message.delete().catch(() => {});
                        await message.channel.send({
                            embeds: [embedBuilder({
                                title: '🛡️ Word Filter',
                                description: `${message.author}, your message contained a blacklisted word!`,
                                color: '#FF4444'
                            })]
                        }).then(m => setTimeout(() => m.delete().catch(() => {}), 5000));
                        return;
                    }
                }
            }
        } catch {}

        // ═══════════════════════════════
        // XP / LEVELING SYSTEM
        // ═══════════════════════════════
        try {
            const config = await getConfig(guildId);
            if (!config?.levelingEnabled) return;

            const cooldownKey = `xp-${guildId}-${userId}`;
            const now = Date.now();
            if (xpCooldowns.has(cooldownKey) && now - xpCooldowns.get(cooldownKey) < 60000) return;
            xpCooldowns.set(cooldownKey, now);

            const xpGain = Math.floor(Math.random() * 11) + 15;

            const user = await User.findOneAndUpdate(
                { userId, guildId },
                { $inc: { xp: xpGain }, $setOnInsert: { userId, guildId } },
                { upsert: true, new: true }
            );

            const xpNeeded = 5 * (user.level ** 2) + 50 * user.level + 100;

            if (user.xp >= xpNeeded) {
                user.level += 1;
                user.xp -= xpNeeded;
                await user.save();

                const announceChannel = config.logChannel
                    ? message.guild.channels.cache.get(config.logChannel)
                    : message.channel;

                if (announceChannel) {
                    await announceChannel.send({
                        embeds: [embedBuilder({
                            title: '🎉 Level Up!',
                            description: `Congratulations ${message.author}! You've reached **Level ${user.level}**!`,
                            color: '#00FF88',
                            thumbnail: message.author.displayAvatarURL({ dynamic: true, size: 128 })
                        })]
                    }).catch(() => {});
                }
            }
        } catch {}
    }
};
