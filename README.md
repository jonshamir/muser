# muser

Smart music visualizer

Muser is a “smart” music visualizer, made by [Jon Shamir](https://jonshamir.com). It is an experiment to test how maching learning technology can be used to enhance music visualization.

## How does it work?

A neural network - musicnn - predicts the musical genre for each second of a song. The predictions are then used to generate a color scheme:

east
musicnn
Folk 61%
Blues 14%
Country 10%
Classical 8%
Indie 5%
east
average
The final visualization colors are based on the 5 most-fitting genres. The visualization shapes move and react to the audio data, like any classic music visualizer.

## About

The idea for muser and the visualization itself is inspired by Wassily Kandinsky (1866-1944). Generally credited as the pioneer of abstract art, his work is well-known for its musical inspirations. Kandinsky associated specific tones and instruments to shapes and colors, thus “visualizing” a musical composition.

Colors for each genre were chosen according to the Musicmap project so that music genres which are stylistically closer will get similar colors.

The project structure is based on threejs-app .

## Credits

- threejs-app - basic web app template
- musicnn - smart music tags
- musicmap - colors & data

## Usage

Clone, `npm install`, then:

```sh
# start development server
npm run start
```

Now open [localhost:9966](http://localhost:9966/).
You can launch [localhost:9966/?gui](http://localhost:9966/?gui) to open dat.gui.

## To do

- Visualization
- Add more songs
- Seek bar functionality
- Explanation
- About
- Google analytics
