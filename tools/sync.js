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

const mergeJson = (targetFile, sourceData) => {
    let existing = {};
    if (fs.existsSync(targetFile)) {
        try {
            existing = JSON.parse(fs.readFileSync(targetFile, 'utf-8'));
        } catch (e) {}
    }
    Object.assign(existing, sourceData);
    fs.mkdirSync(path.dirname(targetFile), { recursive: true });
    fs.writeFileSync(targetFile, JSON.stringify(existing, null, 2), 'utf-8');
};

// 1. Load quest ru_ru
const questRuPath = path.join(repoPath, 'quests/ru_ru.json');
if (fs.existsSync(questRuPath)) {
    const questData = JSON.parse(fs.readFileSync(questRuPath, 'utf-8'));
    
    // Merge into repo assets
    mergeJson(path.join(repoPath, 'assets/gtlcore/lang/ru_ru.json'), questData);
    mergeJson(path.join(repoPath, 'assets/ftbquests/lang/ru_ru.json'), questData);
    
    // Copy to config/ftbquests/quests/lang/ru_ru.json
    const configDest = path.join(instancePath, 'config/ftbquests/quests/lang/ru_ru.json');
    fs.mkdirSync(path.dirname(configDest), { recursive: true });
    fs.copyFileSync(questRuPath, configDest);
    console.log(`[SYNC] Quests synced -> ${configDest}`);
}

// 2. Sync KubeJS Assets
const assetsDir = path.join(repoPath, 'assets');
if (fs.existsSync(assetsDir)) {
    const kubejsDest = path.join(instancePath, 'kubejs/assets');
    copyDirRecursive(assetsDir, kubejsDest);
    console.log(`[SYNC] Assets synced -> ${kubejsDest}`);

    // Also sync to client resourcepacks/GregTech-Leisure-RU
    const rpDir = path.join(instancePath, 'resourcepacks/GregTech-Leisure-RU');
    fs.mkdirSync(rpDir, { recursive: true });
    const mcmeta = {
        pack: {
            pack_format: 15,
            description: '§6GregTech Leisure §f- Русский перевод (квесты и моды)'
        }
    };
    fs.writeFileSync(path.join(rpDir, 'pack.mcmeta'), JSON.stringify(mcmeta, null, 2), 'utf-8');
    copyDirRecursive(assetsDir, path.join(rpDir, 'assets'));
    console.log(`[SYNC] Resource pack synced -> ${rpDir}`);
}

console.log('[SYNC] Complete!');
