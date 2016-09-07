'use strict';
var generators = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');
// var wiredep = require('wiredep');
var mkdirp = require('mkdirp');
var camelCase = require('camelcase');
var _s = require('underscore.string');

module.exports = generators.Base.extend({
    constructor: function () {
        generators.Base.apply(this, arguments);

        this.option('skip-welcome-message', {
            desc: 'Skips the welcome message',
            type: Boolean
        });

        this.option('skip-install-message', {
            desc: 'Skips the message after the installation of dependencies',
            type: Boolean
        });
    },

    // ---------------------------------------------------------------------------
    initializing: function () {
        this.pkg = require('../package.json');
    },

    // ---------------------------------------------------------------------------
    askFor: function () {
        var done = this.async();

        if (!this.options['skip-welcome-message']) {
            this.log(yosay('Freakin Banners!!!'));
        }

        var prompts = [
            {
                type: 'input',
                name: 'bannerName',
                message: 'What is the name of the banner? (camelCase):',
                default: this.appname,
                filter: function(answer) {
                    return camelCase(answer)
                }
            }, 
            {
                type: 'list',
                name: 'bannerType',
                message: 'What type of banner is it?',
                choices: ['Weborama', 'DoubleClick', 'Sizmek', 'Flashtalking', 'None'],
                default: 'Weborama'
            },
            {
                type: 'input',
                name: 'bannerSize',
                message: 'What size do you need? (980x250):',
                default: "980x250"
            }, 
            {
                type: 'confirm',
                name: 'includeTimeline',
                message: 'Include GSAP TimelineLite?',
                default: false
            },
            {
                type: 'confirm',
                name: 'includeZepto',
                message: 'Include Zepto?',
                default: true
            }   
        ];

        this.prompt(prompts, function (props) {
            this.props = props;
            done();
        }.bind(this));
    },

    // ---------------------------------------------------------------------------
    config: function() {
        this.config.set('bannerType', this.props.bannerType);
        this.config.set('bannerSize', this.props.bannerSize);
        this.config.set('includeTimeline', this.props.includeTimeline);
        this.config.set('includeZepto', this.props.includeZepto);
    },

    // ---------------------------------------------------------------------------
    writing: {

        misc: function () {
            mkdirp("app/common");
            mkdirp("app/common/fonts");
            mkdirp("app/common/images");
        },

        gulpfile: function () {
            this.fs.copyTpl(
                this.templatePath('gulpfile.js'),
                this.destinationPath('gulpfile.js'),
                {
                    pkg: this.pkg,
                    bannerSize: this.props.bannerSize,
                    bannerType: this.props.bannerType
                }
            );
        },

        buildJSON: function () {
            this.fs.copyTpl(
                this.templatePath('build.json'),
                this.destinationPath('build.json')
            )
        },

        packageJSON: function () {
            this.fs.copyTpl(
                this.templatePath('_package.json'),
                this.destinationPath('package.json')
            )
        },

        git: function () {
            this.fs.copy(
                this.templatePath('gitignore'),
                this.destinationPath('.gitignore')
            );

            this.fs.copy(
                this.templatePath('gitattributes'),
                this.destinationPath('.gitattributes')
            );
        },

        bower: function () {
            var bowerJson = {
                name: _s.slugify(this.appname),
                private: true,
                dependencies: {}
            };


            // bowerJson.dependencies['gsap'] = '~1.18.0';


            this.fs.writeJSON('bower.json', bowerJson);
            this.fs.copy(
                this.templatePath('bowerrc'),
                this.destinationPath('.bowerrc')
            );
        },

        editorConfig: function () {
            this.fs.copy(
                this.templatePath('editorconfig'),
                this.destinationPath('.editorconfig')
            );
        },

        scripts: function () {
            this.fs.copy(
                this.templatePath('main.js'),
                this.destinationPath('app/common/scripts/main.js')
            );

            if (this.props.bannerType === "DoubleClick") {
                this.fs.copy(
                    this.templatePath('BannerDoubleClick.js'),
                    this.destinationPath('app/common/scripts/BannerDoubleClick.js')
                );
            }

            if (this.props.bannerType === "Sizmek") {
                this.fs.copy(
                    this.templatePath('BannerSizmek.js'),
                    this.destinationPath('app/common/scripts/BannerSizmek.js')
                );
            }

            if (this.props.bannerType === "Weborama") {
                this.fs.copyTpl(
                    this.templatePath('BannerWeborama.js'),
                    this.destinationPath('app/common/scripts/BannerWeborama.js'),
                    {
                        bannerWidth: parseInt(this.props.bannerSize.split("x")[0]), 
                        bannerHeight: parseInt(this.props.bannerSize.split("x")[1])
                    }
                );
            }

            if (this.props.bannerType === "Flashtalking") {
                this.fs.copy(
                    this.templatePath('BannerFlashtalking.js'),
                    this.destinationPath('app/common/scripts/BannerFlashtalking.js')
                );

                this.fs.copyTpl(
                    this.templatePath('manifest.js'),
                    this.destinationPath('app/common/manifest.js'), 
                    {
                        bannerWidth: parseInt(this.props.bannerSize.split("x")[0]), 
                        bannerHeight: parseInt(this.props.bannerSize.split("x")[1])
                    }
                );
            } 

            if (this.props.bannerType === "None") {
                this.fs.copy(
                    this.templatePath('Banner.js'),
                    this.destinationPath('app/common/scripts/Banner.js')
                );
            }           

            this.fs.copy(
                this.templatePath('Animation.js'),
                this.destinationPath('app/common/scripts/Animation.js')
            );

            this.fs.copyTpl(
                this.templatePath('Init.js'),
                this.destinationPath('app/common/scripts/Init.js'),
                {
                    includeTimeline: this.props.includeTimeline
                }
            );
        },

        styles: function () {

            this.fs.copy(
                this.templatePath('main.scss'),
                this.destinationPath('app/common/styles/main.scss')
            );

        },

        html: function () {
            this.fs.copyTpl(
                this.templatePath('index.html'),
                this.destinationPath('app/common/index.html'),
                {
                    appname: this.appname, 
                    bannerType: this.props.bannerType, 
                    includeZepto: this.props.includeZepto,
                    includeTimeline: this.props.includeTimeline,
                    bannerWidth: this.props.bannerSize.split("x")[0], 
                    bannerHeight: this.props.bannerSize.split("x")[1]
                }
            );
        },

        run: function() {
            this.composeWith('richmedia:add', {args: [this.props.bannerSize]});
        }
    },

    // ---------------------------------------------------------------------------
    install: function () {
        this.installDependencies({
            skipInstall: this.options['skip-install'],
            skipMessage: this.options['skip-install-message']
        });
    },

    // ---------------------------------------------------------------------------
    end: function () {
        // var bowerJson = this.fs.readJSON(this.destinationPath('bower.json'));
        
        var howToInstall = '\nRun ' + chalk.yellow.bold('npm install & bower install') + 'to install the dependencies.';

        if (this.options['skip-install']) {
            this.log(howToInstall);
            return;
        }

        // // wire Bower packages to .html
        // wiredep({
        //     bowerJson: bowerJson,
        //     src: this.props.bannerSize + '/index.html',
        //     exclude: ['bootstrap.js'],
        //     ignorePath: /^(\.\.\/)*\.\./
        // });

        // // wire Bower packages to .scss
        // wiredep({
        //     bowerJson: bowerJson,
        //     src: this.props.bannerSize + '/styles/*.scss',
        //     ignorePath: /^(\.\.\/)+/
        // });
    }
});
