# muser

Muser is a “smart” music visualizer, made by [Jon Shamir](https://jonshamir.com). It is an experiment to test how maching learning technology can be used to enhance music visualization.

You can see it live here: [jonshamir.github.io/muser/](https://jonshamir.github.io/muser/).

## How does it work?

A neural network - musicnn - predicts the musical genre for each second of a song. The predictions are then used to generate a color scheme.

The final visualization colors are based on the 5 most-fitting genres. The visualization shapes move and react to the audio data, like any classic music visualizer.

## About

The idea for muser and the visualization itself is inspired by Wassily Kandinsky (1866-1944). Generally credited as the pioneer of abstract art, his work is well-known for its musical inspirations. Kandinsky associated specific tones and instruments to shapes and colors, thus “visualizing” a musical composition.

<i>Circles in a Circle</i> by Wassily Kandinsky, 1923
<img src="https://jonshamir.github.io/muser/assets/images/kandinsky.jpg" width="300">

Colors for each genre were chosen according to the [Musicmap](https://musicmap.info/) project so that music genres which are stylistically closer will get similar colors.

The project structure is based on [threejs-app](https://github.com/mattdesl/threejs-app).

## To do

- Visualization effects
- Add more songs
- Seek bar functionality
- Google analytics

## Usage

Clone, `npm install`, then:

```sh
# start development server
npm run start
```

Now open [localhost:9966](http://localhost:9966/).
You can launch [localhost:9966/?gui](http://localhost:9966/?gui) to open dat.gui.
