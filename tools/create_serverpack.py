import os
import shutil
import zipfile

CLIENT_ONLY_MODS = {
    "chloride",
    "embeddium",
    "rubidium-extra",
    "oculus",
    "ModernUI",
    "PackMenu",
    "gpumemleakfix",
    "jecharacters",
    "JustEnoughResources"
}

def is_client_only(filename):
    lower = filename.lower()
    for m in CLIENT_ONLY_MODS:
        if lower.startswith(m.lower()):
            return True
    return False

def build_server_pack(source_dir, output_zip_path, temp_server_dir, libraries_dir=None):
    print("Preparing GregTech Leisure Server Pack...")
    if os.path.exists(temp_server_dir):
        shutil.rmtree(temp_server_dir)
    os.makedirs(temp_server_dir, exist_ok=True)

    # 1. Libraries (Pre-installed Forge 1.20.1-47.4.16)
    if libraries_dir and os.path.exists(libraries_dir):
        print("Copying pre-installed Forge libraries...")
        shutil.copytree(libraries_dir, os.path.join(temp_server_dir, "libraries"))

    # 2. Mods
    src_mods = os.path.join(source_dir, "mods")
    dst_mods = os.path.join(temp_server_dir, "mods")
    os.makedirs(dst_mods, exist_ok=True)
    
    included_mods = []
    excluded_mods = []

    for f in os.listdir(src_mods):
        if not f.endswith(".jar"):
            continue
        if is_client_only(f):
            excluded_mods.append(f)
        else:
            shutil.copy2(os.path.join(src_mods, f), os.path.join(dst_mods, f))
            included_mods.append(f)

    print(f"Mods included: {len(included_mods)}, excluded (client-only): {len(excluded_mods)}")
    for ex in excluded_mods:
        print(f"  - Excluded client mod: {ex}")

    # 3. Config
    src_config = os.path.join(source_dir, "config")
    dst_config = os.path.join(temp_server_dir, "config")
    shutil.copytree(src_config, dst_config, ignore=shutil.ignore_patterns(
        "embeddium*", "sodium*", "oculus*", "shimmer*", "ModernUI*", "packmenu*"
    ))
    print("Copied config directory.")

    # 4. Defaultconfigs
    src_defaultconfigs = os.path.join(source_dir, "defaultconfigs")
    if os.path.exists(src_defaultconfigs):
        dst_defaultconfigs = os.path.join(temp_server_dir, "defaultconfigs")
        shutil.copytree(src_defaultconfigs, dst_defaultconfigs)
        print("Copied defaultconfigs directory.")

    # 5. KubeJS
    src_kubejs = os.path.join(source_dir, "kubejs")
    dst_kubejs = os.path.join(temp_server_dir, "kubejs")
    shutil.copytree(src_kubejs, dst_kubejs, ignore=shutil.ignore_patterns("probe"))
    print("Copied kubejs directory.")

    # 6. server.properties
    server_properties = """# Minecraft server properties - GregTech Leisure
allow-flight=true
allow-nether=true
broadcast-console-to-ops=true
broadcast-rcon-to-ops=true
difficulty=hard
enable-command-block=true
enable-jmx-monitoring=false
enable-query=false
enable-rcon=false
enable-status=true
enforce-secure-profile=false
enforce-whitelist=false
entity-broadcast-range-percentage=100
force-gamemode=false
function-permission-level=2
gamemode=survival
generate-structures=true
hardcore=false
hide-online-players=false
initial-disabled-packs=
initial-enabled-packs=vanilla
level-name=world
level-seed=
level-type=minecraft\\:normal
max-chained-neighbor-updates=1000000
max-players=20
max-tick-time=180000
max-world-size=29999984
motd=\\u00A76GregTech Leisure [RU]\\u00A7r
network-compression-threshold=256
online-mode=true
op-permission-level=4
player-idle-timeout=0
prevent-proxy-connections=false
pvp=true
query.port=25565
rate-limit=0
rcon.password=
rcon.port=25575
require-resource-pack=false
server-ip=
server-port=25565
simulation-distance=8
spawn-animals=true
spawn-monsters=true
spawn-npcs=true
spawn-protection=0
sync-chunk-writes=true
use-native-transport=true
view-distance=10
white-list=false
"""
    with open(os.path.join(temp_server_dir, "server.properties"), "w", encoding="utf-8") as f:
        f.write(server_properties)

    # 7. eula.txt
    with open(os.path.join(temp_server_dir, "eula.txt"), "w", encoding="utf-8") as f:
        f.write("eula=true\n")

    # 8. user_jvm_args.txt
    user_jvm_args = """# JVM arguments for GregTech Leisure Server
# Requires Java 21!
-Xms4G
-Xmx8G
-XX:+UseG1GC
-XX:MaxGCPauseMillis=200
-XX:+UnlockExperimentalVMOptions
-XX:+DisableExplicitGC
-XX:+AlwaysPreTouch
-XX:G1NewSizePercent=30
-XX:G1MaxNewSizePercent=40
-XX:G1ReservePercent=15
-XX:G1HeapWastePercent=5
-XX:G1MixedGCCountTarget=4
-XX:InitiatingHeapOccupancyPercent=15
-XX:G1MixedGCLiveThresholdPercent=90
-XX:G1RSetUpdatingPauseTimePercent=5
-XX:SurvivorRatio=32
-XX:+PerfDisableSharedMem
-XX:MaxTenuringThreshold=1
"""
    with open(os.path.join(temp_server_dir, "user_jvm_args.txt"), "w", encoding="utf-8") as f:
        f.write(user_jvm_args)

    # 9. run.sh and run.bat
    run_sh = """#!/usr/bin/env sh
# GregTech Leisure Forge 1.20.1-47.4.16 Server Runner
if [ ! -d "libraries" ]; then
    echo "Installing Forge 1.20.1-47.4.16 Server libraries..."
    if [ ! -f "forge-1.20.1-47.4.16-installer.jar" ]; then
        curl -o forge-1.20.1-47.4.16-installer.jar https://maven.minecraftforge.net/net/minecraftforge/forge/1.20.1-47.4.16/forge-1.20.1-47.4.16-installer.jar
    fi
    java -jar forge-1.20.1-47.4.16-installer.jar --installServer
fi

java @user_jvm_args.txt @libraries/net/minecraftforge/forge/1.20.1-47.4.16/unix_args.txt nogui "$@"
"""
    with open(os.path.join(temp_server_dir, "run.sh"), "w", encoding="utf-8", newline="\n") as f:
        f.write(run_sh)

    run_bat = """@echo off
REM GregTech Leisure Forge 1.20.1-47.4.16 Server Runner
if not exist "libraries" (
    echo Installing Forge 1.20.1-47.4.16 Server libraries...
    if not exist "forge-1.20.1-47.4.16-installer.jar" (
        curl -o forge-1.20.1-47.4.16-installer.jar https://maven.minecraftforge.net/net/minecraftforge/forge/1.20.1-47.4.16/forge-1.20.1-47.4.16-installer.jar
    )
    java -jar forge-1.20.1-47.4.16-installer.jar --installServer
)

java @user_jvm_args.txt @libraries/net/minecraftforge/forge/1.20.1-47.4.16/win_args.txt nogui %*
pause
"""
    with open(os.path.join(temp_server_dir, "run.bat"), "w", encoding="utf-8", newline="\r\n") as f:
        f.write(run_bat)

    # 10. Crafty instructions README
    crafty_readme = """# GregTech Leisure 1.4.5.4 Server Pack

## Быстрый запуск в Crafty Controller:

1. **Создание сервера в Crafty:**
   - Нажмите **Create Server**.
   - Способ 1: Импортировать готовый сервер (Import Existing Server / ZIP).
   - Способ 2: Создать сервер типа Forge (MC 1.20.1, Forge 47.4.16).

2. **Загрузка файлов:**
   - Распакуйте содержимое этого архива в папку сервера в Crafty.
   - Убедитесь, что папки `mods`, `config`, `kubejs`, `defaultconfigs`, `libraries` находятся в корне сервера.

3. **Настройки сервера в Crafty:**
   - **Java Version:** Выберите **Java 21** (ОБЯЗАТЕЛЬНО! Сборка собрана под Java 21).
   - **Server Executable / Start Command:**
     - На Linux / Docker:
       `java @user_jvm_args.txt @libraries/net/minecraftforge/forge/1.20.1-47.4.16/unix_args.txt nogui`
       (или запуск через скрипт `run.sh`).
     - На Windows:
       `run.bat` или `java @user_jvm_args.txt @libraries/net/minecraftforge/forge/1.20.1-47.4.16/win_args.txt nogui`
   - **Память (RAM):**
     Минимум: **8 GB** (рекомендуется 10-12 GB при активной игре с автоматизацией GT и AE2).

4. **Особенности:**
   - Клиентские моды (шейдеры, интерфейс, графика) уже удалены — сервер не крашнется.
   - Включены моды QoL: `GTLAdditions` и `Stargate Journey`.
   - Квесты на сервере уже переведены на русский язык (`config/ftbquests/quests/lang/ru_ru.json`).
   - `eula.txt` уже принят (`eula=true`).
   - `allow-flight=true` уже включен в `server.properties` (нужен для реактивных ранцев и колец полета).
   - `max-tick-time=180000` (защита от ложного краша Watchdog при тяжелых расчетах GT).
"""
    with open(os.path.join(temp_server_dir, "README_SERVER.txt"), "w", encoding="utf-8") as f:
        f.write(crafty_readme)

    print("Building server pack archive (this may take a minute)...")
    with zipfile.ZipFile(output_zip_path, "w", zipfile.ZIP_DEFLATED) as z:
        for root, dirs, files in os.walk(temp_server_dir):
            for file in files:
                full_path = os.path.join(root, file)
                rel_path = os.path.relpath(full_path, temp_server_dir)
                z.write(full_path, rel_path)

    zip_size_mb = os.path.getsize(output_zip_path) / (1024 * 1024)
    print(f"Server pack successfully created at: {output_zip_path} ({zip_size_mb:.2f} MB)")

if __name__ == "__main__":
    source = r"C:\Users\nevermore\AppData\Roaming\PrismLauncher\instances\GregTech Leisure\minecraft"
    output = r"C:\Users\nevermore\GregTech-Leisure-RU\GregTech-Leisure-ServerPack-1.4.5.4-RU.zip"
    temp_dir = r"C:\Users\nevermore\GregTech-Leisure-RU\dist\serverpack"
    libraries = r"C:\Users\nevermore\AppData\Local\Temp\forge_test\libraries"
    build_server_pack(source, output, temp_dir, libraries)
