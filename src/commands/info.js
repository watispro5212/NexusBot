const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../utils/embed');
const packageJson = require('../../package.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Displays information about the bot and the current server.'),
    async execute(interaction) {
        const { client, guild } = interaction;
        
        const uptimeMs = client.uptime;
        const uptimeDays = Math.floor(uptimeMs / 86400000);
        const uptimeHours = Math.floor(uptimeMs / 3600000) % 24;
        const uptimeMinutes = Math.floor(uptimeMs / 60000) % 60;
        
        let uptimeString = '';
        if (uptimeDays > 0) uptimeString += `${uptimeDays}d `;
        if (uptimeHours > 0 || uptimeDays > 0) uptimeString += `${uptimeHours}h `;
        uptimeString += `${uptimeMinutes}m`;

        const embed = createEmbed({
            title: '🤖 Bot & Server Information',
            description: packageJson.description,
            thumbnail: client.user.displayAvatarURL(),
            fields: [
                { name: 'Bot Name', value: `\`${client.user.username}\``, inline: true },
                { name: 'Bot Version', value: `\`v${packageJson.version}\``, inline: true },
                { name: 'Bot Uptime', value: `\`${uptimeString}\``, inline: true },
                
                { name: 'Server Name', value: `\`${guild.name}\``, inline: true },
                { name: 'Member Count', value: `\`${guild.memberCount}\``, inline: true },
                { name: 'Created At', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:R>`, inline: true }
            ],
            footer: `Requested by ${interaction.user.tag}`
        });

        await interaction.reply({ embeds: [embed] });
    },
};
