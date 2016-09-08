'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
//var wiredep = require('wiredep');
var mkdirp = require('mkdirp');
var camelCase = require('camelcase');
var _s = require('underscore.string');

module.exports = yeoman.generators.Base.extend({
    initializing: function () {
        this.argument('name', {
            required: true,
            type: String,
            desc: 'The subgenerator name'
        });

        this.bannerSize = this.name;

    },

    // ---------------------------------------------------------------------------
    writing: {
        misc: function () {
            mkdirp("app/" + this.bannerSize);
            mkdirp("app/" + this.bannerSize + '/images');
            mkdirp("app/" + this.bannerSize + '/fonts');
        },

        scripts: function () {
            this.fs.copy(
                this.templatePath('scripts/overrides.js'),
                this.destinationPath('app/' + this.bannerSize + '/scripts/overrides.js')
            );
        },

        styles: function () {

            this.fs.copyTpl(
                this.templatePath('styles/app.scss'),
                this.destinationPath('app/' + this.bannerSize + '/styles/app.scss')
            );
            
            this.fs.copyTpl(
                this.templatePath('styles/config.scss'),
                this.destinationPath('app/' + this.bannerSize + '/styles/config.scss'),
                {
                    bannerWidth: this.bannerSize.split("x")[0] + "px", 
                    bannerHeight: this.bannerSize.split("x")[1] + "px"
                }
            );

            this.fs.copyTpl(
                this.templatePath('styles/overrides.scss'),
                this.destinationPath('app/' + this.bannerSize + '/styles/overrides.scss')
            );

        }
    }
});