const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const economy = require('../utils/EconomyManager');
const canvas = require('../utils/CanvasManager');

function getXpRequirement(level) {
    return Math.floor(100 * Math.pow(level, 1.5));
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rank')
        .setDescription('Displays your current Level and XP progress.')
        .addUserOption(opt => 
            opt.setName('target')
                .setDescription('View another user\'s rank')
                .setRequired(false)
        ),
    async execute(interaction) {
        await interaction.deferReply();
        
        const target = interaction.options.getUser('target') || interaction.user;
        
        if (target.bot) {
            return interaction.editReply({ content: 'Bots don\'t earn XP!', flags: 64 });
        }

        const data = await economy.getUser(target.id, interaction.guild.id);
        const requiredXp = getXpRequirement(data.level);

        // Fetch leaderboard position
        const allUsers = await require('../models/User').find({ guildId: interaction.guild.id }).sort({ xp: -1, level: -1 });
        const rank = allUsers.findIndex(u => u.userId === target.id) + 1;

        const buffer = await canvas.generateRankCard({
            username: target.username,
            avatarURL: target.displayAvatarURL({ forceStatic: true, extension: 'png' }),
            level: data.level,
            currentXp: data.xp,
            requiredXp: requiredXp,
            rank: rank
        });

        const attachment = new AttachmentBuilder(buffer, { name: 'rank-card.png' });
        await interaction.editReply({ files: [attachment] });
    },
};
