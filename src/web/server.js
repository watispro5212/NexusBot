const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const packageJson = require('../../package.json');

const app = express();

/** Block sensitive paths when static files are served from the repo root (open source). */
function forbiddenStaticPath(reqPath) {
    const p = reqPath.replace(/\\/g, '/');
    if (p.includes('..')) return true;
    return (
        /^\/\.[^/]/i.test(p)
        || /^\/(src|node_modules|scripts)(\/|$)/i.test(p)
        || /\.env$/i.test(p)
        || /(^|\/)package-lock\.json$/i.test(p)
    );
}

function initWebServer(manager) {
    app.use(cors());
    app.use(express.json());

    app.use((req, res, next) => {
        if (forbiddenStaticPath(req.path)) {
            return res.status(403).send('Forbidden');
        }
        next();
    });

    const staticRoot = path.join(__dirname, '../../');
    app.use(
        express.static(staticRoot, {
            dotfiles: 'deny',
            etag: true,
        }),
    );

    app.get('/api/health', (req, res) => {
        res.json({
            ok: true,
            service: 'nexus-protocol',
            version: packageJson.version,
            uptime: process.uptime(),
        });
    });

    app.get('/api/version', (req, res) => {
        res.json({
            name: packageJson.name,
            version: packageJson.version,
            description: packageJson.description,
        });
    });

    // API endpoint for live bot statistics
    app.get('/api/stats', async (req, res) => {
        try {
            const reqs = await Promise.all([
                manager.broadcastEval((c) => c.guilds.cache.size),
                manager.broadcastEval((c) => c.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)),
                manager.broadcastEval((c) => c.ws.ping),
            ]);

            const totalGuilds = reqs[0].reduce((acc, shardCount) => acc + shardCount, 0);
            const totalMembers = reqs[1].reduce((acc, memberCount) => acc + memberCount, 0);
            const shardCount = Math.max(1, manager.totalShards || reqs[2].length || 1);
            const avgPing = Math.round(reqs[2].reduce((acc, ping) => acc + ping, 0) / shardCount);

            res.json({
                guilds: totalGuilds,
                members: totalMembers,
                ping: avgPing,
                uptime: process.uptime(),
                shards: manager.totalShards,
                version: packageJson.version,
            });
        } catch (error) {
            console.error('[API Error]', error);
            res.status(500).json({ error: 'Failed to fetch network status' });
        }
    });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`[WEB] Nexus Interface running on port ${PORT}`);
    });
}

module.exports = { initWebServer };
