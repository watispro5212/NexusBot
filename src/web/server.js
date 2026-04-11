const express = require('express');
const path = require('path');
const logger = require('../utils/logger');

module.exports = (manager) => {
    const app = express();
    const port = process.env.PORT || 3000;

    // Simple stat endpoint for the dashboard
    app.get('/api/stats', async (req, res) => {
        try {
            const results = await manager.broadcastEval(c => ({
                guilds: c.guilds.cache.size,
                users: c.guilds.cache.reduce((acc, g) => acc + (g.memberCount || 0), 0)
            }));
            
            const total = results.reduce((acc, cur) => ({
                guilds: acc.guilds + cur.guilds,
                users: acc.users + cur.users
            }), { guilds: 0, users: 0 });

            res.json(total);
        } catch (err) {
            res.status(500).json({ error: 'Failed to aggregate stats' });
        }
    });

    // Static site delivery
    app.use(express.static(path.join(__dirname, '../../')));

    app.listen(port, () => {
        logger.info(`Web portal active on port ${port}`);
    });
};
