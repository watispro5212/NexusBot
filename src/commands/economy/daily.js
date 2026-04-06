const { SlashCommandBuilder } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder');
const User = require('../../models/User');

/**
 * Daily Resource Allocation Command
 * Grants a set amount of credits once every 24 hours.
 */
module.exports = {
    data: new SlashCommandBuilder()
        .setName('daily')
        .setDescription('Receive your daily Nexus Credit allocation.'),

    async execute(interaction, client) {
        const userId = interaction.user.id;
        const guildId = interaction.guild.id;

        // Find or create user
        let userData = await User.findOne({ userId, guildId });
        if (!userData) {
            userData = new User({ userId, guildId });
        }

        const now = new Date();
        const baseAmount = 1000;
        const cooldown = 24 * 60 * 60 * 1000; // 24 hours

        if (userData.lastDaily && (now - userData.lastDaily < cooldown)) {
            const timeLeft = cooldown - (now - userData.lastDaily);
            const hours = Math.floor(timeLeft / 3600000);
            const minutes = Math.floor((timeLeft % 3600000) / 60000);

            return interaction.reply({
                embeds: [embedBuilder({
                    title: 'Allocation Denied // COOLDOWN',
                    description: `Your terminal is already fully charged.\n**Next Sync:** \`${hours}h ${minutes}m\``,
                    color: '#ED4245'
                })],
                ephemeral: true
            });
        }

        // Grant credits
        userData.balance += baseAmount;
        userData.lastDaily = now;
        await userData.save();

        const successEmbed = embedBuilder({
            title: 'Protocol Executed // DAILY_SYNC',
            description: `**Credits Transferred:** \`$${baseAmount}\`\n**Current Balance:** \`$${userData.balance}\``,
            color: '#2ECC71'
        });

        await interaction.reply({ embeds: [successEmbed] });
    },
};
