const { createCanvas, loadImage, registerFont } = require('canvas');
const path = require('path');

class CanvasManager {
    constructor() {
        // Font registration would happen here if specific fonts are bundled
        // registerFont(path.join(__dirname, '../assets/fonts/Orbitron-Bold.ttf'), { family: 'Orbitron' });
    }

    /**
     * Generate a premium rank card for a user
     * @param {Object} userData { username, avatarURL, level, currentXp, requiredXp, rank }
     */
    async generateRankCard(userData) {
        const canvas = createCanvas(900, 250);
        const ctx = canvas.getContext('2d');

        // Background
        ctx.fillStyle = '#05050A';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Cyber Grid (Simulated)
        ctx.strokeStyle = 'rgba(0, 255, 204, 0.05)';
        ctx.lineWidth = 1;
        for (let i = 0; i < canvas.width; i += 40) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, canvas.height);
            ctx.stroke();
        }
        for (let i = 0; i < canvas.height; i += 40) {
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(canvas.width, i);
            ctx.stroke();
        }

        // Accent Glow
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
        gradient.addColorStop(0, 'rgba(188, 19, 254, 0.1)'); // Neon Purple
        gradient.addColorStop(1, 'rgba(0, 255, 204, 0.1)'); // Primary
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Sidebar Accent
        ctx.fillStyle = '#00FFCC';
        ctx.fillRect(0, 0, 10, canvas.height);

        // Avatar
        try {
            const avatar = await loadImage(userData.avatarURL.replace('.webp', '.png'));
            ctx.save();
            ctx.beginPath();
            ctx.arc(110, 125, 75, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(avatar, 35, 50, 150, 150);
            ctx.restore();
        } catch (e) {
            ctx.fillStyle = '#222';
            ctx.beginPath();
            ctx.arc(110, 125, 75, 0, Math.PI * 2, true);
            ctx.fill();
        }

        // Avatar Border
        ctx.strokeStyle = '#00FFCC';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(110, 125, 77, 0, Math.PI * 2, true);
        ctx.stroke();

        // Text Content
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 40px sans-serif';
        ctx.fillText(userData.username.toUpperCase(), 230, 85);

        ctx.font = '25px sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.fillText(`RANK #${userData.rank || 'N/A'}`, 230, 125);

        // Level & XP
        ctx.font = 'bold 30px sans-serif';
        ctx.fillStyle = '#00FFCC';
        const levelText = `LEVEL ${userData.level}`;
        const xpText = `${userData.currentXp} / ${userData.requiredXp} XP`;
        
        ctx.fillText(levelText, 230, 175);
        ctx.font = '20px sans-serif';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(xpText, 700, 175);

        // Progress Bar
        const barWidth = 620;
        const barHeight = 15;
        const progress = Math.min(userData.currentXp / userData.requiredXp, 1);
        
        // Bar BG
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.roundRect ? ctx.roundRect(230, 195, barWidth, barHeight, 5) : ctx.fillRect(230, 195, barWidth, barHeight);
        ctx.fill();

        // Bar Fill
        const fillGradient = ctx.createLinearGradient(230, 0, 230 + barWidth, 0);
        fillGradient.addColorStop(0, '#BC13FE');
        fillGradient.addColorStop(1, '#00FFCC');
        ctx.fillStyle = fillGradient;
        ctx.roundRect ? ctx.roundRect(230, 195, barWidth * progress, barHeight, 5) : ctx.fillRect(230, 195, barWidth * progress, barHeight);
        ctx.fill();

        return canvas.toBuffer();
    }
}

module.exports = new CanvasManager();
