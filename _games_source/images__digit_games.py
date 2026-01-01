import os
import requests
import sys
import time
from bs4 import BeautifulSoup
from urllib.parse import urljoin

# ================= CONFIGURATION =================
# Define which characters the folder name must start with to be processed.
# Examples: ['1', '2'] or ['a', 'b', 'c'] or ['101_']
# If empty [], it will process ALL folders (unless arguments are passed via command line).
FILTER_PREFIXES = ['1', '2', '3'] 

# Delay in seconds between games to prevent Rate Limiting
DELAY_BETWEEN_GAMES = 1.0 
# =================================================

BASE_URL = "https://buy-instant-html5games.com/games/{}/images/"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
}

def download_file(url, folder_path):
    local_filename = url.split('/')[-1]
    local_path = os.path.join(folder_path, local_filename)
    
    # Optional: Skip if file already exists to save bandwidth
    # if os.path.exists(local_path):
    #     print(f"    [i] Skipping {local_filename}, already exists.")
    #     return

    print(f"    Downloading: {local_filename}...")
    
    try:
        with requests.get(url, headers=HEADERS, stream=True) as r:
            if r.status_code == 200:
                with open(local_path, 'wb') as f:
                    for chunk in r.iter_content(chunk_size=8192):
                        f.write(chunk)
            else:
                print(f"    [!] Status {r.status_code} for {local_filename}")
    except Exception as e:
        print(f"    [!] Failed to download {local_filename}: {e}")

def process_game_folder(game_name):
    print(f"Processing: {game_name}")
    
    images_path = os.path.join(os.getcwd(), game_name, "images")
    
    if not os.path.exists(images_path):
        print(f"  -> 'images' folder missing. Creating: {images_path}")
        os.makedirs(images_path)
    else:
        print(f"  -> 'images' folder exists. Checking for files...")

    target_url = BASE_URL.format(game_name)
    print(f"  -> Checking URL: {target_url}")

    try:
        response = requests.get(target_url, headers=HEADERS)
        
        if response.status_code == 404:
            print("  [!] URL not found (404). Skipping.")
            return

        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        
        links = soup.find_all('a')
        image_count = 0
        
        for link in links:
            href = link.get('href')
            if not href: continue
                
            if href.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp')):
                full_image_url = urljoin(target_url, href)
                download_file(full_image_url, images_path)
                image_count += 1

        if image_count == 0:
            print("  [?] No images found on the page.")

    except Exception as e:
        print(f"  [!] Error accessing URL: {e}")

def main():
    # Check if command line arguments were provided (e.g., python script.py a b c)
    # If yes, use those instead of the hardcoded variable
    active_filters = FILTER_PREFIXES
    if len(sys.argv) > 1:
        active_filters = sys.argv[1:]
        print(f"Command line arguments detected. Overriding filters.")

    print(f"--- STARTING BATCH ---")
    if active_filters:
        print(f"Filter active: Processing folders starting with: {active_filters}")
    else:
        print("No filter active: Processing ALL folders.")
    print("-" * 40)

    dirs = sorted([d for d in os.listdir('.') if os.path.isdir(d)])
    
    count = 0
    for game_folder in dirs:
        if game_folder.startswith('.'): continue # Skip hidden folders

        # --- FILTER LOGIC ---
        # If we have filters, skip folders that don't match
        if active_filters:
            # Check if folder starts with any of the prefixes (case insensitive)
            if not game_folder.lower().startswith(tuple(p.lower() for p in active_filters)):
                continue

        process_game_folder(game_folder)
        count += 1
        
        # Sleep to respect rate limits
        time.sleep(DELAY_BETWEEN_GAMES)
        print("-" * 40)

    if count == 0:
        print("No folders matched your criteria.")
    else:
        print("Batch complete.")

if __name__ == "__main__":
    main()