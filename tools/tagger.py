%matplotlib inline
import numpy as np
import json
import matplotlib.pylab as plt
import matplotlib.gridspec as gridspec

from musicnn.extractor import extractor

file_name = 'jungle-boogie.mp3'
path = 'app/assets/music/' + file_name

taggram, tags, features = extractor(path, model='MSD_musicnn', input_overlap=1, extract_features=True)

in_length = 3 # seconds -- by default, the model takes inputs of 3 seconds with no overlap

# depict taggram
plt.rcParams["figure.figsize"] = (10,8)
fontsize = 10
fig, ax = plt.subplots()
ax.imshow(taggram.T, interpolation=None, aspect="auto")

# title
ax.title.set_text('Taggram')
ax.title.set_fontsize(fontsize)

# x-axis title
ax.set_xlabel('(seconds)', fontsize=fontsize)

# y-axis
y_pos = np.arange(len(tags))
ax.set_yticks(y_pos)
ax.set_yticklabels(tags, fontsize=fontsize-1)

# x-axis
x_pos = np.arange(taggram.shape[0])
x_label = np.arange(taggram.shape[0])
ax.set_xticks(x_pos)
ax.set_xticklabels(x_label, fontsize=4)

plt.show()


taggram_list = taggram.T.tolist()
tags_object = {tags[i]:taggram_list[i] for i in range(len(tags))}
json.dumps(tags_object)
