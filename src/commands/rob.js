const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../utils/embed');
const economy = require('../utils/EconomyManager');

const ROB_COOLDOWN_MS = 2 * 60 * 60 * 1000; // 2 hours
const BASE_SUCCESS_CHANCE = 0.50; // 50%
const FINE_AMOUNT = 300;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rob')
        .setDescription('Risk it all and attempt to steal from another user\'s wallet.')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The user you want to rob')
                .setRequired(true)),
    async execute(interaction) {
        const targetUser = interaction.options.getUser('target');
        const robberId = interaction.user.id;
        const targetId = targetUser.id;

        if (targetUser.bot || targetId === robberId) {
            return interaction.reply({ 
                content: 'Invalid target.', 
                ephemeral: true 
            });
        }

        const robberData = economy.getUser(robberId);
        
        // Cooldown Check
        const now = Date.now();
        const last = robberData.lastRob || 0;
        const diff = now - last;
        
        if (diff < ROB_COOLDOWN_MS) {
            const minutes = Math.ceil((ROB_COOLDOWN_MS - diff) / 60000);
            return interaction.reply({
                embeds: [createEmbed({
                    title: '⏳ Lay Low...',
                    description: `The cops are looking for you. Wait **${minutes} minutes** before robbing again.`,
                    color: 0xED4245
                })],
                ephemeral: true
            });
        }

        if (robberData.wallet < FINE_AMOUNT) {
            return interaction.reply({
                embeds: [createEmbed({
                    title: '❌ Too Poor',
                    description: `You need at least **${FINE_AMOUNT} Credits** in your wallet to pay the fine if you get caught.`,
                    color: 0xED4245
                })],
                ephemeral: true
            });
        }

        const targetData = economy.getUser(targetId);

        if (targetData.wallet < 100) {
            return interaction.reply({
                embeds: [createEmbed({
                    title: '❌ Not Worth It',
                    description: `<@${targetId}> has less than 100 Credits in their wallet. Leave them alone.`,
                    color: 0xED4245
                })],
                ephemeral: true
            });
        }

        // Execution
        robberData.lastRob = now;
        
        if (Math.random() > BASE_SUCCESS_CHANCE) {
            // FAILED
            robberData.wallet -= FINE_AMOUNT;
            economy.saveUser(robberId, robberData);

            return interaction.reply({
                embeds: [createEmbed({
                    title: '🚨 Busted!',
                    description: `You were caught trying to steal from <@${targetId}> and had to pay a fine of **${FINE_AMOUNT} Credits**.\n\nYour wallet: **${robberData.wallet.toLocaleString()}**`,
                    color: 0xED4245,
                    thumbnail: 'https://cdn4.iconfinder.com/data/icons/basic-ui-color/512/siren-512.png'
                })]
            });
        } else {
            // SUCCESS - steal 20-40% of their wallet
            const factor = (Math.floor(Math.random() * 21) + 20) / 100;
            const stolen = Math.floor(targetData.wallet * factor);
            
            robberData.wallet += stolen;
            targetData.wallet -= stolen;

            economy.saveUser(robberId, robberData);
            economy.saveUser(targetId, targetData);

            return interaction.reply({
                embeds: [createEmbed({
                    title: '🥷 Heist Successful',
                    description: `You successfully snuck away with **${stolen.toLocaleString()} Credits** from <@${targetId}>'s wallet!\n\nYour wallet: **${robberData.wallet.toLocaleString()}**`,
                    color: 0x57F287,
                    thumbnail: 'https://cdn1.iconfinder.com/data/icons/ninja-14/512/Ninja-512.png'
                })]
            });
        }
    },
};
