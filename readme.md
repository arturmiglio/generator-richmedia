# RichMedia Banner generator

[Yeoman](http://yeoman.io) generator for HTML5 banner development.

![](http://i.imgur.com/VrkuFOg.jpg)

## Features

* CSS Autoprefixing
* Built-in preview server with BrowserSync

For more information on what `generator-richmedia` can do for you, take a look at the [Gulp tasks](https://github.com/yeoman/generator-richmedia/blob/master/app/templates/gulpfile.js) used in `gulpfile.js`.


## Getting Started

Requires [NPM](https://github.com/npm/npm) previously installed.

- Install: `npm install -g generator-banner`
- Run: `yo richmedia`
- For additional sizes, run: `yo richmedia:add [WIDTH]x[HEIGHT]`
- Run: `gulp --target=[WIDTH]x[HEIGHT]` for preview and live reload
- Run: `gulp build --target=[WIDTH]x[HEIGHT] --production` for a production ready build


## Options

* `--skip-install`

  Skips the automatic execution of `bower` and `npm` after scaffolding has finished.


## License

[MIT license](https://opensource.org/licenses/MIT)
