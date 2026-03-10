const { 
    SlashCommandBuilder, 
    ActionRowBuilder, 
    ButtonBuilder, 
    ButtonStyle, 
    ComponentType 
} = require('discord.js');
const { createEmbed } = require('../utils/embed');

const CHOICES = {
    rock: { emoji: '🪨', beats: 'scissors', label: 'Rock' },
    paper: { emoji: '📄', beats: 'rock', label: 'Paper' },
    scissors: { emoji: '✂️', beats: 'paper', label: 'Scissors' }
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rps')
        .setDescription('Play Rock, Paper, Scissors against the bot!'),
    async execute(interaction) {
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('rps_rock').setEmoji('🪨').setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId('rps_paper').setEmoji('📄').setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId('rps_scissors').setEmoji('✂️').setStyle(ButtonStyle.Primary)
        );

        const embed = createEmbed({
            title: 'Rock, Paper, Scissors!',
            description: 'Choose your weapon below. You have 15 seconds.',
            color: '#5865F2'
        });

        const reply = await interaction.reply({ 
            embeds: [embed], 
            components: [row],
            fetchReply: true 
        });

        const collector = reply.createMessageComponentCollector({ 
            componentType: ComponentType.Button, 
            time: 15_000 
        });

        collector.on('collect', async i => {
            if (i.user.id !== interaction.user.id) {
                return i.reply({ content: 'Start your own game with `/rps`!', ephemeral: true });
            }

            const userChoiceId = i.customId.split('_')[1]; // rock, paper, or scissors
            const botChoiceId = Object.keys(CHOICES)[Math.floor(Math.random() * 3)];

            const userChoice = CHOICES[userChoiceId];
            const botChoice = CHOICES[botChoiceId];

            let resultLabel = '';
            let color = '#5865F2';

            if (userChoiceId === botChoiceId) {
                resultLabel = '🤝 It\'s a Tie!';
                color = '#FEE75C'; // yellow
            } else if (userChoice.beats === botChoiceId) {
                resultLabel = '🏆 You Win!';
                color = '#57F287'; // green
            } else {
                resultLabel = '💀 Bot Wins!';
                color = '#ED4245'; // red
            }

            const resultEmbed = createEmbed({
                title: resultLabel,
                fields: [
                    { name: 'You chose', value: `${userChoice.emoji} ${userChoice.label}`, inline: true },
                    { name: 'Bot chose', value: `${botChoice.emoji} ${botChoice.label}`, inline: true }
                ],
                color: color
            });

            // Respond to interaction and halt the collector immediately
            await i.update({ embeds: [resultEmbed], components: [] });
            collector.stop('played');
        });

        collector.on('end', async (_, reason) => {
            if (reason === 'time') {
                const timeoutEmbed = createEmbed({
                    title: '⏰ Too Slow!',
                    description: 'You took too long to choose a weapon.',
                    color: '#95A5A6'
                });
                await interaction.editReply({ embeds: [timeoutEmbed], components: [] }).catch(() => null);
            }
        });
    },
};
