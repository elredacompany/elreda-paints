import os
import subprocess
import re

for i in range(1, 41):
    img_name = f"public/jotun_images/img_{i:02d}.png"
    if not os.path.exists(img_name):
        continue
    # crop bottom 30% where code and name are
    temp_crop = f"/tmp/crop_{i:02d}.png"
    subprocess.run(["convert", img_name, "-gravity", "South", "-crop", "100%x30%+0+0", "+repage", "-threshold", "70%", temp_crop], check=True)
    out = subprocess.run(["tesseract", temp_crop, "stdout", "-l", "eng", "--psm", "6"], capture_output=True, text=True)
    text = out.stdout
    digits = re.findall(r'\b\d{3,5}\b', text)
    print(f"img_{i:02d}: text={text.strip().replace(chr(10), ' ')} -> digits={digits}")
