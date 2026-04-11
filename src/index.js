const { ShardingManager } = require('discord.js');
const path = require('path');
const logger = require('./utils/logger');
require('dotenv').config();

const manager = new ShardingManager(path.join(__dirname, 'bot.js'), {
    token: process.env.TOKEN,
    totalShards: 'auto',
    respawn: true,
    shardList: 'auto',
    mode: 'worker' // High performance worker thread mode
});

manager.on('shardCreate', shard => {
    logger.success(`[SHARD ${shard.id}] Neural Uplink Established.`);

    shard.on('ready', () => {
        logger.success(`[SHARD ${shard.id}] Operational Integrity: 100%.`);
    });

    shard.on('disconnect', (event) => {
        logger.warn(`[SHARD ${shard.id}] Connection Severed (Code: ${event.code}). Initiating Sector Recovery...`);
    });

    shard.on('reconnecting', () => {
        logger.info(`[SHARD ${shard.id}] Resynchronizing with Global Matrix...`);
    });

    shard.on('error', error => {
        logger.error(`[SHARD ${shard.id}] Logic Failure:`, error);
    });
});

// Global spawn orchestration
(async () => {
    try {
        logger.info('Initializing Apex Core Spawn Sequence...');
        await manager.spawn({ 
            amount: 'auto', 
            delay: 5500, // Throttled to avoid Discord rate limits
            timeout: 60000 
        });
        logger.success('All Shards Synced. Apex Protocol is Live.');
    } catch (error) {
        logger.error('Critical Spawn Failure. Aborting Uplink:', error);
        process.exit(1);
    }
})();
