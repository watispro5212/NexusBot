const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../utils/embed');

const RESPONSES = [
    "It is certain.",
    "It is decidedly so.",
    "Without a doubt.",
    "Yes - definitely.",
    "You may rely on it.",
    "As I see it, yes.",
    "Most likely.",
    "Outlook good.",
    "Yes.",
    "Signs point to yes.",
    "Reply hazy, try again.",
    "Ask again later.",
    "Better not tell you now.",
    "Cannot predict now.",
    "Concentrate and ask again.",
    "Don't count on it.",
    "My reply is no.",
    "My sources say no.",
    "Outlook not so good.",
    "Very doubtful."
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('8ball')
        .setDescription('Ask the Magic 8-Ball a yes/no question.')
        .addStringOption(option => 
            option.setName('question')
                .setDescription('The question you want to ask.')
                .setRequired(true)),
    async execute(interaction) {
        const question = interaction.options.getString('question');
        const response = RESPONSES[Math.floor(Math.random() * RESPONSES.length)];

        let color = '#00FFCC'; // Base Blurple
        
        // Color code based on typical 8-ball answers (positive/neutral/negative)
        const lowerRes = response.toLowerCase();
        if (lowerRes.includes('yes') || lowerRes.includes('certain') || lowerRes.includes('good') || lowerRes.includes('doubt')) {
            color = '#00FFCC'; // Green
        } else if (lowerRes.includes('no') || lowerRes.includes('doubtful') || lowerRes.includes('not')) {
            color = '#FF4B2B'; // Red
        } else {
            color = '#FFCC00'; // Yellow (neutral/try again)
        }

        const embed = createEmbed({
            title: '🎱 Magic 8-Ball',
            fields: [
                { name: 'Question', value: question, inline: false },
                { name: 'Answer', value: `**${response}**`, inline: false }
            ],
            color: color
        });

        await interaction.reply({ embeds: [embed] });
    },
};
