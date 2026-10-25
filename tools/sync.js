const fs = require('fs');
const path = require('path');

const repoPath = 'C:/Users/nevermore/GregTech-Leisure-RU';
const instancePath = 'C:/Users/nevermore/AppData/Roaming/PrismLauncher/instances/GregTech Leisure/minecraft';

const copyDirRecursive = (src, dest) => {
    if (!fs.existsSync(src)) return;
    fs.mkdirSync(dest, { recursive: true });
    for (const item of fs.readdirSync(src, { withFileTypes: true })) {
        const srcPath = path.join(src, item.name);
        const destPath = path.join(dest, item.name);
        if (item.isDirectory()) {
            copyDirRecursive(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
};

// 1. Sync FTB Quests
const questRu = path.join(repoPath, 'quests/ru_ru.json');
if (fs.existsSync(questRu)) {
    const dest = path.join(instancePath, 'config/ftbquests/quests/lang/ru_ru.json');
    fs.copyFileSync(questRu, dest);
    console.log(`[SYNC] Quests synced -> ${dest}`);
}

// 2. Sync KubeJS Assets (covers kubejs, gtlcore, gtmthings, overrides)
const assetsDir = path.join(repoPath, 'assets');
if (fs.existsSync(assetsDir)) {
    const dest = path.join(instancePath, 'kubejs/assets');
    copyDirRecursive(assetsDir, dest);
    console.log(`[SYNC] Assets synced -> ${dest}`);
}

console.log('[SYNC] Complete!');
