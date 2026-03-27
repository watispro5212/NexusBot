const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ChannelType } = require('discord.js');
const GuildConfig = require('../models/GuildConfig');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('starboard-setup')
        .setDescription('Configure the Starboard system.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addChannelOption(opt => 
            opt.setName('channel')
                .setDescription('The channel where starred messages will be posted.')
                .addChannelTypes(ChannelType.GuildText)
                .setRequired(true)
        )
        .addIntegerOption(opt =>
            opt.setName('count')
                .setDescription('Number of ⭐ reactions required to post (default 3)')
                .setMinValue(1)
                .setRequired(false)
        ),

    async execute(interaction) {
        let config = await GuildConfig.findOne({ guildId: interaction.guild.id });
        if (!config) config = await GuildConfig.create({ guildId: interaction.guild.id });

        const channel = interaction.options.getChannel('channel');
        const count = interaction.options.getInteger('count') || 3;

        config.starboardChannelId = channel.id;
        config.starboardCount = count;
        await config.save();
        
        const embed = new EmbedBuilder()
            .setTitle('⭐ Starboard Configured')
            .setDescription(`Starboard channel set to <#${channel.id}> requiring **${count}** star(s).`)
            .setColor('#FEE75C');
        return interaction.reply({ embeds: [embed] });
    }
};
