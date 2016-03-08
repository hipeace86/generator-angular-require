'use strict';

var fs = require('fs');
var path = require('path');
var util = require('util');
var angularUtils = require('../util.js');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var camelize = require('underscore.string/camelize');
var slugify = require('underscore.string/slugify');
var humanize = require('underscore.string/humanize');

var AngularRequireJSGenerator = yeoman.Base.extend({
  constructor: function() {
    yeoman.Base.apply(this, arguments);

    // Backwards compatability
    // TODO: remove engine in future and use yeoman html-wiring instead
    this.engine = require('ejs').render

    this.option('app-suffix', {
      desc: 'Allow a custom suffix to be added to the module name',
      type: 'String',
      defaults: 'App'
    });

    this.option('appPath', {
      desc: 'path/to/app is now accepted to choose where to write the files',
      banner: 'path/to/app is now accepted to choose where to write the files',
      type: 'String',
      defaults: 'app',
      required: 'false'
    });

    this.argument('appname', { type: String, required: false });
    this.appname = this.appname || path.basename(process.cwd());
    this.appname = camelize(slugify(humanize(this.appname)));
    this.appSlugName = slugify(humanize(this.appname))

    this.env.options['app-suffix'] = this.options['app-suffix'] || 'App';
    this.scriptAppName = this.appname + angularUtils.appName(this);

    this.env.options.appPath = this.options.appPath || 'app';
    this.config.set('appPath', this.env.options.appPath);
    this.appPath = this.env.options.appPath;

    this.pkg = require('../package.json');
    this.sourceRoot(path.join(__dirname, '../templates/common'));
  },

  prompting: function() {
    var cb = this.async();
    var compass;

    if (!this.options['skip-welcome-message']) {
      this.log(yosay());
      this.log('Out of the box I include Bootstrap and some AngularJS recommended modules.\n');
    }

    if (this.options.minsafe) {
      this.log.error(
        'The --minsafe flag has been removed. ngAnnotate is used to handle this during the build.\n'
      );
    }

    this.prompt([{
      type: 'confirm',
      name: 'compass',
      message: 'Would you like to use Sass (with Compass)?',
      default: true
    },{
      type: 'confirm',
      name: 'bootstrap',
      message: 'Would you like to include Bootstrap?',
      default: true
    },{
        type: 'confirm',
        name: 'metronic',
        message: 'Would you like to include Montronic theme?',
        default: true,
        when: function (props) {
            return props.bootstrap;
        }
    }, {
      type: 'confirm',
      name: 'compassBootstrap',
      message: 'Would you like to use the Sass version of Bootstrap?',
      default: true,
      when: function (props) {
        return props.bootstrap && compass;
      }
    }, {
      type: 'checkbox',
      name: 'modules',
      message: 'Which modules would you like to include?',
      choices: [{
        value: 'resourceModule',
        name: 'angular-resource.js',
        checked: true
      }, {
        value: 'cookiesModule',
        name: 'angular-cookies.js',
        checked: true
      }, {
      value: 'sanitizeModule',
      name: 'angular-sanitize.js',
      checked: true
      }, {
        value: 'routeModule',
        name: 'angular-route.js',
        checked: false
      }, {
        value: 'animateModule',
        name: 'angular-animate.js',
        checked: true
      }, {
        value: 'touchModule',
        name: 'angular-touch.js',
        checked: false
      }, {
          value: 'uiRouterModule',
          name: 'angular-ui-router.js',
          checked: true
      },{
        value: 'ariaModule',
        name: 'angular-aria.js',
        checked: false
      }, {
        value: 'messagesModule',
        name: 'angular-messages.js',
        checked: false
      }]
    }], function (props) {
      this.compass = props.compass;
      this.bootstrap = props.bootstrap;
      this.compassBootstrap = props.compassBootstrap;
      this.metronic = props.metronic;
      this.env.options.metronic = props.metronic;

      var hasMod = function (mod) { return props.modules.indexOf(mod) !== -1; };
      this.ariaModule = hasMod('ariaModule');
      this.messagesModule = hasMod('messagesModule');
      this.resourceModule = hasMod('resourceModule');
      this.cookiesModule = hasMod('cookiesModule');
      this.sanitizeModule = hasMod('sanitizeModule');
      this.routeModule = hasMod('routeModule');
      this.animateModule = hasMod('animateModule');
      this.touchModule = hasMod('touchModule');
      this.uiRouterModule = hasMod('uiRouterModule');

      var angMods = [];

      if (this.cookiesModule) {
        angMods.push("'ngCookies'");
      }

      if (this.ariaModule) {
        angMods.push("'ngAria'");
      }

      if (this.messagesModule) {
        angMods.push("'ngMessages'");
      }

      if (this.resourceModule) {
        angMods.push("'ngResource'");
      }

      if (this.sanitizeModule) {
        angMods.push("'ngSanitize'");
      }

      if (this.routeModule) {
        angMods.push("'ngRoute'");
        this.env.options.ngRoute = true;
      }

      if (this.routeModule) {
        angMods.push("'ngAnimate'");
        this.env.options.ngAnimate = true;
      }

      if (this.routeModule) {
        angMods.push("'ngTouch'");
        this.env.options.ngTouch = true;
      }
      if (this.uiRouterModule) {
          angMods.push("'ui.router'");
          this.env.options.uiRouter = true;
      }
      this.env.options.angularDeps = angMods;

      cb();
    }.bind(this));
  },

  configuring: {
    bowerConfig: function() {
      this.fs.copyTpl(
        this.templatePath('root/_bowerrc'),
        this.destinationPath('.bowerrc')
      );

      this.fs.copyTpl(
        this.templatePath('root/_bower.json'),
        this.destinationPath('bower.json'),
        {
          appSlugName: this.appSlugName,
          animateModule: this.animateModule,
          ariaModule: this.ariaModule,
          cookiesModule: this.cookiesModule,
          messagesModule: this.messagesModule,
          resourceModule: this.resourceModule,
          routeModule: this.routeModule,
          sanitizeModule: this.sanitizeModule,
          touchModule: this.touchModule,
          uiRouterModule: this.uiRouterModule,
          bootstrap: this.bootstrap,
          compassBootstrap: this.compassBootstrap,
          appPath: this.appPath,
          scriptAppName: this.scriptAppName,
          metronic: this.metronic
        }
      );
    },

    packageJson: function() {
      this.fs.copyTpl(
        this.templatePath('root/_package.json'),
        this.destinationPath('package.json'),
        {
          appSlugName: this.appSlugName,
          compass: this.compass
        }
      );
    },

    gruntfile: function() {
      this.template('root/_Gruntfile.js', 'Gruntfile.js');
    },

    editorConfig: function() {
      this.copy('../../templates/common/root/.editorconfig', '.editorconfig');
    },

    jscsrc: function() {
      this.copy('../../templates/common/root/.jscsrc', '.jscsrc');
    },

    git: function() {
      this.copy('../../templates/common/root/.gitattributes', '.gitattributes');
      this.copy('../../templates/common/root/gitignore', '.gitignore');
    },

    jshint: function() {
      this.copy('../../templates/common/root/.jshintrc', '.jshintrc');
    },

    readme: function() {
      this.fs.copyTpl(
        this.templatePath('root/README.md'),
        this.destinationPath('README.md'),
        {
          appSlugName: this.appSlugName,
          pkg: this.pkg
        }
      );
    },

    testDirectory: function() {
      this.directory('test');
    },

    assertsDirectory: function() {
      this.directory('asserts');
    }
  },

  writing: {
    bootstrapFiles: function() {
      var cssFile = 'styles/main.' + (this.compass ? 's' : '') + 'css';
      this.fs.copyTpl(
          this.templatePath(path.join('app',cssFile)),
          this.destinationPath(path.join(this.appPath,cssFile)),
          {
              metronic: this.metronic,
              compassBootstrap: this.compass
          }
      );
    },

    indexHtml: function() {
      this.ngRoute = this.env.options.ngRoute;
      this.uiRouter = this.env.options.uiRouter;
      this.indexFile = this.engine(this.read('app/index.html'), this);
      this.indexFile = this.indexFile.replace(/&apos;/g, "'");
      this.write(path.join(this.appPath, 'index.html'), this.indexFile);
    },

    requireJsAppConfig: function() {
      this.template('../../templates/common/scripts/main.js', path.join(this.appPath, 'scripts/main.js'));
    },

    requireJsTestConfig: function() {
      this.template('../../templates/common/scripts/test-main.js', 'test/test-main.js');
    },

    webFiles: function() {
      this.sourceRoot(path.join(__dirname, '../templates/common'));
      var appPath = this.options.appPath;
      var copy = function (dest) {
        this.copy(path.join('app', dest), path.join(this.appPath, dest));
      }.bind(this);

      copy('404.html');
      copy('favicon.ico');
      copy('robots.txt');
      copy('views/main.html');
      if(this.metronic){
          copy('views/footer.html');
          copy('views/header.html');
          copy('views/page-head.html');
          copy('views/sidebar.html');
          copy('views/login.html');
          this.copy(path.join('app', 'views/m-main.html'),path.join(this.appPath, 'views/main.html'));
          this.template('../../templates/common/app/scripts/controllers/footer.js', path.join(this.appPath, 'scripts/controllers/footer.js'));
          this.template('../../templates/common/app/scripts/controllers/header.js', path.join(this.appPath, 'scripts/controllers/header.js'));
          this.template('../../templates/common/app/scripts/controllers/login.js', path.join(this.appPath, 'scripts/controllers/login.js'));
          this.template('../../templates/common/app/scripts/controllers/modalinstance.js', path.join(this.appPath, 'scripts/controllers/modalinstance.js'));
          this.template('../../templates/common/app/scripts/controllers/pagehead.js', path.join(this.appPath, 'scripts/controllers/pagehead.js'));
          this.template('../../templates/common/app/scripts/controllers/sidebar.js', path.join(this.appPath, 'scripts/controllers/sidebar.js'));
          this.template('../../templates/common/app/scripts/directives/ngspinnerbar.js', path.join(this.appPath, 'scripts/directives/ngspinnerbar.js'));
          this.template('../../templates/common/app/scripts/directives/paging.js', path.join(this.appPath, 'scripts/directives/paging.js'));
          this.template('../../templates/common/app/scripts/services/httpinterceptor.js', path.join(this.appPath, 'scripts/services/httpinterceptor.js'));
          this.template('../../templates/common/app/scripts/services/async.js', path.join(this.appPath, 'scripts/services/async.js'));
          this.template('../../templates/metronic/index.html', path.join(this.appPath, 'index.html'));
      }
      this.directory(path.join('app', 'images'), path.join(this.appPath, 'images'));
      
    },

    appFile: function() {
      this.angularModules = this.env.options.angularDeps;
      this.ngRoute = this.env.options.ngRoute;
      this.uiRouter = this.env.options.uiRouter;
      this.metronic = this.env.options.metronic;
      this.template('../../templates/javascript/app.js', path.join(this.appPath, 'scripts/app.js'));
    },
      metronicFile: function() {
        if(this.metronic) {
          this.sourceRoot(path.join(__dirname, '../templates'));
          this.directory('metronic',path.join('asserts','metronic'));
        }
      }
  },

  install: function() {
    var enabledComponents = [];

    this.installDependencies({ skipInstall: this.options['skip-install'] });

    // Invoke the creation of the default controller
    this.composeWith('controller', { arguments: ['main'] }, {
        local: require.resolve('../controller/index.js')
    });

    // If ngRoute is specified as an install option, then create the "About" route
    if (this.env.options.ngRoute) {
      this.composeWith('route', { arguments: ['about'] }, {
          local: require.resolve('../route/index.js')
      });
    }

    if (this.animateModule) { enabledComponents.push('angular-animate/angular-animate.js'); }
    if (this.ariaModule) { enabledComponents.push('angular-aria/angular-aria.js'); }
    if (this.cookiesModule) { enabledComponents.push('angular-cookies/angular-cookies.js'); }
    if (this.messagesModule) { enabledComponents.push('angular-messages/angular-messages.js'); }
    if (this.resourceModule) { enabledComponents.push('angular-resource/angular-resource.js'); }
    if (this.routeModule) { enabledComponents.push('angular-route/angular-route.js'); }
    if (this.sanitizeModule) { enabledComponents.push('angular-sanitize/angular-sanitize.js'); }
    if (this.touchModule) { enabledComponents.push('angular-touch/angular-touch.js'); }

    this.composeWith('karma-require', {
      options: {
        travis: true,
        'skip-install': this.options['skip-install'],
        components: [
          'angular/angular.js',
          'angular-mocks/angular-mocks.js'
        ].concat(enabledComponents)
      }
    });
  },

  end: {
    showGuidance: function() {
      if (!this.options['skip-message']) {
        console.log(
          '\nNow that everything is set up, you\'ll need to execute a build. ' +
          '\nThis is done by running' +
          '\n  grunt build' +
          '\n' +
          '\nWork with your files by using' +
          '\n  grunt serve' +
          '\n' +
          '\nThis sets a watch on your files and also opens your project in ' +
          '\na web browser using live-reload, so that any changes you make are ' +
          '\ninstantly visible.'
        );
      }
    },

    saveConfig: function() {
      this.config.save();
    }
  }
});

module.exports = AngularRequireJSGenerator;
