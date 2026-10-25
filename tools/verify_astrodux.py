# -*- coding: utf-8 -*-
import os
import json
import re

src_dir = r"C:/Users/nevermore/GregTech-Leisure-RU/source/kubejs/assets/ad_astra/patchouli_books/astrodux/zh_cn"
tgt_dir = r"C:/Users/nevermore/GregTech-Leisure-RU/assets/ad_astra/patchouli_books/astrodux/ru_ru"

src_files = set()
for root, _, files in os.walk(src_dir):
    for f in files:
        if f.endswith(".json"):
            src_files.add(os.path.relpath(os.path.join(root, f), src_dir).replace(os.sep, "/"))

tgt_files = set()
for root, _, files in os.walk(tgt_dir):
    for f in files:
        if f.endswith(".json"):
            tgt_files.add(os.path.relpath(os.path.join(root, f), tgt_dir).replace(os.sep, "/"))

print(f"Source files count: {len(src_files)}")
print(f"Target files count: {len(tgt_files)}")
diff = src_files.symmetric_difference(tgt_files)
if diff:
    print("Difference:", diff)
else:
    print("File sets match 100%!")

chinese_regex = re.compile(r"[\u4e00-\u9fff]")

errors = []
for rel in sorted(tgt_files):
    p = os.path.join(tgt_dir, rel)
    try:
        with open(p, "r", encoding="utf-8") as f:
            content = f.read()
            data = json.loads(content)

        m = chinese_regex.search(content)
        if m:
            errors.append(f"{rel}: Contains untranslated Chinese text: {m.group(0)}")

        l_opens = len(re.findall(r"\$\(l:[^)]*\)", content))
        l_closes = len(re.findall(r"\$\(/l\)", content))
        if l_opens != l_closes:
            errors.append(f"{rel}: Mismatched link tags: {l_opens} open vs {l_closes} close")

        color_opens = len(re.findall(r"\$\(#[^)]*\)", content))
        color_closes = len(re.findall(r"\$\(\)", content))
        if color_opens != color_closes:
            errors.append(f"{rel}: Mismatched color tags: {color_opens} open vs {color_closes} close")

    except Exception as e:
        errors.append(f"{rel}: Failed validation: {e}")

if errors:
    print("ERRORS FOUND:")
    for err in errors:
        print(" ", err)
else:
    print("All files passed validation perfectly! No syntax errors, no untranslated Chinese, all Patchouli tags balanced!")
