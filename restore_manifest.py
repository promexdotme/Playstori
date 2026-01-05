import json
import os

path = 'public/appstorage/games.json'

with open(path, 'r', encoding='utf-8') as f:
    data = json.load(f)

# IDs to restore
existing_ids = [g['id'] for g in data['games']]

to_add = [
    {
        "id": "shiny-jewels",
        "name": "Shiny Jewels",
        "tag": "puzzle",
        "category": "🧩 Brain Puzzles",
        "version": 1,
        "description": "Match gleaming jewels in this classic match-3 puzzle adventure.",
        "path": "appstorage/games/shiny-jewels/index.html",
        "thumb": "appstorage/icons/shiny-jewels.png"
    },
    {
        "id": "tri-puzzle",
        "name": "Tri-Puzzle",
        "tag": "puzzle",
        "category": "🧩 Brain Puzzles",
        "version": 1,
        "description": "Challenge your mind with triangular puzzles!",
        "path": "appstorage/games/tri-puzzle/index.html",
        "thumb": "appstorage/icons/tri-puzzle.png"
    }
]

added = 0
for game in to_add:
    if game['id'] not in existing_ids:
        data['games'].append(game)
        added += 1

if added > 0:
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4, ensure_ascii=False)
    print(f"Added {added} missing games.")
else:
    print("Everything already up to date.")
