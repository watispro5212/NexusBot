const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const commands = [];
const commandsPath = path.join(__dirname, 'src', 'commands');

/**
 * Recursively find all command files in the commands directory
 * @param {string} dir - Current directory to scan
 */
const getCommands = (dir) => {
    const files = fs.readdirSync(path.join(commandsPath, dir));
    
    for (const file of files) {
        const filePath = path.join(commandsPath, dir, file);
        const stat = fs.lstatSync(filePath);
        
        if (stat.isDirectory()) {
            getCommands(path.join(dir, file));
        } else if (file.endsWith('.js')) {
            const command = require(filePath);
            if ('data' in command && 'execute' in command) {
                commands.push(command.data.toJSON());
            } else {
                console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
            }
        }
    }
};

getCommands('');

if (!process.env.TOKEN) {
    console.error('[FATAL] NEXUS_TOKEN is not defined in the environment.');
    process.exit(1);
}

const rest = new REST().setToken(process.env.TOKEN);

(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        const clientId = process.env.DISCORD_CLIENT_ID || process.env.CLIENT_ID;

        if (!clientId) {
            throw new Error('Missing DISCORD_CLIENT_ID or CLIENT_ID in .env file.');
        }

        const data = await rest.put(
            Routes.applicationCommands(clientId),
            { body: commands },
        );

        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        console.error(error);
    }
})();
