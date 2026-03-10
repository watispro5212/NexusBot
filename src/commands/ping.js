const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../utils/embed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Checks the bot\'s network status and latency metrics.'),
    async execute(interaction) {
        const sent = await interaction.reply({ 
            embeds: [
                createEmbed({
                    title: '📶 Checking Connection...',
                    description: 'Measuring latency packets...',
                    color: '#5865F2'
                })
            ], 
            fetchReply: true 
        });

        const roundtripLatency = sent.createdTimestamp - interaction.createdTimestamp;
        const wsLatency = Math.round(interaction.client.ws.ping);

        let color = '#57F287'; // Green
        let status = 'Excellent 🟢';

        if (roundtripLatency > 400 || wsLatency > 200) {
            color = '#FEE75C'; // Yellow
            status = 'Moderate 🟡';
        }
        if (roundtripLatency > 1000 || wsLatency > 500) {
            color = '#ED4245'; // Red
            status = 'Poor 🔴';
        }

        const embed = createEmbed({
            title: '🏓 Pong!',
            color: color,
            fields: [
                { name: 'WebSocket Heartbeat', value: `\`${wsLatency}ms\``, inline: true },
                { name: 'Roundtrip Latency', value: `\`${roundtripLatency}ms\``, inline: true },
                { name: 'Network Health', value: status, inline: false }
            ]
        });

        await interaction.editReply({ embeds: [embed] });
    },
};
