const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../utils/embed');
const shop = require('../utils/ShopManager');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shop')
        .setDescription('View the item shop catalog.'),
    async execute(interaction) {
        
        const items = shop.getAllItems();
        
        const fields = items.map(item => ({
            name: `${item.name} — \`💰 ${item.price.toLocaleString()}\``,
            value: `*${item.description}*\nUse \`/buy ${item.id}\` to purchase.`,
            inline: false
        }));

        const embed = createEmbed({
            title: '🛒 The Item Shop',
            description: 'Spend your hard-earned credits on these luxurious items!',
            fields: fields,
            color: '#D800FF'
        });

        await interaction.reply({ embeds: [embed] });
    },
};
