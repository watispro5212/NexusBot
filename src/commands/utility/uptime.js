const { SlashCommandBuilder } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder');
const os = require('os');

/**
 * Uptime & System Diagnostics Command
 * Provides real-time data on process health and system load.
 */
module.exports = {
    data: new SlashCommandBuilder()
        .setName('uptime')
        .setDescription('Display current process health and system diagnostics.'),

    async execute(interaction, client) {
        // Calculate uptime in a human-readable format
        const totalSeconds = client.uptime / 1000;
        const days = Math.floor(totalSeconds / 86400);
        const hours = Math.floor(totalSeconds / 3600) % 24;
        const minutes = Math.floor(totalSeconds / 60) % 60;
        const seconds = Math.floor(totalSeconds % 60);

        const uptimeString = `${days}d ${hours}h ${minutes}m ${seconds}s`;

        // System resource usage
        const memoryUsage = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
        const loadAvg = os.loadavg().map(avg => avg.toFixed(2)).join(', ');

        const uptimeEmbed = embedBuilder({
            title: 'System Diagnostics // UPTIME',
            description: `**Current Pulse:** \`${uptimeString}\`\n**Shard ID:** \`${client.shard?.ids[0] ?? 0}\` / \`${client.shard?.count ?? 1}\``,
            fields: [
                { name: 'Memory Load', value: `\`${memoryUsage} MB\``, inline: true },
                { name: 'CPU Health', value: `\`${loadAvg}\``, inline: true },
                { name: 'WS Ping', value: `\`${client.ws.ping}ms\``, inline: true }
            ],
            color: '#00FFE2' // Cyber Cyan
        });

        await interaction.reply({ embeds: [uptimeEmbed] });
    },
};
