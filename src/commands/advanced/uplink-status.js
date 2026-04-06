const { SlashCommandBuilder } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder');

/**
 * Uplink & Shard Connectivity Status Command
 * Provides real-time diagnostics on shard health and API heartbeat.
 */
module.exports = {
    data: new SlashCommandBuilder()
        .setName('uplink-status')
        .setDescription('Check real-time shard and gateway diagnostics.'),

    async execute(interaction, client) {
        const shardId = client.shard?.ids[0] ?? 0;
        const totalShards = client.shard?.count ?? 1;
        const heartbeat = client.ws.ping;
        const guildCount = client.guilds.cache.size;

        const uptime = process.uptime();
        const hrs = Math.floor(uptime / 3600);
        const mins = Math.floor((uptime % 3600) / 60);

        const statusEmbed = embedBuilder({
            title: 'Network Operations // UPLINK_CHECK',
            description: `**Shard ID:** \`${shardId}\` / \`${totalShards}\`\n**Status:** \`STABLE\`\n**Last Heartbeat:** \`${heartbeat}ms\``,
            fields: [
                { name: 'Node Connectivity', value: `Active Nodes: \`${guildCount}\``, inline: true },
                { name: 'Gateway Latency', value: `Handshake: \`${heartbeat}ms\``, inline: true },
                { name: 'Process Uptime', value: `Running: \`${hrs}h ${mins}m\``, inline: true }
            ],
            color: heartbeat < 100 ? '#2ECC71' : heartbeat < 250 ? '#F1C40F' : '#ED4245'
        });

        await interaction.reply({ embeds: [statusEmbed] });
    },
};
