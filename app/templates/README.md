# RichMedia Banner generator

[Yeoman](http://yeoman.io) generator for HTML5 banner development.

![](http://i.imgur.com/VrkuFOg.jpg)

##Description:
    
    Creates a new basic front-end web application for banners.

## Getting Started

    Requires [NPM](https://github.com/npm/npm) previously installed.

    - Install: `npm install -g generator-richmedia`

##Example:
    
    yo richmedia

    This will create:
        gulpfile.js: Configuration for the task runner.
        bower.json: Front-end packages installed by bower.
        package.json: Development packages installed by npm.

        app/: Your application files.


##Add a new richmedia size:

	yo richmedia:add [WIDTH]x[HEIGHT] (eg.: yo richmedia:add 300x250)


##Run the richmedia:

	gulp --target=[WIDTH]x[HEIGHT] (eg.: gulp --target=980x250)


##Build a specific target:

	gulp build --target=[WIDTH]x[HEIGHT] (eg.: gulp build --target=980x250)


##Build a specific target using a specific language:

	gulp build --target=[WIDTH]x[HEIGHT] --lang=[LANGUAGE-CODE] (eg.: gulp build --target=980x250 --lang=es)


##Build all available formats:

	gulp build-all
    (must configure formats and locales in build.json file)


##Add production flag to minimize assets and compress images:

	gulp build-all --production