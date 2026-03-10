const { EmbedBuilder } = require('discord.js');

/**
 * Valid options:
 * @param {String} title
 * @param {String} description
 * @param {String|Number} color
 * @param {Array} fields
 * @param {String} footer
 * @param {String} thumbnail
 * @param {String} image
 * @param {Boolean} timestamp
 */
function createEmbed(options = {}) {
    const embed = new EmbedBuilder()
        .setColor(options.color || '#5865F2'); // Default to Blurple
    
    if (options.title) embed.setTitle(options.title);
    if (options.description) embed.setDescription(options.description);
    if (options.fields) embed.addFields(options.fields);
    if (options.footer) embed.setFooter({ text: options.footer });
    if (options.thumbnail) embed.setThumbnail(options.thumbnail);
    if (options.image) embed.setImage(options.image);
    if (options.timestamp !== false) embed.setTimestamp(); // Default to true if undefined

    return embed;
}

module.exports = { createEmbed };
