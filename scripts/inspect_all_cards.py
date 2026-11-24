import os
import subprocess
import re

for i in range(1, 41):
    img_name = f"public/jotun_images/img_{i:02d}.png"
    if not os.path.exists(img_name):
        continue
    temp_crop = f"/tmp/crop_ara_{i:02d}.png"
    # Invert and boost contrast for Arabic OCR
    subprocess.run(["convert", img_name, "-gravity", "South", "-crop", "100%x28%+0+0", "+repage", "-resize", "200%", "-threshold", "75%", temp_crop], check=True)
    out_eng = subprocess.run(["tesseract", temp_crop, "stdout", "-l", "eng", "--psm", "6"], capture_output=True, text=True)
    out_ara = subprocess.run(["tesseract", temp_crop, "stdout", "-l", "ara", "--psm", "6"], capture_output=True, text=True)
    print(f"[{i:02d}] ENG: {out_eng.stdout.strip().replace(chr(10), ' | ')}  ///  ARA: {out_ara.stdout.strip().replace(chr(10), ' | ')}")
