const { SlashCommandBuilder, PermissionFlagsBits, ChannelType, MessageFlags } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder');
const GuildConfig = require('../../models/GuildConfig');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('config')
        .setDescription('Configure guild-specific Nexus settings.')
        .addStringOption(opt => opt.setName('setting').setDescription('The setting to configure')
            .setRequired(true)
            .addChoices(
                { name: 'Welcome Channel', value: 'welcomeChannel' },
                { name: 'Log Channel', value: 'logChannel' },
                { name: 'Auto-Role', value: 'autoRole' },
                { name: 'Leveling', value: 'leveling' },
                { name: 'Level Channel', value: 'levelChannel' },
                { name: 'Suggestions Channel', value: 'suggestionsChannel' },
                { name: 'Starboard Channel', value: 'starboardChannel' },
                { name: 'Starboard Threshold', value: 'starboardThreshold' },
                { name: 'View All', value: 'view' }
            ))
        .addStringOption(opt => opt.setName('value').setDescription('Channel mention, role mention, number, or on/off').setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    cooldown: 5,
    async execute(interaction) {
        const setting = interaction.options.getString('setting');
        const value = interaction.options.getString('value');

        try {
            // Use findOneAndUpdate with upsert to avoid the pre-save hook issues
            let config = await GuildConfig.findOne({ guildId: interaction.guild.id });
            if (!config) {
                config = await GuildConfig.create({ guildId: interaction.guild.id });
            }

            // ═══ VIEW ALL SETTINGS ═══
            if (setting === 'view') {
                return await interaction.reply({
                    embeds: [embedBuilder({
                        title: '⚙️ Guild Configuration',
                        description: `Settings for **${interaction.guild.name}**`,
                        fields: [
                            { name: '👋 Welcome Channel', value: config.welcomeChannel ? `<#${config.welcomeChannel}>` : '`Not set`', inline: true },
                            { name: '📋 Log Channel', value: config.logChannel ? `<#${config.logChannel}>` : '`Not set`', inline: true },
                            { name: '🎭 Auto-Role', value: config.autoRole ? `<@&${config.autoRole}>` : '`Not set`', inline: true },
                            { name: '📊 Leveling', value: config.levelingEnabled ? '`✅ Enabled`' : '`❌ Disabled`', inline: true },
                            { name: '📈 Level Channel', value: config.levelChannel ? `<#${config.levelChannel}>` : '`Not set`', inline: true },
                            { name: '💡 Suggestions', value: config.suggestionsChannel ? `<#${config.suggestionsChannel}>` : '`Not set`', inline: true },
                            { name: '⭐ Starboard', value: config.starboardChannel ? `<#${config.starboardChannel}>` : '`Not set`', inline: true },
                            { name: '⭐ Threshold', value: `\`${config.starboardThreshold || 5} ⭐\``, inline: true },
                        ],
                        color: '#00F5FF'
                    })]
                });
            }

            // ═══ REQUIRE VALUE ═══
            if (!value) {
                return await interaction.reply({
                    embeds: [embedBuilder({
                        title: '⚠️ Missing Value',
                        description: 'Please provide a value for this setting.\n\n**Examples:**\n• Channel: `#channel-name`\n• Role: `@role-name`\n• Toggle: `on` / `off`\n• Number: `5`',
                        color: '#FF4444'
                    })],
                    flags: [MessageFlags.Ephemeral]
                });
            }

            // ═══ BUILD UPDATE OBJECT ═══
            const update = {};
            let displayValue = '';

            const settingLabels = {
                welcomeChannel: '👋 Welcome Channel',
                logChannel: '📋 Log Channel',
                autoRole: '🎭 Auto-Role',
                leveling: '📊 Leveling',
                levelChannel: '📈 Level Channel',
                suggestionsChannel: '💡 Suggestions Channel',
                starboardChannel: '⭐ Starboard Channel',
                starboardThreshold: '⭐ Starboard Threshold',
            };

            switch (setting) {
                case 'welcomeChannel':
                case 'logChannel':
                case 'levelChannel':
                case 'suggestionsChannel':
                case 'starboardChannel': {
                    // Support both channel mention and raw ID
                    const channelId = value.replace(/[<#>]/g, '');
                    const channel = interaction.guild.channels.cache.get(channelId);

                    if (!channel) {
                        return await interaction.reply({
                            embeds: [embedBuilder({
                                title: '⚠️ Invalid Channel',
                                description: 'Please mention a valid text channel (e.g. `#general`).',
                                color: '#FF4444'
                            })],
                            flags: [MessageFlags.Ephemeral]
                        });
                    }

                    update[setting] = channelId;
                    displayValue = `<#${channelId}>`;
                    break;
                }

                case 'autoRole': {
                    if (['off', 'none', 'disable', 'remove', 'reset'].includes(value.toLowerCase())) {
                        update.autoRole = null;
                        displayValue = '`Disabled`';
                        break;
                    }
                    const roleId = value.replace(/[<@&>]/g, '');
                    const role = interaction.guild.roles.cache.get(roleId);
                    if (!role) {
                        return await interaction.reply({
                            embeds: [embedBuilder({
                                title: '⚠️ Invalid Role',
                                description: 'Please mention a valid role (e.g. `@Member`).',
                                color: '#FF4444'
                            })],
                            flags: [MessageFlags.Ephemeral]
                        });
                    }
                    update.autoRole = roleId;
                    displayValue = `<@&${roleId}>`;
                    break;
                }

                case 'leveling': {
                    const enabled = ['on', 'true', 'enable', 'yes', '1'].includes(value.toLowerCase());
                    update.levelingEnabled = enabled;
                    displayValue = enabled ? '`✅ Enabled`' : '`❌ Disabled`';
                    break;
                }

                case 'starboardThreshold': {
                    const num = parseInt(value);
                    if (isNaN(num) || num < 1 || num > 50) {
                        return await interaction.reply({
                            embeds: [embedBuilder({
                                title: '⚠️ Invalid Number',
                                description: 'Starboard threshold must be a number between **1** and **50**.',
                                color: '#FF4444'
                            })],
                            flags: [MessageFlags.Ephemeral]
                        });
                    }
                    update.starboardThreshold = num;
                    displayValue = `\`${num} ⭐\``;
                    break;
                }

                default: {
                    return await interaction.reply({
                        embeds: [embedBuilder({
                            title: '⚠️ Unknown Setting',
                            description: `Setting \`${setting}\` is not recognized.`,
                            color: '#FF4444'
                        })],
                        flags: [MessageFlags.Ephemeral]
                    });
                }
            }

            // ═══ SAVE VIA findOneAndUpdate (bypasses pre-save hook) ═══
            update.updatedAt = new Date();
            await GuildConfig.findOneAndUpdate(
                { guildId: interaction.guild.id },
                { $set: update },
                { upsert: true, new: true }
            );

            await interaction.reply({
                embeds: [embedBuilder({
                    title: '⚙️ Configuration Updated',
                    description: `**${settingLabels[setting] || setting}** has been set to ${displayValue}.`,
                    color: '#00FF88'
                })]
            });

        } catch (err) {
            console.error('[CONFIG ERROR]', err);

            const errResponse = {
                embeds: [embedBuilder({
                    title: '⚠️ Error',
                    description: `Failed to update configuration.\n\`\`\`${err.message}\`\`\``,
                    color: '#FF4444'
                })],
                flags: [MessageFlags.Ephemeral]
            };

            try {
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp(errResponse);
                } else {
                    await interaction.reply(errResponse);
                }
            } catch (e) {
                console.error('[CONFIG REPLY ERROR]', e);
            }
        }
    }
};
