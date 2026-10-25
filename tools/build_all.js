const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const repoPath = 'C:/Users/nevermore/GregTech-Leisure-RU';

console.log('=== [1/3] Merging Quests ===');
require('./merge_quests.js');

console.log('\n=== [2/3] Validating Translations ===');
const { validateFile } = require('./validate.js');

// Validate Quests
const questSrc = path.join(repoPath, 'source/quests/en_us.json');
const questTgt = path.join(repoPath, 'quests/ru_ru.json');
validateFile(questSrc, questTgt);

// Validate KubeJS
const kubejsSrc = path.join(repoPath, 'source/kubejs/assets/kubejs/lang/en_us.json');
const kubejsTgt = path.join(repoPath, 'assets/kubejs/lang/ru_ru.json');
if (fs.existsSync(kubejsTgt)) {
    validateFile(kubejsSrc, kubejsTgt);
}

// Validate GTLCore
const gtlSrc = path.join(repoPath, 'source/mods/gtlcore/assets/gtlcore/lang/en_us.json');
const gtlTgt = path.join(repoPath, 'assets/gtlcore/lang/ru_ru.json');
if (fs.existsSync(gtlTgt)) {
    validateFile(gtlSrc, gtlTgt);
}

// Validate GTMThings
const gtmSrc = path.join(repoPath, 'source/mods/gtmthings/assets/gtmthings/lang/en_us.json');
const gtmTgt = path.join(repoPath, 'assets/gtmthings/lang/ru_ru.json');
if (fs.existsSync(gtmTgt)) {
    validateFile(gtmSrc, gtmTgt);
}

console.log('\n=== [3/3] Synchronizing into PrismLauncher Instance ===');
require('./sync.js');

console.log('\n=== Build & Sync Finished Successfully! ===');
