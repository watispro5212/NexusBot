const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const GuildConfig = require('../models/GuildConfig');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('automod-setup')
        .setDescription('Configure the advanced Auto-Mod system.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(subcmd => 
            subcmd.setName('anti-spam')
                .setDescription('Toggle the anti-spam protection.')
                .addBooleanOption(opt => opt.setName('enabled').setDescription('Enable or disable').setRequired(true))
        )
        .addSubcommand(subcmd => 
            subcmd.setName('anti-links')
                .setDescription('Toggle the anti-link protection (blocks http/https links).')
                .addBooleanOption(opt => opt.setName('enabled').setDescription('Enable or disable').setRequired(true))
        ),

    async execute(interaction) {
        let config = await GuildConfig.findOne({ guildId: interaction.guild.id });
        if (!config) config = await GuildConfig.create({ guildId: interaction.guild.id });

        const subcmd = interaction.options.getSubcommand();
        const enabled = interaction.options.getBoolean('enabled');

        if (subcmd === 'anti-spam') {
            config.antiSpam = enabled;
            await config.save();
            
            const embed = new EmbedBuilder()
                .setTitle('🛡️ Auto-Mod: Anti-Spam')
                .setDescription(`Anti-Spam protection has been **${enabled ? 'ENABLED' : 'DISABLED'}**.`)
                .setColor(enabled ? '#00FFEA' : '#FF0055');
            return interaction.reply({ embeds: [embed] });
        }

        if (subcmd === 'anti-links') {
            config.antiLinks = enabled;
            await config.save();
            
            const embed = new EmbedBuilder()
                .setTitle('🛡️ Auto-Mod: Anti-Links')
                .setDescription(`Anti-Links protection has been **${enabled ? 'ENABLED' : 'DISABLED'}**.`)
                .setColor(enabled ? '#00FFEA' : '#FF0055');
            return interaction.reply({ embeds: [embed] });
        }
    }
};
