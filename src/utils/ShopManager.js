const INITIAL_ITEMS = [
    {
        id: 'thief_kit',
        name: '🥷 Thief Kit',
        description: 'Increases your chance of a successful robbery by 15%.',
        price: 2500,
        type: 'consumable' // Stored in inventory, consumed on use
    },
    {
        id: 'lucky_charm',
        name: '🍀 Lucky Charm',
        description: 'Grants a slight bonus to slot machine payouts.',
        price: 5000,
        type: 'passive' // Stored in inventory, gives passive buff
    },
    {
        id: 'vip_badge',
        name: '💎 VIP Badge',
        description: 'A flex item to show off your wealth on your profile.',
        price: 15000,
        type: 'flex'
    },
    {
        id: 'bank_upgrade',
        name: '🏦 Bank Expansion',
        description: 'Instantly permanently increases your bank capacity by 5,000 Credits.',
        price: 7500,
        type: 'instant' // Applied immediately upon purchase, not stored in inventory
    }
];

class ShopManager {
    constructor() {
        this.items = INITIAL_ITEMS;
    }

    getAllItems() {
        return this.items;
    }

    getItem(id) {
        return this.items.find(i => i.id === id);
    }
}

module.exports = new ShopManager();
