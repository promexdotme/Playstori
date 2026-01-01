import os
import shutil

# Configuration
SOURCE_DIR = 'public/games'  # Where your game folders currently live
OUTPUT_DIR = 'appstorage_zips' # Where to save the individual .zip files

# List of folders to skip based on your audit/empty notes
SKIP_FOLDERS = [
    'amazingcube', 'cars-movement', 'catchdots', 'choosegravity', 
    'circle-flip', 'circleshooter', 'color-circle', 'crossbarchallenge',
    'beat-hop', 'christmas-merge', 'color-tower', 'exit' # etc from audit.txt
]

def create_game_zips():
    # Create output directory if it doesn't exist
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)
        print(f"Created directory: {OUTPUT_DIR}")

    # Get all subdirectories in the source
    game_folders = [f for f in os.listdir(SOURCE_DIR) if os.path.isdir(os.path.join(SOURCE_DIR, f))]

    for folder_name in game_folders:
        if folder_name in SKIP_FOLDERS:
            print(f"Skipping incomplete/empty game: {folder_name}")
            continue

        source_path = os.path.join(SOURCE_DIR, folder_name)
        output_zip_path = os.path.join(OUTPUT_DIR, folder_name) # .zip is added automatically

        print(f"Zipping {folder_name}...")
        try:
            # Create zip archive of the specific folder
            shutil.make_archive(output_zip_path, 'zip', source_path)
        except Exception as e:
            print(f"Failed to zip {folder_name}: {e}")

    print("\nDone! All valid games have been zipped in:", os.path.abspath(OUTPUT_DIR))

if __name__ == "__main__":
    create_game_zips()