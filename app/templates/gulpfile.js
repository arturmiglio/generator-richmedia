var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');
var argv = require('yargs').argv;
var builds = require('./build.json');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin'),
    cache = require('gulp-cache');
var minifycss = require('gulp-minify-css');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var del = require('del');
var runSequence = require('run-sequence');
var gulpif = require('gulp-if');
var i18n = require('gulp-html-i18n');
var rename = require("gulp-rename");
var replace = require('gulp-replace-task');
var rev = require('gulp-rev');
var zip = require('gulp-zip');

// Configurable paths
var config = {
  app: 'app/',
  dist: 'dist/',
  build: 'build/',
  prod: false
};

console.log('ARGV: '+ argv.target);


var paths, appFiles, env;

function setup(argv) {
  // Check for the target flag
  if (argv.target && argv.target !== undefined) {
    // Set the env variable with the supplied string.
    env = argv.target;
  } else {
    // If not supplied, use the main size.
    env = '<%= bannerSize %>';
  }

  console.log('format: ' + env);

  // if production flag is present set config.prod to TRUE
  if (argv.production) {
    config.prod = true;
  }

  if (argv.zip) {
    config.zip = true;
  }
  // default language 'es'
  config.lang = argv.lang || 'es';

  paths = {
    main: {
      images: {
        src: config.app + 'common/images/',
        dist: config.dist
      },
      scripts: {
        src: config.app + 'common/scripts/',
        dist: config.dist
      },
      styles: {
        src: config.app + 'common/styles/',
        dist: config.dist
      },
      fonts: {
        src: config.app + 'common/fonts/',
        dist: config.dist
      },
      html: {
        src: config.app + 'common/',
        dist: config.dist 
      },
      locales: {
        src: config.app + 'common/locales/',
        dist: config.dist 
      }
    },
    size: {
      images: {
        src: config.app + env + '/images/',
        backup: config.app + env + '/backup/',
        dist: config.dist
      },
      scripts: {
        src: config.app + env + '/scripts/',
        dist: config.dist
      },
      styles: {
        src: config.app + env + '/styles/',
        dist: config.dist
      }
    },
    build: {
      temp: config.build + 'temp/'
    }
  }

  appFiles = {
    styles: [
      paths.size.styles.src + 'app.scss'
    ],
    stylesToWatch: [
      paths.main.styles.src + '**/*.scss',
      paths.size.styles.src + '**/*.scss',
    ],
    scripts: {
      init: [
        <% if (bannerType == 'None') { %>
        paths.main.scripts.src + 'Banner.js', 
        <% } else { %>
        paths.main.scripts.src + 'Banner<%= bannerType %>.js', 
        <% } %>
        paths.main.scripts.src + 'Init.js',
      ],
      main: [
        paths.main.scripts.src + 'Main.js',
        paths.main.scripts.src + 'Animation.js',
        paths.size.scripts.src + 'Overrides.js',
      ],
      external: [
        
      ]
    },
    images: [
      paths.main.images.src + '**/*.+(png|jpg|gif|svg|mp4)', 
      paths.size.images.src + '**/*.+(png|jpg|gif|svg|mp4)'
    ],
    backupImage: [
      paths.size.images.backup + config.lang + '.jpg'
    ],
    fonts: [
      paths.main.fonts.src + '**/*.*'
    ],
    html: [ 
      paths.main.html.src + 'index.html'
    ],
    locales: [
      paths.main.locales.src + '**/*.json'
    ],
    localesToClean: builds.locales,
    dist: [ 
      config.dist + '**/*.*'
    ],
    build: [ 
      config.build + config.lang + '/' + env + '/'
    ]
  };
}

setup(argv);

gulp.task('browser-sync', function() {
  browserSync({
    server: {
       baseDir: config.dist
    }
  });
});

gulp.task('bs-reload', function () {
  browserSync.reload();
});

gulp.task('images', function(){
  return gulp.src(appFiles.images)
    // copy twice, otherwise non-optimized images will be ignored
    .pipe(gulp.dest(config.dist))
    .pipe(gulpif(config.prod, cache(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true }))))
    .pipe(gulp.dest(config.dist))
    .pipe(browserSync.reload({stream:true}))
});

gulp.task('backup-image', function(){
  return gulp.src(appFiles.backupImage)
    .pipe(rename(env + '.jpg'))
    // copy twice, otherwise non-optimized images will be ignored
    .pipe(gulpif(config.zip,gulp.dest(String(appFiles.build))))
    .pipe(gulpif(config.zip,cache(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true }))))
    .pipe(gulpif(config.zip,gulp.dest(String(appFiles.build))));
});

gulp.task('styles', function(){
  return gulp.src(appFiles.styles) // HAVE TO PASS THE RIGHT PATHS TO COMBINE THE 3 SCSS
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(sass())
    .pipe(concat('main.css'))
    .pipe(autoprefixer('last 2 versions'))
    .pipe(gulp.dest(config.dist))
    // if is a production build apply minifyCSS
    .pipe(gulpif(config.prod, minifycss()))
    .pipe(gulp.dest(config.dist))
    .pipe(browserSync.reload({stream:true}))
});

function compileScripts(type) {
  return gulp.src(appFiles.scripts[type])
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(concat(type + '.js'))
    .pipe(gulp.dest(config.dist))
    // if is a production build apply uglify
    .pipe(gulpif(config.prod, uglify()))
    .pipe(gulp.dest(config.dist));
}

gulp.task('scripts-init', function(){
  return compileScripts('init');
});

gulp.task('scripts-main', function(){
  return compileScripts('main');
});

gulp.task('scripts-external', function(){
  return compileScripts('external');
});

gulp.task('scripts', ['scripts-init', 'scripts-external'], function(){
  return compileScripts('main')
    .pipe(browserSync.reload({stream:true}))
});

gulp.task('html', function(){
  <% if (useLocales) { %> return gulp.src(config.dist + 'index.html') <% } else { %> return gulp.src(appFiles.html) <% } %>
    .pipe(replace({
      patterns: [
        {
          match: 'bannerSize',
          replacement: env
        }
      ]
    }))
    .pipe(gulp.dest(config.dist))
    .pipe(browserSync.reload({stream:true}))
});

gulp.task('fonts', function(){
  return gulp.src(appFiles.fonts)
    .pipe(gulp.dest(config.dist))
});

gulp.task('localize', function() {
  return gulp.src(appFiles.html)
    .pipe(i18n({
      createLangDirs: true,
      defaultLang: config.lang,
      langDir: paths.main.locales.src,
      trace: true
    }))
    .pipe(gulp.dest(config.dist))
    .pipe(browserSync.reload({stream:true}));
});

gulp.task('cleanLocales', function() {
  var dir = appFiles.localesToClean.map(function(l) { return config.dist + l; });
  return del.sync(dir);
});


gulp.task('storeBuild', ['backup-image'], function(){
  return gulp.src(appFiles.dist)
    .pipe(gulpif(config.zip,zip(env + '.zip')))
    // .pipe(rev())
    .pipe(gulp.dest(String(appFiles.build)))
});

gulp.task('setEnvToProd', function(){
  return config.prod = true;
});

gulp.task('cleanDist', function() {
  return del.sync(appFiles.dist);
});

gulp.task('cleanBuild', function() {
  var path = config.build;
  if (argv.lang) {
    path += '/' + argv.lang;
  }
  return del.sync(path);
});

<% if (useLocales) { %>
gulp.task('locales', function(callback) {
  runSequence('localize', 'cleanLocales', 'html',
    callback
  );
});
<% } %>

gulp.task('default', function(callback) {
  runSequence('cleanDist', 'images', 'fonts', 'styles', 'scripts', <% if (useLocales) { %> 'locales' <% } else { %> 'html' <% } %>, 'browser-sync',
    callback
  );
  gulp.watch(appFiles.stylesToWatch, ['styles']);
  gulp.watch(appFiles.scripts.init, ['scripts']);
  gulp.watch(appFiles.scripts.main, ['scripts']);
  gulp.watch(appFiles.images, ['images']);
  <% if (useLocales) { %>
  gulp.watch(appFiles.html, ['locales']);
  <% } else { %>
  gulp.watch(appFiles.html, ['html']);
  <% } %>
});

gulp.task('build', ['setEnvToProd'], function(callback) {
  runSequence('cleanDist', 'images', 'fonts', 'styles', 'scripts', <% if (useLocales) { %> 'locales' <% } else { %> 'html' <% } %>, 'storeBuild',
    callback
  );
});

gulp.task('build-lang', ['cleanBuild', 'cleanDist'], function(callback) {
  var i = -1;
  var lang = argv.lang;

  var formats = builds.formats;
  if (builds.localeSpecificFormats && builds.localeSpecificFormats[lang]) {
    formats = formats.concat(builds.localeSpecificFormats[lang]);
  }

  function next() {
    i++;
    var format = formats[i];
    if (i < formats.length) {
      setup({
        target: format,
        lang: lang,
        production: argv.production,
        zip: argv.zip
      });

      runSequence('build', next);
    } else {
      callback();
    }
  }

  next();
});

gulp.task('build-all', ['cleanBuild', 'cleanDist'], function(callback) {
  var i = -1;

  function next() {
    i++;
    var lang = builds.locales[i];
    if (i < builds.locales.length) {
      argv.lang = lang;
      runSequence('build-lang', next);
    } else {
      callback();
    }
  }

  next();
});

