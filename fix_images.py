#!/usr/bin/env python3
"""
906개 area 페이지의 깨진 Genspark 이미지 URL을
기존 working 이미지로 교체하는 스크립트
"""
import os
import re
import glob

AREA_DIR = "docs/area"
BASE_IMG_URL = "https://drainkorea.com/images"

# 9개의 working 이미지 (키워드별로 매핑)
IMAGES = [
    "hero-plumber.jpg",    # 전문가 작업
    "kitchen-sink.jpg",    # 싱크대
    "pipes.jpg",           # 배관
    "plumber-fix.jpg",     # 수리
    "plumber-sink.jpg",    # 싱크대 수리
    "sewer.jpg",           # 하수구
    "sink-drain.jpg",      # 배수구
    "toilet.jpg",          # 변기/화장실
    "tools.jpg",           # 장비/도구
]

# 키워드별 이미지 매핑 (3장씩)
KEYWORD_IMG_MAP = {
    "hasugumaghim": ["sewer.jpg", "pipes.jpg", "tools.jpg"],
    "byeongimaghim": ["toilet.jpg", "plumber-fix.jpg", "tools.jpg"],
    "singkeudaemaghim": ["kitchen-sink.jpg", "sink-drain.jpg", "plumber-sink.jpg"],
    "hasugwanseceog": ["sewer.jpg", "pipes.jpg", "hero-plumber.jpg"],
    "baegwancheongso": ["pipes.jpg", "tools.jpg", "hero-plumber.jpg"],
    "jeonghwajocheongso": ["sewer.jpg", "hero-plumber.jpg", "tools.jpg"],
    "maenholcheongso": ["sewer.jpg", "pipes.jpg", "hero-plumber.jpg"],
    "hwajangsirmaghim": ["toilet.jpg", "plumber-fix.jpg", "pipes.jpg"],
    "baesugumaghim": ["sink-drain.jpg", "pipes.jpg", "tools.jpg"],
    "yokjomaghim": ["plumber-fix.jpg", "sink-drain.jpg", "pipes.jpg"],
    "semyeondaemaghim": ["sink-drain.jpg", "plumber-sink.jpg", "tools.jpg"],
    "hasugunaemse": ["sewer.jpg", "pipes.jpg", "hero-plumber.jpg"],
    "baegwanyeogru": ["pipes.jpg", "sewer.jpg", "plumber-fix.jpg"],
    "osugwanmaghim": ["sewer.jpg", "pipes.jpg", "tools.jpg"],
    "hasuguttulgi": ["sewer.jpg", "hero-plumber.jpg", "tools.jpg"],
    "baegwannusu": ["pipes.jpg", "plumber-fix.jpg", "tools.jpg"],
    "geuriseuteulaebcheongso": ["kitchen-sink.jpg", "sink-drain.jpg", "tools.jpg"],
    "hasudogongsa": ["sewer.jpg", "pipes.jpg", "hero-plumber.jpg"],
    "baegwangyoche": ["pipes.jpg", "plumber-fix.jpg", "tools.jpg"],
    "usugwanmaghim": ["sewer.jpg", "pipes.jpg", "hero-plumber.jpg"],
}

def get_images_for_page(folder_name):
    """폴더명에서 키워드를 추출하고 적절한 이미지 3장 반환"""
    # folder_name: "ansan-hasugumaghim" -> keyword: "hasugumaghim"
    parts = folder_name.split("-", 1)
    keyword = parts[1] if len(parts) > 1 else ""

    if keyword in KEYWORD_IMG_MAP:
        return KEYWORD_IMG_MAP[keyword]

    # 기본값
    return ["hero-plumber.jpg", "pipes.jpg", "tools.jpg"]

def fix_page(html_path, folder_name):
    """페이지의 Genspark URL을 실제 이미지로 교체"""
    with open(html_path, 'r', encoding='utf-8') as f:
        content = f.read()

    images = get_images_for_page(folder_name)

    # Genspark URL 패턴 찾기
    genspark_pattern = r'https://www\.genspark\.ai/api/files/s/[^"?\s]+'
    genspark_urls = re.findall(genspark_pattern + r'(\?[^"]*)?', content)

    # 모든 Genspark URL을 순서대로 교체
    img_index = 0
    def replace_genspark(match):
        nonlocal img_index
        img = images[img_index % len(images)]
        img_index += 1
        return f"{BASE_IMG_URL}/{img}"

    new_content = re.sub(
        r'https://www\.genspark\.ai/api/files/s/[^"?\s]+(\?[^"]*)?',
        replace_genspark,
        content
    )

    # priceRange 제거 (혹시 남아있으면)
    new_content = re.sub(r'\s*"priceRange":\s*"[^"]*",?\n?', '\n', new_content)

    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(new_content)

    return img_index  # 교체된 이미지 수

# 실행
counter = 0
total_images = 0
folders = sorted(os.listdir(AREA_DIR))

for folder in folders:
    html_path = os.path.join(AREA_DIR, folder, "index.html")
    if os.path.exists(html_path):
        replaced = fix_page(html_path, folder)
        total_images += replaced
        counter += 1
        if counter % 100 == 0:
            print(f"  진행: {counter}/{len(folders)} 완료...")

print(f"\n✅ 총 {counter}개 페이지에서 {total_images}개 이미지 URL 교체 완료")
