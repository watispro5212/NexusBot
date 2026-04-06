const { SlashCommandBuilder } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder');

/**
 * Hardware Catalog & Shop Command
 * Displays available items for purchase within the Nexus node.
 */
module.exports = {
    data: new SlashCommandBuilder()
        .setName('shop')
        .setDescription('Access the underground hardware catalog.'),

    async execute(interaction, client) {
        const shopEmbed = embedBuilder({
            title: 'Nexus Node // HARDWARE_CATALOG',
            description: 'Acquire high-end hardware to enhance your operative dossier. Use `/buy <item_id>` to purchase.',
            fields: [
                { name: '1. Cyber-Link', value: 'Price: `$5,000` | ID: `cyberlink`', inline: true },
                { name: '2. Neural-Shunt', value: 'Price: `$12,000` | ID: `neuralshunt`', inline: true },
                { name: '3. Data-Core', value: 'Price: `$25,000` | ID: `datacore`', inline: true },
                { name: '4. Bio-Hack', value: 'Price: `$50,000` | ID: `biohack`', inline: true },
                { name: '5. Shard-Key', value: 'Price: `$100,000` | ID: `shardkey`', inline: true },
                { name: '6. Root-Access', value: 'Price: `$500,000` | ID: `rootaccess`', inline: true }
            ],
            color: '#F1C40F' // Gold
        });

        await interaction.reply({ embeds: [shopEmbed] });
    },
};
