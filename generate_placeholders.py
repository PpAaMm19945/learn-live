import os
import requests
import json

base_url = "https://placehold.co/1024x768/fac775/black.png?text="

# Read the scripts to get the image paths
for band in [0, 1]:
    script_path = f"public/scripts/lesson_ch01_band{band}.json"
    if not os.path.exists(script_path):
        continue

    with open(script_path, "r") as f:
        data = json.load(f)

    for i, scene in enumerate(data.get("scenes", [])):
        image_url = scene.get("imageUrl")
        if not image_url:
            continue

        # Strip leading slash
        local_path = image_url.lstrip("/")
        local_dir = os.path.dirname(local_path)
        os.makedirs(local_dir, exist_ok=True)

        if os.path.exists(local_path):
            continue

        text = f"Band+{band}+Scene+{i+1}"
        url = base_url + text

        print(f"Downloading {url} to {local_path}...")
        response = requests.get(url)
        if response.status_code == 200:
            with open(local_path, "wb") as f:
                f.write(response.content)
        else:
            print(f"Failed to download {url}")

print("Done generating placeholder images.")