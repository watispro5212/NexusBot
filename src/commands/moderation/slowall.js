const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('slowall')
        .setDescription('Set slowmode on all text channels simultaneously.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
        .addIntegerOption(option =>
            option.setName('seconds')
                .setDescription('Slowmode duration in seconds (0 to remove).')
                .setRequired(true)
                .setMinValue(0)
                .setMaxValue(21600)),
    cooldown: 30,
    async execute(interaction) {
        const seconds = interaction.options.getInteger('seconds');

        await interaction.deferReply();

        const textChannels = interaction.guild.channels.cache.filter(
            c => c.isTextBased() && !c.isThread()
        );

        let modified = 0;
        const errors = [];

        for (const [, channel] of textChannels) {
            try {
                await channel.setRateLimitPerUser(seconds,
                    `Slowall by ${interaction.user.tag}`
                );
                modified++;
            } catch {
                errors.push(channel.name);
            }
        }

        const isOff = seconds === 0;

        await interaction.editReply({
            embeds: [embedBuilder({
                title: isOff ? '⚡ Slowmode Removed' : '🐌 Slowmode Applied',
                description: [
                    `**Duration:** ${isOff ? 'Disabled' : `\`${seconds}s\` per message`}`,
                    `**Channels Affected:** \`${modified}\``,
                    `**Moderator:** ${interaction.user.tag}`,
                    errors.length > 0 ? `\n⚠️ Failed on: ${errors.map(n => `\`${n}\``).join(', ')}` : ''
                ].filter(Boolean).join('\n'),
                color: isOff ? '#2ECC71' : '#F1C40F'
            })]
        });
    },
};
