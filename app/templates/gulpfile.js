var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');
var argv = require('yargs').argv;
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

// Check for the target flag
if (argv.target && argv.target !== undefined) {
  // Set the env variable with the supplied string.
  var env = argv.target;
} else {
  // If not supplied, use the main size.
  var env = '<%= bannerSize %>';
}

// if production flag is present set config.prod to TRUE
if (argv.production) {
  config.prod = true;
}

var paths = {
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
    }
  },
  size: {
    images: {
      src: config.app + env + '/images/',
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
  }
}

var appFiles = {
  styles: [
    paths.size.styles.src + 'app.scss'
  ],
  stylesToWatch: [
    paths.main.styles.src + '**/*.scss',
    paths.size.styles.src + '**/*.scss',
  ],
  scripts: [
    <% if (bannerType != 'None') { %>
      paths.main.scripts.src + 'Banner<%= bannerType %>.js',
    <% } else { %>
      paths.main.scripts.src + 'Banner.js',
    <% } %>  
    paths.main.scripts.src + 'Animation.js',
    paths.size.scripts.src + 'overrides.js',
    paths.main.scripts.src + 'main.js',
  ],
  images: [
    paths.main.images.src + '**/*.+(png|jpg|gif|svg)', 
    paths.size.images.src + '**/*.+(png|jpg|gif|svg)'
  ],
  fonts: [
    paths.main.fonts.src + '**/*.*'
  ],
  html: [ 
    paths.main.html.src + 'index.html'
  ],
  dist: [ 
    config.dist + '**/*.*'
  ],
  build: [ 
    config.build + env + '/'
  ]
};

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
  gulp.src(appFiles.images)
    .pipe(gulpif(config.prod, cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))))
    .pipe(gulp.dest(config.dist));
});

gulp.task('styles', function(){
  gulp.src(appFiles.styles) // HAVE TO PASS THE RIGHT PATHS TO COMBINE THE 3 SCSS
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

gulp.task('scripts', function(){
  return gulp.src(appFiles.scripts)
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(concat('main.js'))
    .pipe(gulp.dest(config.dist))
    // if is a production build apply uglify
    .pipe(gulpif(config.prod, uglify()))
    .pipe(gulp.dest(config.dist))
    .pipe(browserSync.reload({stream:true}))
});

gulp.task('html', function(){
  gulp.src(appFiles.html)
    .pipe(gulp.dest(config.dist))
    .pipe(browserSync.reload({stream:true}));
});

gulp.task('fonts', function(){
  gulp.src(appFiles.fonts)
    .pipe(gulp.dest(config.dist));
});

gulp.task('storeBuild', function(){
  gulp.src(appFiles.dist)
    .pipe(zip(env + '.zip'))
    .pipe(rev())
    .pipe(gulp.dest(String(appFiles.build)));
});

gulp.task('setEnvToProd', function(){
  return config.prod = true;
});

gulp.task('default', function(callback) {
  runSequence('fonts', 'styles', 'scripts', 'images', 'html', 'browser-sync',
    callback
  );
  gulp.watch(appFiles.stylesToWatch, ['styles']);
  gulp.watch(appFiles.scripts, ['scripts']);
  gulp.watch(appFiles.images, ['images']);
  gulp.watch(appFiles.html, ['html']);
});

gulp.task('build', ['setEnvToProd'], function(callback) {
  runSequence('fonts', 'styles', 'scripts', 'images', 'html', 'storeBuild',
    callback
  );
});