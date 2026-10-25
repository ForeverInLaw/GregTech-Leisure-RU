const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const repo = 'C:/Users/nevermore/GregTech-Leisure-RU';
const instanceMods = 'C:/Users/nevermore/AppData/Roaming/PrismLauncher/instances/GregTech Leisure/minecraft/mods';
const releaseDir = path.join(repo, 'release');
const tempDir = path.join(releaseDir, 'pack_temp');

fs.mkdirSync(releaseDir, { recursive: true });

function prepareBase(targetDir) {
    if (fs.existsSync(targetDir)) fs.rmSync(targetDir, { recursive: true, force: true });
    fs.mkdirSync(path.join(targetDir, 'config/ftbquests/quests/lang'), { recursive: true });
    fs.mkdirSync(path.join(targetDir, 'kubejs'), { recursive: true });

    // Copy quests
    fs.copyFileSync(path.join(repo, 'quests/ru_ru.json'), path.join(targetDir, 'config/ftbquests/quests/lang/ru_ru.json'));

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
    copyDir(path.join(repo, 'assets'), path.join(targetDir, 'kubejs/assets'));
}

// 1. Base ZIP (Translation only)
console.log('--- Packaging Base Translation ---');
prepareBase(tempDir);
const baseZip = path.join(releaseDir, 'GregTech-Leisure-RU-v1.0.zip');
if (fs.existsSync(baseZip)) fs.unlinkSync(baseZip);
execSync(`powershell -Command "Compress-Archive -Path '${tempDir}/*' -DestinationPath '${baseZip}' -Force"`);
console.log('Base ZIP created:', baseZip, fs.statSync(baseZip).size, 'bytes');

// 2. QOL Bundle ZIP (Translation + QOL Mods)
console.log('--- Packaging Translation + QOL Mods ---');
const qolModsDir = path.join(tempDir, 'mods');
fs.mkdirSync(qolModsDir, { recursive: true });
fs.copyFileSync(path.join(instanceMods, 'gtladditions-3.3.1Custom.jar'), path.join(qolModsDir, 'gtladditions-3.3.1Custom.jar'));
fs.copyFileSync(path.join(instanceMods, 'Stargate Journey-1.20.1-0.6.44.jar'), path.join(qolModsDir, 'Stargate Journey-1.20.1-0.6.44.jar'));
fs.copyFileSync(path.join(instanceMods, 'gtlcore-1.2.3.2-fix4.jar'), path.join(qolModsDir, 'gtlcore-1.2.3.2-fix4.jar'));

// Copy licenses
fs.copyFileSync(path.join(repo, 'optional-mods/README.md'), path.join(tempDir, 'QOL-MODS-README.md'));
fs.copyFileSync(path.join(repo, 'optional-mods/LICENSE-GTLAdditions.txt'), path.join(tempDir, 'LICENSE-GTLAdditions.txt'));
fs.copyFileSync(path.join(repo, 'optional-mods/LICENSE-StargateJourney.txt'), path.join(tempDir, 'LICENSE-StargateJourney.txt'));

const qolZip = path.join(releaseDir, 'GregTech-Leisure-RU-with-QOL-Mods-v1.0.zip');
if (fs.existsSync(qolZip)) fs.unlinkSync(qolZip);
execSync(`powershell -Command "Compress-Archive -Path '${tempDir}/*' -DestinationPath '${qolZip}' -Force"`);
console.log('QOL Bundle ZIP created:', qolZip, fs.statSync(qolZip).size, 'bytes');

// Clean temp
fs.rmSync(tempDir, { recursive: true, force: true });
console.log('\nPackaging complete!');
