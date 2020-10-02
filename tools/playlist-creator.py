%matplotlib inline
import os
import numpy as np
import json
import eyed3

input_path = 'app/assets/music'
output_path = 'src/data/playlist.json'

playlist = []

for root, dirs, files in os.walk(input_path):
    for name in files:
        file_path = os.path.join(root, name)
        if file_path.endswith('mp3'):
            audiofile = eyed3.load(file_path)
            playlist.append({
            'path': file_path[4:],
            'title': audiofile.tag.title,
            'artist': audiofile.tag.artist
            })

# save playlist to JSON
with open(output_path, 'w') as outfile:
    json.dump(playlist, outfile)
