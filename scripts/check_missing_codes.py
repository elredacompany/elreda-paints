import subprocess

indices = [6, 10, 11, 13, 15, 16]
for idx in indices:
    img_name = f"public/jotun_images/img_{idx:02d}.png"
    temp_crop = f"/tmp/crop_detail_{idx:02d}.png"
    subprocess.run(["convert", img_name, "-gravity", "South", "-crop", "100%x22%+0+0", "+repage", "-negate", temp_crop], check=True)
    out_eng = subprocess.run(["tesseract", temp_crop, "stdout", "-l", "eng", "--psm", "6"], capture_output=True, text=True)
    out_ara = subprocess.run(["tesseract", temp_crop, "stdout", "-l", "ara", "--psm", "6"], capture_output=True, text=True)
    print(f"[{idx:02d}] ENG: {out_eng.stdout.strip()}  ///  ARA: {out_ara.stdout.strip()}")
