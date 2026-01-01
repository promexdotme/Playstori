import os
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin

# Base URL pattern
BASE_URL = "https://buy-instant-html5games.com/games/{}/images/"

# Headers to mimic a browser (prevents some 403 errors)
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
}

def download_file(url, folder_path):
    local_filename = url.split('/')[-1]
    local_path = os.path.join(folder_path, local_filename)
    
    print(f"    Downloading: {local_filename}...")
    
    try:
        with requests.get(url, headers=HEADERS, stream=True) as r:
            r.raise_for_status()
            with open(local_path, 'wb') as f:
                for chunk in r.iter_content(chunk_size=8192):
                    f.write(chunk)
    except Exception as e:
        print(f"    [!] Failed to download {local_filename}: {e}")

def process_game_folder(game_name):
    print(f"Processing: {game_name}")
    
    # Define local images path
    images_path = os.path.join(os.getcwd(), game_name, "images")
    
    # Check if images folder exists, create if not
    if not os.path.exists(images_path):
        print(f"  -> 'images' folder missing. Creating: {images_path}")
        os.makedirs(images_path)
    else:
        print(f"  -> 'images' folder exists. Checking for files...")

    # Construct the URL for this specific game
    target_url = BASE_URL.format(game_name)
    print(f"  -> Checking URL: {target_url}")

    try:
        # Get the page content
        response = requests.get(target_url, headers=HEADERS)
        
        if response.status_code == 404:
            print("  [!] URL not found (404). Skipping.")
            return

        response.raise_for_status()

        # Parse the HTML to find links
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Look for all <a> tags that end with image extensions
        links = soup.find_all('a')
        image_count = 0
        
        for link in links:
            href = link.get('href')
            if not href:
                continue
                
            # Filter standard image extensions
            if href.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp')):
                full_image_url = urljoin(target_url, href)
                download_file(full_image_url, images_path)
                image_count += 1

        if image_count == 0:
            print("  [?] No images found on the page.")

    except Exception as e:
        print(f"  [!] Error accessing URL: {e}")

def main():
    # Get all subdirectories in the current folder
    dirs = [d for d in os.listdir('.') if os.path.isdir(d)]
    
    if not dirs:
        print("No game folders found in current directory.")
        return

    for game_folder in dirs:
        # Skip hidden folders (like .git) or the script itself if it made a folder
        if game_folder.startswith('.'): 
            continue
            
        process_game_folder(game_folder)
        print("-" * 40)

if __name__ == "__main__":
    main()