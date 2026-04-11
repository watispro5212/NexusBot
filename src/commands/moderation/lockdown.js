const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lockdown')
        .setDescription('Emergency server-wide lockdown — revoke messaging in all text channels.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption(option =>
            option.setName('action')
                .setDescription('Lock or lift the lockdown.')
                .setRequired(true)
                .addChoices(
                    { name: 'Engage Lockdown', value: 'lock' },
                    { name: 'Lift Lockdown', value: 'lift' }
                ))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for the lockdown.')
                .setRequired(false)),
    cooldown: 30,
    async execute(interaction) {
        const action = interaction.options.getString('action');
        const reason = interaction.options.getString('reason') || 'No reason provided.';

        await interaction.deferReply();

        const textChannels = interaction.guild.channels.cache.filter(
            c => c.isTextBased() && !c.isThread() && c.permissionsFor(interaction.guild.roles.everyone)
        );

        let modified = 0;
        const errors = [];

        for (const [, channel] of textChannels) {
            try {
                if (action === 'lock') {
                    await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
                        SendMessages: false
                    }, { reason: `Lockdown by ${interaction.user.tag}: ${reason}` });
                } else {
                    await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
                        SendMessages: null
                    }, { reason: `Lockdown lifted by ${interaction.user.tag}` });
                }
                modified++;
            } catch (err) {
                errors.push(channel.name);
            }
        }

        const isLock = action === 'lock';

        await interaction.editReply({
            embeds: [embedBuilder({
                title: isLock ? '🔒 Server Lockdown Engaged' : '🔓 Server Lockdown Lifted',
                description: [
                    `**Action:** ${isLock ? 'All channels locked' : 'All channels unlocked'}`,
                    `**Channels Affected:** \`${modified}\``,
                    `**Reason:** ${reason}`,
                    `**Moderator:** ${interaction.user.tag}`,
                    errors.length > 0 ? `\n⚠️ Failed on: ${errors.map(n => `\`${n}\``).join(', ')}` : ''
                ].filter(Boolean).join('\n'),
                color: isLock ? '#ED4245' : '#2ECC71'
            })]
        });
    },
};
