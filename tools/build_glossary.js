const fs = require('fs');
const path = require('path');

const repoPath = 'C:/Users/nevermore/GregTech-Leisure-RU';
const gtEn = JSON.parse(fs.readFileSync(path.join(repoPath, 'source/mods/gtceu/assets/gtceu/lang/en_us.json'), 'utf8'));
const gtRu = JSON.parse(fs.readFileSync(path.join(repoPath, 'source/mods/gtceu/assets/gtceu/lang/ru_ru.json'), 'utf8'));

const stripColorCodes = (str) => str.replace(/§[0-9a-fk-or]/gi, '').trim();

// Map common terms
const glossary = {
    voltageTiers: {
        "ULV": "Ультранизкое напряжение (ULV, 8 EU/t)",
        "LV": "Низкое напряжение (LV, 32 EU/t)",
        "MV": "Среднее напряжение (MV, 128 EU/t)",
        "HV": "Высокое напряжение (HV, 512 EU/t)",
        "EV": "Экстремальное напряжение (EV, 2048 EU/t)",
        "IV": "Превосходное напряжение (IV, 8192 EU/t)",
        "LuV": "Невероятное напряжение (LuV, 32768 EU/t)",
        "ZPM": "ZPM напряжение (ZPM, 131072 EU/t)",
        "UV": "Предельное напряжение (UV, 524288 EU/t)",
        "UHV": "Ультравысокое напряжение (UHV, 2097152 EU/t)",
        "UEV": "Ультраэкстремальное напряжение (UEV, 8388608 EU/t)",
        "UIV": "Ультрапревосходное напряжение (UIV, 33554432 EU/t)",
        "UXV": "Ультраневероятное напряжение (UXV, 134217728 EU/t)",
        "OpV": "Совершенное напряжение (OpV, 536870912 EU/t)",
        "MAX": "Максимальное напряжение (MAX, 2147483647 EU/t)"
    },
    keyTerms: {
        "Electric Motor": "Электромотор",
        "Electric Piston": "Электропоршень",
        "Electric Pump": "Электронасос",
        "Robot Arm": "Робот-манипулятор",
        "Conveyor Module": "Конвейерный модуль",
        "Emitter": "Эмиттер",
        "Sensor": "Сенсор",
        "Field Generator": "Генератор поля",
        "Cleanroom": "Стерильная комната",
        "Maintenance Hatch": "Люк обслуживания",
        "Input Bus": "Входная шина",
        "Output Bus": "Выходная шина",
        "Input Hatch": "Входной люк",
        "Output Hatch": "Выходной люк",
        "Energy Hatch": "Энергетический люк",
        "Dynamo Hatch": "Люк генератора (Динамо-люк)",
        "Coil": "Катушка",
        "Cupronickel Coil": "Медно-никелевая катушка",
        "Kanthal Coil": "Канталовая катушка",
        "Nichrome Coil": "Нихромовая катушка",
        "Ruridit Coil": "Руридитовая катушка",
        "HSS-G Coil": "Катушка из HSS-G",
        "HSS-S Coil": "Катушка из HSS-S",
        "Naquadah Coil": "Наквадовая катушка",
        "Trinium Coil": "Триниевая катушка",
        "Chemical Bath": "Химическая ванна",
        "Chemical Reactor": "Химический реактор",
        "Large Chemical Reactor": "Большой химический реактор",
        "Electric Blast Furnace": "Электрическая доменная печь",
        "Vacuum Freezer": "Вакуумный морозильник",
        "Implosion Compressor": "Имплозионный компрессор",
        "Distillation Tower": "Дистилляционная башня",
        "Circuit Assembler": "Сборщик микросхем",
        "Assembly Line": "Сборочная линия",
        "Fusion Reactor": "Термоядерный реактор",
        "Centrifuge": "Центрифуга",
        "Electrolyzer": "Электролизёр",
        "Autoclave": "Автоклав",
        "Fluid Solidifier": "Отвердитель жидкостей",
        "Fluid Extractor": "Экстрактор жидкостей",
        "Wiremill": "Проволочный стан",
        "Bending Machine": "Листогибочный станок",
        "Extruder": "Экструдер",
        "Lathe": "Токарный станок",
        "Cutting Machine": "Режущий станок",
        "Forming Press": "Пресс",
        "Thermal Centrifuge": "Термическая центрифуга",
        "Ore Washer": "Промыватель руды"
    },
    materials: {},
    machines: {}
};

// Populate materials and machines from gtceu lang
for (const [key, enVal] of Object.entries(gtEn)) {
    if (gtRu[key]) {
        const cleanEn = stripColorCodes(enVal);
        const cleanRu = stripColorCodes(gtRu[key]);

        if (key.startsWith('material.gtceu.')) {
            glossary.materials[cleanEn] = cleanRu;
        } else if (key.startsWith('block.gtceu.') && (key.endsWith('_assembler') || key.endsWith('_furnace') || key.endsWith('_generator'))) {
            glossary.machines[cleanEn] = cleanRu;
        }
    }
}

fs.writeFileSync(path.join(repoPath, 'tools/glossary.json'), JSON.stringify(glossary, null, 2), 'utf8');
console.log('Glossary generated successfully! Materials count:', Object.keys(glossary.materials).length);
