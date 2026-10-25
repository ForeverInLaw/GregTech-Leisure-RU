const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const target = 'C:/Users/nevermore/GregTech-Leisure-RU/source/mods/gtladditions';
fs.mkdirSync(target, { recursive: true });

execSync(`curl.exe -s "https://raw.githubusercontent.com/Dragonators/GTLAdditions/master/src/main/resources/assets/gtladditions/lang/en_us.json" -o "${path.join(target, 'en_us.json')}"`);
execSync(`curl.exe -s "https://raw.githubusercontent.com/Dragonators/GTLAdditions/master/src/main/resources/assets/gtladditions/lang/zh_cn.json" -o "${path.join(target, 'zh_cn.json')}"`);

const en = JSON.parse(fs.readFileSync(path.join(target, 'en_us.json'), 'utf8'));
console.log('GTLAdditions keys count:', Object.keys(en).length);
