const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const repo = 'C:/Users/nevermore/GregTech-Leisure-RU';
const tempDir = path.join(repo, 'release/pack_temp');
const outZip = path.join(repo, 'release/GregTech-Leisure-RU-v1.0.zip');

fs.mkdirSync(path.join(repo, 'release'), { recursive: true });
if (fs.existsSync(tempDir)) fs.rmSync(tempDir, { recursive: true, force: true });
fs.mkdirSync(path.join(tempDir, 'config/ftbquests/quests/lang'), { recursive: true });
fs.mkdirSync(path.join(tempDir, 'kubejs'), { recursive: true });

// Copy quests
fs.copyFileSync(path.join(repo, 'quests/ru_ru.json'), path.join(tempDir, 'config/ftbquests/quests/lang/ru_ru.json'));

// Copy assets
const copyDir = (src, dest) => {
    fs.mkdirSync(dest, { recursive: true });
    for (const item of fs.readdirSync(src, { withFileTypes: true })) {
        const s = path.join(src, item.name);
        const d = path.join(dest, item.name);
        if (item.isDirectory()) copyDir(s, d);
        else fs.copyFileSync(s, d);
    }
};

copyDir(path.join(repo, 'assets'), path.join(tempDir, 'kubejs/assets'));

// Create ZIP using PowerShell
if (fs.existsSync(outZip)) fs.unlinkSync(outZip);
execSync(`powershell -Command "Compress-Archive -Path '${tempDir}/*' -DestinationPath '${outZip}' -Force"`);

// Clean temp
fs.rmSync(tempDir, { recursive: true, force: true });
console.log('Release archive created successfully!');
console.log('Path:', outZip);
console.log('Size:', fs.statSync(outZip).size, 'bytes');
