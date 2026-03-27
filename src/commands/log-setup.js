const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ChannelType } = require('discord.js');
const GuildConfig = require('../models/GuildConfig');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('log-setup')
        .setDescription('Configure the advanced server audit logging system.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addChannelOption(opt => 
            opt.setName('channel')
                .setDescription('The channel where audit logs should be sent.')
                .addChannelTypes(ChannelType.GuildText)
                .setRequired(true)
        ),

    async execute(interaction) {
        let config = await GuildConfig.findOne({ guildId: interaction.guild.id });
        if (!config) config = await GuildConfig.create({ guildId: interaction.guild.id });

        const channel = interaction.options.getChannel('channel');

        config.logChannelId = channel.id;
        await config.save();
        
        const embed = new EmbedBuilder()
            .setTitle('📝 Audit Logging Configured')
            .setDescription(`All server logs will now be directed to <#${channel.id}>.`)
            .setColor('#00FFEA');
        return interaction.reply({ embeds: [embed] });
    }
};
