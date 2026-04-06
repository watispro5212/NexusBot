const { SlashCommandBuilder } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder');

/**
 * Intelligence Computation Engine
 * Solves mathematical expressions for the operative.
 */
module.exports = {
    data: new SlashCommandBuilder()
        .setName('math')
        .setDescription('Process a central intelligence operation.')
        .addStringOption(option => 
            option.setName('expression')
                .setDescription('The mathematical protocol to solve.')
                .setRequired(true)),

    async execute(interaction, client) {
        const expression = interaction.options.getString('expression');
        
        try {
            // Basic math evaluation (safely using a separate scope for simple math)
            // Note: In a production environment, use a library like mathjs for security.
            // Using a simple regex-filter for basic operations for this "Protocol" build.
            const safeExpr = expression.replace(/[^-+/*()0-9. ]/g, '');
            const result = eval(safeExpr);

            const mathEmbed = embedBuilder({
                title: 'Intelligence Engine // COMPUTATION',
                description: `**Input Protocol:** \`${expression}\`\n**Output Data:** \`${result}\``,
                color: '#5865F2'
            });

            await interaction.reply({ embeds: [mathEmbed] });
        } catch (err) {
            const errEmbed = embedBuilder({
                title: 'Computation Failure',
                description: 'The mathematical expression provided is malformed or invalid.',
                fields: [{ name: 'System Error', value: `\`${err.message}\``, inline: false }],
                color: '#ED4245'
            });

            await interaction.reply({ embeds: [errEmbed], ephemeral: true });
        }
    },
};
