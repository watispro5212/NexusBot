const fs = require('fs');
const path = require('path');

const COMMANDS_DIR = path.join(__dirname, '..', 'src', 'commands');

// Colors to replace with Nexus Palette
const COLOR_MAPPINGS = [
    { old: /'#5865F2'/g, new: "'#00FFCC'" }, // Blurple -> Nexus Cyan
    { old: /'#57F287'/g, new: "'#00FFCC'" }, // Green -> Nexus Cyan (Success)
    { old: /'#ED4245'/g, new: "'#FF4B2B'" }, // Red -> Nexus Red (Error/Critical)
    { old: /'#FEE75C'/g, new: "'#FFCC00'" }, // Yellow -> Nexus Amber (Warning)
    { old: /'#3498DB'/g, new: "'#00FFCC'" }, // Light Blue -> Nexus Cyan
    { old: /'#E67E22'/g, new: "'#FFCC00'" }, // Orange -> Nexus Amber 
    { old: /'#95A5A6'/g, new: "'#A3B1C6'" }, // Grey -> Nexus Silver
    { old: /'#9B59B6'/g, new: "'#D800FF'" }, // Purple -> Nexus Neon Purple
    { old: /'#00B4D8'/g, new: "'#00FFCC'" }  // Cyan -> Nexus Cyan
];

async function runOverhaul() {
    console.log('[SYSTEM] Initiating Mass Nexus Overhaul Project...');
    
    let filesUpdated = 0;
    
    try {
        const files = fs.readdirSync(COMMANDS_DIR).filter(f => f.endsWith('.js'));
        
        for (const file of files) {
            const filePath = path.join(COMMANDS_DIR, file);
            let content = fs.readFileSync(filePath, 'utf8');
            let hasChanges = false;

            // 1. Color Replacements
            for (const mapping of COLOR_MAPPINGS) {
                if (content.match(mapping.old)) {
                    content = content.replace(mapping.old, mapping.new);
                    hasChanges = true;
                }
            }

            // 2. Phrasing Adjustments (Generic find/replace for obvious AI phrases)
            const phrases = [
                { old: /'An error occurred while executing this command\.'/g, new: "'Critical failure detected in module execution.'" },
                { old: /'You do not have permission to use this command\.'/g, new: "'Access Denied. Insufficient clearance level.'" }
            ];

            for (const phrase of phrases) {
                if (content.match(phrase.old)) {
                    content = content.replace(phrase.old, phrase.new);
                    hasChanges = true;
                }
            }

            if (hasChanges) {
                fs.writeFileSync(filePath, content, 'utf8');
                console.log(`[SUCCESS] Overhauled module: ${file}`);
                filesUpdated++;
            } else {
                console.log(`[SKIP] No legacy patterns found in: ${file}`);
            }
        }
        
        console.log(`[SYSTEM] Overhaul complete. ${filesUpdated} modules upgraded.`);
        
    } catch (err) {
        console.error('[ERROR] Overhaul failed:', err);
    }
}

runOverhaul();
