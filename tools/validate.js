const fs = require('fs');
const path = require('path');

const repoPath = 'C:/Users/nevermore/GregTech-Leisure-RU';

function validateFile(sourcePath, targetPath) {
    if (!fs.existsSync(targetPath)) {
        console.warn(`[WARN] Target file does not exist: ${targetPath}`);
        return { valid: false, errors: ['File missing'] };
    }

    let srcObj, tgtObj;
    try {
        srcObj = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
    } catch (e) {
        return { valid: false, errors: [`Source JSON syntax error: ${e.message}`] };
    }

    try {
        tgtObj = JSON.parse(fs.readFileSync(targetPath, 'utf8'));
    } catch (e) {
        return { valid: false, errors: [`Target JSON syntax error: ${e.message}`] };
    }

    const errors = [];
    const srcKeys = Object.keys(srcObj);
    const tgtKeys = new Set(Object.keys(tgtObj));

    let missingKeys = 0;
    let placeholderMismatches = 0;

    for (const key of srcKeys) {
        if (!tgtKeys.has(key)) {
            missingKeys++;
            if (missingKeys <= 5) {
                errors.push(`Missing key: ${key}`);
            }
            continue;
        }

        const srcVal = String(srcObj[key]);
        const tgtVal = String(tgtObj[key]);

        // Check placeholders like %s, %d, {0}, {1}
        const srcPlaceholders = srcVal.match(/(%[sdbx]|%[0-9]+\$[sdbx]|\{[0-9]+\})/g) || [];
        const tgtPlaceholders = tgtVal.match(/(%[sdbx]|%[0-9]+\$[sdbx]|\{[0-9]+\})/g) || [];

        if (srcPlaceholders.length !== tgtPlaceholders.length) {
            placeholderMismatches++;
            if (placeholderMismatches <= 5) {
                errors.push(`Placeholder mismatch in "${key}": expected [${srcPlaceholders.join(', ')}], found [${tgtPlaceholders.join(', ')}]`);
            }
        }
    }

    console.log(`[VALIDATE] ${path.basename(targetPath)}: Total keys = ${Object.keys(tgtObj).length} / ${srcKeys.length}`);
    if (missingKeys > 0) {
        console.warn(`[WARN] Total missing keys: ${missingKeys}`);
    }
    if (placeholderMismatches > 0) {
        console.warn(`[WARN] Total placeholder mismatches: ${placeholderMismatches}`);
    }

    return {
        valid: errors.length === 0 && missingKeys === 0,
        errors,
        total: Object.keys(tgtObj).length,
        sourceTotal: srcKeys.length,
        missing: missingKeys
    };
}

if (require.main === module) {
    const questSrc = path.join(repoPath, 'source/quests/en_us.json');
    const questTgt = path.join(repoPath, 'quests/ru_ru.json');
    if (fs.existsSync(questTgt)) {
        console.log('--- Checking Quests ---');
        validateFile(questSrc, questTgt);
    }
}

module.exports = { validateFile };
