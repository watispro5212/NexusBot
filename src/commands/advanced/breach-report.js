const { SlashCommandBuilder } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder');
const Warning = require('../../models/Warning');

/**
 * Breach Report Command
 * Lists the most recent security infractions for a target entity.
 */
module.exports = {
    data: new SlashCommandBuilder()
        .setName('breach-report')
        .setDescription('Scan for recent security breaches from a target entity.')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The entity to audit.')
                .setRequired(true)),

    async execute(interaction, client) {
        const target = interaction.options.getUser('target');

        const warnings = await Warning.find({ 
            userId: target.id, 
            guildId: interaction.guild.id 
        }).sort({ createdAt: -1 }).limit(5);

        if (warnings.length === 0) {
            return interaction.reply({
                embeds: [embedBuilder({
                    title: 'Breach Audit // CLEAN',
                    description: `No security breaches detected for entity \`${target.tag}\`.`,
                    color: '#2ECC71'
                })]
            });
        }

        const reportEmbed = embedBuilder({
            title: `Breach Audit // ${target.username}`,
            description: `**Found:** \`${warnings.length}\` recent infractions.`,
            fields: warnings.map((w, i) => ({
                name: `Breach_ID: ${w._id.toString().slice(-6)}`,
                value: `**Reason:** ${w.reason}\n**Date:** <t:${Math.floor(w.createdAt / 1000)}:R>`,
                inline: false
            })),
            color: '#F1C40F',
            thumbnail: target.displayAvatarURL({ dynamic: true })
        });

        await interaction.reply({ embeds: [reportEmbed] });
    },
};
