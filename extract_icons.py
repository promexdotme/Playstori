import json
import shutil
import os

def extract_thumbnails(manifest_path, target_dir):
    with open(manifest_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    games = data.get('games', [])
    processed = 0
    errors = 0
    
    # Ensure the target directory exists
    if not os.path.exists(target_dir):
        os.makedirs(target_dir)
    
    for game in games:
        game_id = game.get('id')
        thumb_path = game.get('thumb')
        
        if not game_id or not thumb_path:
            continue
            
        # Source is relative to the directory where 'games.json' is located
        source_base = os.path.dirname(os.path.abspath(manifest_path))
        source_path = os.path.join(source_base, thumb_path)
        
        if os.path.exists(source_path):
            ext = os.path.splitext(thumb_path)[1]
            target_filename = f"{game_id}{ext}"
            target_path = os.path.join(target_dir, target_filename)
            
            try:
                shutil.copy2(source_path, target_path)
                # Update the thumbnail path in the original game dictionary
                game['thumb'] = f"appstorage/icons/{target_filename}"
                processed += 1
            except Exception as e:
                print(f"Error copying {source_path} to {target_path}: {e}")
                errors += 1
        else:
            print(f"Source thumbnail not found: {source_path}")
            # Try to handle common path patterns if the explicit one is missing
            # For example, some might be in icons/icon-256.png
            errors += 1
            
    # Save the updated manifest
    with open(manifest_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4, ensure_ascii=False)
        
    print(f"Finished. Processed: {processed}, Errors: {errors}")

if __name__ == "__main__":
    MANIFEST = "public/games.json"
    TARGET = "public/appstorage/icons"
    extract_thumbnails(MANIFEST, TARGET)
