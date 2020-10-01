%matplotlib inline
import numpy as np
import json
import matplotlib.pylab as plt
import matplotlib.gridspec as gridspec

from musicnn.extractor import extractor

file_name = 'lie'
input_path = 'app/assets/music/' + file_name + '.mp3'
output_path = 'src/music-data/' + file_name + '.json'

MSD_taggram, MSD_tags, MSD_features = extractor(input_path, model='MSD_musicnn', input_overlap=1, extract_features=True)
MTT_taggram, MTT_tags, MTT_features = extractor(input_path, model='MTT_musicnn', input_overlap=1, extract_features=True)

taggram = np.concatenate((MSD_taggram, MTT_taggram), 1)
tags = np.concatenate((MSD_tags, MTT_tags))

showTags(taggram, tags, features)
exportJSON(taggram, tags, output_path)


def exportJSON(taggram, tags, output_path):
    taggram_list = taggram.T.tolist()
    tags_object = {tags[i]:taggram_list[i] for i in range(len(tags))}

    with open(output_path, 'w') as outfile:
        json.dump(tags_object, outfile)


def showTags(taggram, tags, features):
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
    ax.set_yticklabels(tags, fontsize=fontsize-2)

    # x-axis
    x_pos = np.arange(taggram.shape[0])
    x_label = np.arange(taggram.shape[0])
    ax.set_xticks(x_pos)
    ax.set_xticklabels(x_label, fontsize=4)

    plt.show()
