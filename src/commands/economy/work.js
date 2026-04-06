const { SlashCommandBuilder } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder');
const User = require('../../models/User');

/**
 * Gig Execution Command
 * Execute a task to earn random credit rewards.
 */
module.exports = {
    data: new SlashCommandBuilder()
        .setName('work')
        .setDescription('Execute a gig to earn Nexus Credits.'),

    async execute(interaction, client) {
        const userId = interaction.user.id;
        const guildId = interaction.guild.id;

        // Find or create user
        let userData = await User.findOne({ userId, guildId });
        if (!userData) {
            userData = new User({ userId, guildId });
        }

        const now = new Date();
        const minWork = 200;
        const maxWork = 800;
        const cooldown = 60 * 60 * 1000; // 1 hour

        if (userData.lastWork && (now - userData.lastWork < cooldown)) {
            const timeLeft = cooldown - (now - userData.lastWork);
            const minutes = Math.floor(timeLeft / 60000);
            const seconds = Math.floor((timeLeft % 60000) / 1000);

            return interaction.reply({
                embeds: [embedBuilder({
                    title: 'Gig Denied // REST_REQUIRED',
                    description: `Your terminal requires cooling.\n**Available in:** \`${minutes}m ${seconds}s\``,
                    color: '#ED4245'
                })],
                ephemeral: true
            });
        }

        // Grant randomized credits
        const amount = Math.floor(Math.random() * (maxWork - minWork + 1)) + minWork;
        userData.balance += amount;
        userData.lastWork = now;
        await userData.save();

        const workEmbed = embedBuilder({
            title: 'Gig Protocol // EXECUTED',
            description: `**Sub-routine Completed.**\n**Credits Earned:** \`$${amount}\`\n**New Balance:** \`$${userData.balance}\``,
            color: '#2ECC71'
        });

        await interaction.reply({ embeds: [workEmbed] });
    },
};
