"""
Playstori Game Importer
-----------------------
Automates adding a new game from the staging folder to appstorage.

Usage:
    python add_game.py <game-id> [--staging-path <path>]

Example:
    python add_game.py my-new-game --staging-path StagingGames/my-new-game
"""

import os
import sys
import json
import shutil
import zipfile
import argparse
from pathlib import Path

# Paths relative to project root
PROJECT_ROOT = Path(__file__).parent
PUBLIC_DIR = PROJECT_ROOT / "public"
APPSTORAGE = PUBLIC_DIR / "appstorage"
GAMES_DIR = APPSTORAGE / "games"
ICONS_DIR = APPSTORAGE / "icons"
MANIFEST_PATH = APPSTORAGE / "games.json"
STAGING_DIR = PROJECT_ROOT / "StagingGames"

# Category options
CATEGORIES = [
    "🧩 Brain Puzzles",
    "🕹️ Super Arcade",
    "🏎️ Fast & Fun",
    "🎲 Classic Tabletop",
    "✨ Learning Adventures",
    "🎯 Target & Aim"
]


def find_index_html(game_dir: Path) -> str:
    """Find the relative path to index.html within the game directory."""
    for root, dirs, files in os.walk(game_dir):
        if "index.html" in files:
            rel_path = Path(root).relative_to(game_dir)
            if rel_path == Path("."):
                return "index.html"
            return str(rel_path / "index.html").replace("\\", "/")
    return "index.html"


def find_icon(game_dir: Path, game_id: str) -> Path | None:
    """Find an icon in the game directory."""
    patterns = [
        f"{game_id}.png", f"{game_id}-logo.png", "icon.png", "icon-256.png",
        "logo.png", "thumb.png", "thumbnail.png"
    ]
    for pattern in patterns:
        for root, dirs, files in os.walk(game_dir):
            for f in files:
                if f.lower() == pattern.lower():
                    return Path(root) / f
    # Fallback: find any PNG
    for root, dirs, files in os.walk(game_dir):
        for f in files:
            if f.lower().endswith(".png") and "icon" in f.lower():
                return Path(root) / f
    return None


def create_zip(source_dir: Path, output_path: Path):
    """Create a ZIP file of the game directory."""
    with zipfile.ZipFile(output_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(source_dir):
            for file in files:
                file_path = Path(root) / file
                arcname = file_path.relative_to(source_dir)
                zipf.write(file_path, arcname)
    print(f"✅ Created ZIP: {output_path}")


def add_to_manifest(game_id: str, name: str, category: str, description: str, path: str, thumb: str):
    """Add game entry to games.json manifest."""
    with open(MANIFEST_PATH, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Check if game already exists
    for game in data.get("games", []):
        if game.get("id") == game_id:
            print(f"⚠️  Game '{game_id}' already exists in manifest. Updating...")
            game["name"] = name
            game["category"] = category
            game["description"] = description
            game["path"] = path
            game["thumb"] = thumb
            break
    else:
        # Add new entry
        new_entry = {
            "id": game_id,
            "name": name,
            "tag": "arcade",
            "category": category,
            "version": 1,
            "description": description,
            "path": path,
            "thumb": thumb
        }
        data["games"].append(new_entry)
        print(f"✅ Added '{game_id}' to manifest")
    
    with open(MANIFEST_PATH, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4, ensure_ascii=False)


def main():
    parser = argparse.ArgumentParser(description="Add a game to Playstori")
    parser.add_argument("game_id", help="Unique game ID (lowercase with hyphens)")
    parser.add_argument("--staging-path", help="Path to staging game folder")
    parser.add_argument("--name", help="Display name for the game")
    parser.add_argument("--category", type=int, choices=range(len(CATEGORIES)), 
                        help=f"Category index: {list(enumerate(CATEGORIES))}")
    parser.add_argument("--description", help="Short description")
    args = parser.parse_args()

    game_id = args.game_id.lower().replace(" ", "-")
    staging_path = Path(args.staging_path) if args.staging_path else STAGING_DIR / game_id

    if not staging_path.exists():
        print(f"❌ Staging path not found: {staging_path}")
        sys.exit(1)

    # Destination paths
    dest_game_dir = GAMES_DIR / game_id
    dest_zip = GAMES_DIR / f"{game_id}.zip"
    dest_icon = ICONS_DIR / f"{game_id}.png"

    # Step 1: Copy game assets
    if dest_game_dir.exists():
        print(f"⚠️  Game directory exists, overwriting: {dest_game_dir}")
        shutil.rmtree(dest_game_dir)
    shutil.copytree(staging_path, dest_game_dir)
    print(f"✅ Copied game to: {dest_game_dir}")

    # Step 2: Find index.html path
    index_path = find_index_html(dest_game_dir)
    full_path = f"appstorage/games/{game_id}/{index_path}"
    print(f"📍 Game path: {full_path}")

    # Step 3: Create ZIP
    create_zip(dest_game_dir, dest_zip)

    # Step 4: Copy icon
    icon_source = find_icon(dest_game_dir, game_id)
    if icon_source:
        shutil.copy2(icon_source, dest_icon)
        print(f"✅ Copied icon to: {dest_icon}")
    else:
        print(f"⚠️  No icon found. Please add manually: {dest_icon}")

    # Step 5: Get game details
    name = args.name or input(f"Enter display name [{game_id}]: ").strip() or game_id.replace("-", " ").title()
    
    if args.category is not None:
        category = CATEGORIES[args.category]
    else:
        print("\nCategories:")
        for i, cat in enumerate(CATEGORIES):
            print(f"  {i}: {cat}")
        cat_idx = input("Select category [1]: ").strip() or "1"
        category = CATEGORIES[int(cat_idx)]
    
    description = args.description or input("Enter description: ").strip() or f"Play {name}."

    # Step 6: Update manifest
    thumb_path = f"appstorage/icons/{game_id}.png"
    add_to_manifest(game_id, name, category, description, full_path, thumb_path)

    print(f"\n🎮 Game '{name}' added successfully!")
    print(f"Run 'npm run build' to include in production build.")


if __name__ == "__main__":
    main()
