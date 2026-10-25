const fs = require('fs');
const path = require('path');

const repoPath = 'C:/Users/nevermore/GregTech-Leisure-RU';
const instancePath = 'C:/Users/nevermore/AppData/Roaming/PrismLauncher/instances/GregTech Leisure/minecraft';

const chapDir = path.join(instancePath, 'config/ftbquests/quests/chapters');
const enQuests = JSON.parse(fs.readFileSync(path.join(repoPath, 'source/quests/en_us.json'), 'utf8'));
const zhQuests = JSON.parse(fs.readFileSync(path.join(repoPath, 'source/quests/zh_cn.json'), 'utf8'));

// Read all chapters
const chapFiles = fs.readdirSync(chapDir).filter(f => f.endsWith('.snbt'));
const questToChap = {};

for (const file of chapFiles) {
    const content = fs.readFileSync(path.join(chapDir, file), 'utf8');
    const chapName = file.replace('.snbt', '');
    const matches = content.match(/id:\s*"([0-9a-fA-F]+)"/g) || [];
    for (const m of matches) {
        const id = m.replace(/id:\s*"/, '').replace('"', '').toLowerCase();
        questToChap[id] = chapName;
    }
}

const groups = {
    'part1_early': {
        name: 'Early Game (Stone Age, Steam, LV, MV, HV, Basic Machines)',
        keys: {}
    },
    'part2_mid': {
        name: 'Mid Game (EV, IV, LuV, ZPM, UV)',
        keys: {}
    },
    'part3_end': {
        name: 'End Game (UHV, UEV, UIV, UXV, OpV, MAX, Creative)',
        keys: {}
    },
    'part4_space_ae2': {
        name: 'AE2 & Space Missions (Applied Energistics, Rockets, Planets)',
        keys: {}
    },
    'part5_resources_misc': {
        name: 'Resources, Processing, Multiblocks & Root',
        keys: {}
    }
};

const earlyChapters = new Set(['250070563f8f7511', '367d3e683d1387d0', 'lv', 'mv', 'hv', '393dd40cafbb69a5', '1f2d08f4fef1cedc']);
const midChapters = new Set(['ev', '3b3502fbd9f2c4ce', '319332dbae997bbe', '12538b9410f2dec5', '2366beb7a81c122d']);
const endChapters = new Set(['219401c56581188f', '2fbfeed9d83f24b7', '23041c2cd2a7311b', '1051e55cd6bf7e7b', '508ee47aa8d412fc', '576cb57eb6b77f84']);
const spaceAe2Chapters = new Set(['ae2', '40507aa144bc3d21', '49ed18a26c5a1b83', '5786819a13d84d25', '5d8bd23aa2113dc2', '606a554994c6b31d', '6c61a50ca7cb2d5c', '703afb9ef6fdd14e', '77c762813215sadd', '77f8039ace718c6c', '7e81caa9c19b48f9']);

for (const [key, enVal] of Object.entries(enQuests)) {
    const zhVal = zhQuests[key] || '';
    const item = { en: enVal, zh: zhVal };

    if (key.startsWith('gtlcore.quest.gtl.chapter.')) {
        const chapId = key.split('.')[4].toLowerCase();
        if (earlyChapters.has(chapId)) {
            groups['part1_early'].keys[key] = item;
        } else if (midChapters.has(chapId)) {
            groups['part2_mid'].keys[key] = item;
        } else if (endChapters.has(chapId)) {
            groups['part3_end'].keys[key] = item;
        } else if (spaceAe2Chapters.has(chapId)) {
            groups['part4_space_ae2'].keys[key] = item;
        } else {
            groups['part5_resources_misc'].keys[key] = item;
        }
    } else if (key.startsWith('gtlcore.quest.gtl.quest.')) {
        const questId = key.split('.')[4].toLowerCase();
        const chapId = (questToChap[questId] || '').toLowerCase();

        if (earlyChapters.has(chapId)) {
            groups['part1_early'].keys[key] = item;
        } else if (midChapters.has(chapId)) {
            groups['part2_mid'].keys[key] = item;
        } else if (endChapters.has(chapId)) {
            groups['part3_end'].keys[key] = item;
        } else if (spaceAe2Chapters.has(chapId)) {
            groups['part4_space_ae2'].keys[key] = item;
        } else {
            groups['part5_resources_misc'].keys[key] = item;
        }
    } else {
        groups['part5_resources_misc'].keys[key] = item;
    }
}

// Add the 6 missing keys from zh
for (const [key, zhVal] of Object.entries(zhQuests)) {
    if (!enQuests[key]) {
        groups['part5_resources_misc'].keys[key] = { en: zhVal, zh: zhVal };
    }
}

const taskDir = path.join(repoPath, 'tasks/quests');
fs.mkdirSync(taskDir, { recursive: true });

for (const [grpKey, grp] of Object.entries(groups)) {
    const filePath = path.join(taskDir, `${grpKey}.json`);
    fs.writeFileSync(filePath, JSON.stringify(grp, null, 2), 'utf8');
    console.log(`[SPLIT] ${grpKey}: ${Object.keys(grp.keys).length} keys -> ${filePath}`);
}

console.log('[SPLIT] Quests splitting complete!');
