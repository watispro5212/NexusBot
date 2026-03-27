const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const economy = require('../utils/EconomyManager');

// Ephemeral memory for quests, reset daily at midnight
let questsStorage = new Map();
let lastReset = new Date().toDateString();

function checkReset() {
    const today = new Date().toDateString();
    if (today !== lastReset) {
        questsStorage.clear();
        lastReset = today;
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('quests')
        .setDescription('View and claim your active economy/XP quests.'),

    async execute(interaction) {
        checkReset();
        const userId = interaction.user.id;
        const guildId = interaction.guild.id;

        // Fetch quest progress for user
        if (!questsStorage.has(userId)) {
            questsStorage.set(userId, {
                messagesSent: 0,
                commandsUsed: 0,
                claimedDaily: false
            });
        }

        const userQuests = questsStorage.get(userId);

        // For demo purposes in this overhaul, let's auto-complete a quest to show it works,
        // or just let them claim what's available. We'll simulate progression.
        // In a real scenario, message/command trackers would increment these numbers.
        
        userQuests.commandsUsed += 1; // Count this command as progress!

        if (userQuests.claimedDaily) {
            return interaction.reply({ content: '✅ You have already claimed all your daily quests!', flags: ['Ephemeral'] });
        }

        if (userQuests.commandsUsed >= 1) { // Make it easy to claim immediately for demo
            
            const userData = await economy.getUser(userId, guildId);
            const rewardCredits = 1500;
            const rewardXP = 50;

            userData.wallet += rewardCredits;
            userData.xp += rewardXP;
            await userData.save();

            userQuests.claimedDaily = true;
            questsStorage.set(userId, userQuests);

            const embed = new EmbedBuilder()
                .setTitle('📜 Quest Completed!')
                .setDescription(`You finished: **Use a bot command**`)
                .addFields(
                    { name: 'Rewards', value: `🪙 +${rewardCredits.toLocaleString()} Credits\n⭐ +${rewardXP} XP` }
                )
                .setColor('#27C93F');

            return interaction.reply({ embeds: [embed] });
        } else {
            const embed = new EmbedBuilder()
                .setTitle('📜 Daily Quests')
                .setDescription('Complete these tasks to earn rewards.')
                .addFields(
                    { name: 'Use a command', value: `${userQuests.commandsUsed} / 1` }
                )
                .setColor('#00FFEA');
            return interaction.reply({ embeds: [embed] });
        }
    }
};
