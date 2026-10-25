const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const targetRepo = 'C:/Users/nevermore/GregTech-Leisure-RU';
const instancePath = 'C:/Users/nevermore/AppData/Roaming/PrismLauncher/instances/GregTech Leisure/minecraft';

fs.mkdirSync(path.join(targetRepo, 'source/quests'), { recursive: true });
fs.mkdirSync(path.join(targetRepo, 'source/mods/gtlcore'), { recursive: true });
fs.mkdirSync(path.join(targetRepo, 'source/mods/gtmthings'), { recursive: true });
fs.mkdirSync(path.join(targetRepo, 'source/mods/gtceu'), { recursive: true });
fs.mkdirSync(path.join(targetRepo, 'source/kubejs'), { recursive: true });
fs.mkdirSync(path.join(targetRepo, 'tools'), { recursive: true });
fs.mkdirSync(path.join(targetRepo, 'quests'), { recursive: true });
fs.mkdirSync(path.join(targetRepo, 'assets'), { recursive: true });

// Copy quests sources
fs.copyFileSync(path.join(instancePath, 'config/ftbquests/quests/lang/en_us.json'), path.join(targetRepo, 'source/quests/en_us.json'));
fs.copyFileSync(path.join(instancePath, 'config/ftbquests/quests/lang/zh_cn.json'), path.join(targetRepo, 'source/quests/zh_cn.json'));

// Extract jars
execSync(`tar -xf "${path.join(instancePath, 'mods/gtlcore-1.2.3.3.jar')}" -C "${path.join(targetRepo, 'source/mods/gtlcore')}" assets/gtlcore/lang`);
execSync(`tar -xf "${path.join(instancePath, 'mods/gtmthings-1.3.5.b.jar')}" -C "${path.join(targetRepo, 'source/mods/gtmthings')}" assets/gtmthings/lang`);
execSync(`tar -xf "${path.join(instancePath, 'mods/gtceu-1.20.1-1.4.4.jar')}" -C "${path.join(targetRepo, 'source/mods/gtceu')}" assets/gtceu/lang/en_us.json assets/gtceu/lang/ru_ru.json`);

// Copy kubejs lang files
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

copyDirRecursive(path.join(instancePath, 'kubejs/assets'), path.join(targetRepo, 'source/kubejs/assets'));

console.log('Setup and extraction complete!');
