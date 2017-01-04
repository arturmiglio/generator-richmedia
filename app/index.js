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
                choices: ['Weborama', 'DoubleClickManager', 'DoubleClickStudio', 'Sizmek', 'Flashtalking', 'None'],
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
            },
            {
                type: 'confirm',
                name: 'useLocales',
                message: 'Do you need internationalization?',
                default: false
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
        this.config.set('useLocales', this.props.useLocales);
    },

    // ---------------------------------------------------------------------------
    writing: {

        misc: function () {
            mkdirp('app/common');
            mkdirp('app/common/fonts');
            mkdirp('app/common/images');
            mkdirp('app/common/locales/es');
        },

        gulpfile: function () {
            this.fs.copyTpl(
                this.templatePath('gulpfile.js'),
                this.destinationPath('gulpfile.js'),
                {
                    pkg: this.pkg,
                    bannerSize: this.props.bannerSize,
                    bannerType: this.props.bannerType,
                    useLocales: this.props.useLocales
                }
            );
        },

        buildJSON: function () {
            this.fs.copyTpl(
                this.templatePath('build.json'),
                this.destinationPath('build.json'),
                {
                    bannerSize: this.props.bannerSize
                }
            )
        },

        readme: function () {
            this.fs.copy(
                this.templatePath('README.md'),
                this.destinationPath('README.md')
            )
        },

        packageJSON: function () {
            this.fs.copyTpl(
                this.templatePath('_package.json'),
                this.destinationPath('package.json')
            )
        },

        locales: function () {
            if (this.props.useLocales) {
                this.fs.copy(
                    this.templatePath('index.json'),
                    this.destinationPath('app/common/locales/es/index.json')
                )
            }
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
                this.templatePath('Main.js'),
                this.destinationPath('app/common/scripts/Main.js')
            );

            switch (this.props.bannerType) {
                case "Weborama":
                    this.fs.copyTpl(
                        this.templatePath('BannerWeborama.js'),
                        this.destinationPath('app/common/scripts/BannerWeborama.js'),
                        {
                            bannerWidth: parseInt(this.props.bannerSize.split("x")[0]), 
                            bannerHeight: parseInt(this.props.bannerSize.split("x")[1])
                        }
                    );
                    break;

                case "DoubleClickManager":
                    this.fs.copy(
                        this.templatePath('BannerDoubleClickManager.js'),
                        this.destinationPath('app/common/scripts/BannerDoubleClickManager.js')
                    );
                    break;

                case "DoubleClickStudio":
                    this.fs.copy(
                        this.templatePath('BannerDoubleClickStudio.js'),
                        this.destinationPath('app/common/scripts/BannerDoubleClickStudio.js')
                    );
                    break;

                case "Sizmek":
                    this.fs.copy(
                        this.templatePath('BannerSizmek.js'),
                        this.destinationPath('app/common/scripts/BannerSizmek.js')
                    );
                    break;

                case "Flashtalking":
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
                    break;

                case "None":
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
                    includeTimeline: this.props.includeTimeline,
                    includeZepto: this.props.includeZepto
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
                    useLocales: this.props.useLocales,
                    bannerWidth: this.props.bannerSize.split('x')[0], 
                    bannerHeight: this.props.bannerSize.split('x')[1]
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
        
        var howToInstall = '\nInstall skipped: run ' + chalk.yellow.bold('npm install & bower install') + ' to install the dependencies.';

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
