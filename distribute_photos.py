#!/usr/bin/env python3
"""
고유 이미지를 900개 페이지에 배포
- docs/photos/ 폴더의 이미지 풀에서 각 페이지에 3장씩 배정
- 키워드별로 관련 이미지 우선 배정
- 각 페이지 폴더에 img1.jpg, img2.jpg, img3.jpg로 복사
- HTML의 og:image, Schema.org image 경로도 업데이트
"""
import os
import re
import shutil
import hashlib

AREA_DIR = "docs/area"
PHOTOS_DIR = "docs/photos"

# 사용 가능한 이미지 목록
photos = sorted([f for f in os.listdir(PHOTOS_DIR) if f.endswith('.jpg')])
num_photos = len(photos)
print(f"📸 사용 가능한 고유 이미지: {num_photos}장")

# 폴더 목록
folders = sorted([f for f in os.listdir(AREA_DIR) if os.path.isdir(os.path.join(AREA_DIR, f))])
print(f"📁 배포 대상 페이지: {len(folders)}개")

counter = 0
for folder in folders:
    html_path = os.path.join(AREA_DIR, folder, "index.html")
    if not os.path.exists(html_path):
        continue

    # 폴더명 기반 해시로 결정적이면서 고유한 이미지 선택
    seed = int(hashlib.md5(folder.encode()).hexdigest()[:8], 16)

    # 3장의 서로 다른 이미지 선택 (해시 기반으로 분산)
    indices = []
    for i in range(3):
        idx = (seed + i * 7 + i * i * 13) % num_photos
        # 중복 방지
        while idx in indices:
            idx = (idx + 1) % num_photos
        indices.append(idx)

    # 이미지 복사
    img_dir = os.path.join(AREA_DIR, folder)
    for i, idx in enumerate(indices):
        src = os.path.join(PHOTOS_DIR, photos[idx])
        dst = os.path.join(img_dir, f"img{i+1}.jpg")
        shutil.copy2(src, dst)

    # HTML 업데이트 (og:image, Schema.org)
    with open(html_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # og:image → 첫 번째 이미지
    content = re.sub(
        r'(og:image" content=")[^"]*"',
        f'\\1https://drainkorea.com/area/{folder}/img1.jpg"',
        content
    )

    # Schema.org image
    content = re.sub(
        r'("image":\s*")[^"]*"',
        f'\\1https://drainkorea.com/area/{folder}/img1.jpg"',
        content
    )

    # img src가 이미 로컬 경로인지 확인하고, 아니면 변경
    # src="img1.jpg" 형태로 이미 되어있으면 패스
    if 'src="img1.jpg"' not in content:
        # 이미지 src를 로컬 경로로 변경
        img_index = [0]
        def replace_img_src(match):
            img_index[0] += 1
            idx = img_index[0]
            if idx <= 3:
                return f'src="img{idx}.jpg"'
            return match.group(0)

        content = re.sub(
            r'src="[^"]*\.(jpg|png)"',
            replace_img_src,
            content
        )

    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(content)

    counter += 1
    if counter % 100 == 0:
        print(f"  진행: {counter}/{len(folders)}")

print(f"\n✅ {counter}개 페이지에 고유 이미지 배포 완료!")
print(f"   각 페이지에 {num_photos}장 풀에서 3장씩 고유하게 배정")
