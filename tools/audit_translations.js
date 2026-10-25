const fs = require('fs');
const path = require('path');

const repo = 'C:/Users/nevermore/GregTech-Leisure-RU';
const chineseRegex = /[\u4e00-\u9fa5]/;

function auditJson(filePath, name) {
    if (!fs.existsSync(filePath)) {
        return { name, error: 'File missing' };
    }
    const content = fs.readFileSync(filePath, 'utf8');
    let data;
    try {
        data = JSON.parse(content);
    } catch (e) {
        return { name, error: `Invalid JSON: ${e.message}` };
    }

    const issues = [];
    const keys = Object.keys(data);
    let chineseCount = 0;
    let brokenTagsCount = 0;

    for (const [k, v] of Object.entries(data)) {
        const str = String(v);
        if (chineseRegex.test(str)) {
            chineseCount++;
            if (chineseCount <= 5) issues.push(`Contains Chinese: [${k}] -> "${str.slice(0, 60)}..."`);
        }
        // Check for broken pagebreak
        if (str.includes('pagebreak') && !str.includes('{@pagebreak}')) {
            brokenTagsCount++;
            if (brokenTagsCount <= 3) issues.push(`Broken pagebreak: [${k}] -> "${str}"`);
        }
    }

    return {
        name,
        totalKeys: keys.length,
        chineseCount,
        brokenTagsCount,
        issues
    };
}

console.log('=== AUDITING ALL TRANSLATION FILES ===\n');

const filesToAudit = [
    { p: path.join(repo, 'quests/ru_ru.json'), name: 'FTB Quests' },
    { p: path.join(repo, 'assets/kubejs/lang/ru_ru.json'), name: 'KubeJS Items & Blocks' },
    { p: path.join(repo, 'assets/gtlcore/lang/ru_ru.json'), name: 'GTLCore Mod' },
    { p: path.join(repo, 'assets/gtmthings/lang/ru_ru.json'), name: 'GTMThings' },
    { p: path.join(repo, 'assets/mae2/lang/ru_ru.json'), name: 'MAE2 Override' },
    { p: path.join(repo, 'assets/ad_astra_rocketed/lang/ru_ru.json'), name: 'Ad Astra Rocketed' },
    { p: path.join(repo, 'assets/shrink/lang/ru_ru.json'), name: 'Shrink' },
    { p: path.join(repo, 'assets/usclb/lang/ru_ru.json'), name: 'USCLB Clipboard' }
];

let totalKeysAll = 0;
for (const item of filesToAudit) {
    const res = auditJson(item.p, item.name);
    totalKeysAll += res.totalKeys || 0;
    console.log(`[AUDIT] ${res.name}: ${res.totalKeys} keys | Chinese: ${res.chineseCount} | Tag issues: ${res.brokenTagsCount}`);
    if (res.issues && res.issues.length > 0) {
        for (const iss of res.issues) console.log(`   ⚠️ ${iss}`);
    }
}

// Audit Astrodux books
let astroFiles = 0;
let astroChinese = 0;
function walkAstrodux(dir) {
    for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, f.name);
        if (f.isDirectory()) walkAstrodux(full);
        else if (f.name.endsWith('.json')) {
            astroFiles++;
            const c = fs.readFileSync(full, 'utf8');
            if (chineseRegex.test(c)) astroChinese++;
        }
    }
}
walkAstrodux(path.join(repo, 'assets/ad_astra/patchouli_books/astrodux/ru_ru'));
console.log(`[AUDIT] Astrodux Patchouli: ${astroFiles} files | Chinese: ${astroChinese}`);
console.log(`\nTOTAL LOCALIZED KEYS AUDITED: ${totalKeysAll}`);
