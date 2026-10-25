const fs = require('fs');
const path = require('path');

const repoPath = 'C:/Users/nevermore/GregTech-Leisure-RU';
const resultsDir = path.join(repoPath, 'tasks/quests/results');
const outPath = path.join(repoPath, 'quests/ru_ru.json');

if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir, { recursive: true });
}

if (!fs.existsSync(path.dirname(outPath))) {
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
}

const files = fs.readdirSync(resultsDir).filter(f => f.endsWith('.json'));
console.log(`[MERGE] Found ${files.length} result files in ${resultsDir}`);

const merged = {};
for (const file of files) {
    const filePath = path.join(resultsDir, file);
    try {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const count = Object.keys(data).length;
        console.log(`[MERGE] Loading ${file} (${count} keys)`);
        Object.assign(merged, data);
    } catch (e) {
        console.error(`[ERROR] Failed to parse ${file}: ${e.message}`);
    }
}

fs.writeFileSync(outPath, JSON.stringify(merged, null, 2), 'utf8');
console.log(`[MERGE] Wrote ${Object.keys(merged).length} keys to ${outPath}`);
