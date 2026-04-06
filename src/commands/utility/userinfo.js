const { SlashCommandBuilder } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder');

/**
 * Entity Dossier & Profile Command
 * Pulls detailed system data on a target user or the command author.
 */
module.exports = {
    data: new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription('Pull system file and data on a specific user.')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The user protocol to scan.')
                .setRequired(false)),

    async execute(interaction, client) {
        const target = interaction.options.getMember('target') || interaction.member;
        const user = target.user;

        const infoEmbed = embedBuilder({
            title: `Entity Dossier // ${user.username}`,
            description: `**ID:** \`${user.id}\`\n**Status:** \`${target.presence?.status ?? 'Offline'}\`\n**Identity:** \`${user.bot ? 'Artificial Intelligence (Bot)' : 'Biological Entity (Human)'}\``,
            fields: [
                { name: 'Node Registration', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`, inline: true },
                { name: 'Node Integration', value: `<t:${Math.floor(target.joinedTimestamp / 1000)}:R>`, inline: true },
                { name: 'Security Clearances', value: target.roles.cache.size > 1 ? target.roles.cache.filter(r => r.name !== '@everyone').map(r => r).join(' ') : 'No special clearance detected.', inline: false }
            ],
            color: user.accentColor ?? '#BC82FF',
            thumbnail: user.displayAvatarURL({ dynamic: true, size: 512 })
        });

        await interaction.reply({ embeds: [infoEmbed] });
    },
};
