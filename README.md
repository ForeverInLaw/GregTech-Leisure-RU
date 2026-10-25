# GregTech Leisure - Russian Translation
Русская локализация для сборки **GregTech Leisure** (MC 1.20.1 Forge).

## Структура репозитория
- `quests/` — локализация квестов FTB Quests (`ru_ru.json`)
- `assets/` — ресурсы и локализация модов для KubeJS (`kubejs/assets/`):
  - `kubejs/lang/ru_ru.json` — кастомные предметы, блоки и подсказки сборки
  - `gtlcore/lang/ru_ru.json` — кор-мод сборки GTLCore
  - `gtmthings/lang/ru_ru.json` — дополнение GTMThings
  - `ad_astra/patchouli_books/` — перевод книги астронавта
  - оверрайды других модов
- `tools/` — утилиты валидации, синхронизации и глоссарий
  - `glossary.json` — эталонный глоссарий терминологии GTCEu Modern
  - `sync.js` — копирование в инстанс сборки
  - `validate.js` — проверка целостности JSON и плейсхолдеров

## Установка перевода в игру
Запустите скрипт синхронизации:
```bash
node tools/sync.js
```
Файлы будут скопированы в директории `config/ftbquests/quests/lang/` и `kubejs/assets/` сборки.
