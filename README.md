# muser

Smart music visualizer

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

For production:

```sh
# create a production bundle.js
npm run bundle

# deploy to a surge link for demoing
npm run deploy
```

For deploy to work, you will need to change the surge URL in `package.json` `"scripts" > "deploy"` field to something else.

## License

MIT, see [LICENSE.md](http://github.com/mattdesl/threejs-app/blob/master/LICENSE.md) for details.
