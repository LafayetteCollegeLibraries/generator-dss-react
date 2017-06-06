const Generator = require('yeoman-generator')
const utils = require('../utils')

module.exports = class extends Generator {
  constructor (args, opts) {
    super(args, opts)

    this.option('commit', {
      type: String,
      desc: 'Message for intitial commit (does not commit if missing)',
    })

    this.option('skip-coverage', {
      type: Boolean,
      desc: 'Skip coverage reporting via Istanbul / Coveralls',
      default: false,
    })

    this.option('skip-editorconfig', {
      type: Boolean,
      desc: 'Skip adding .editorconfig file',
      default: false,
    })

    this.option('skip-git', {
      type: Boolean,
      desc: 'Skip setting up git',
      default: false,
    })

    this.option('skip-lint', {
      type: Boolean,
      desc: 'Skip linting via eslint',
      default: false,
    })

    this.option('skip-tests', {
      type: Boolean,
      desc: 'Skip installing testing architecture (Karma, Mocha, Chai)',
      default: false,
    })
  }

  initializing () {
    if (!this.options['skip-git']) {
      this._initGit()
    }
  }

  prompting () {
    this._installPackageJson()
  }

  writing () {
    if (!this.options['skip-git']) {
      this._copyGitIgnore()
    }

    this._copyBabelRc()
    this._copyWebpackConfig()

    if (this.options.tests) {
      this._copyTestFiles()
    }

    if (this.options.editorconfig) {
      this._copyEditorconfig()
    }

    if (this.options.lint) {
      this._copyEslintRc()
    }

    this._copyReactIndex()
    this._copyPublicIndex()
  }

  install () {
    const deps = this._getDependencies()
    const devDeps = this._getDevDependencies()

    this.npmInstall(deps, { 'save': true })
    this.npmInstall(devDeps, { 'save-dev': true })
  }

  end () {
    if (!this.options['skip-git']) {
      if (this.options.commit !== undefined) {
        this.spawnCommandSync('git', [
          'add', '--all',
        ])

        this.spawnCommandSync('git', [
          'commit', '-m', this.options.commit, '--quiet',
        ])
      }

      else {
        this.log('\n=^_^= You\'re all set! Now might be a good time to make your first commit:')
        this.log('  git add .')
        this.log('  git commit -m "initial commit"')
      }
    }
  }

  _getDependencies () {
    return [
      'react',
      'react-dom',
      'prop-types',
    ]
  }

  _getDevDependencies () {
    const core = [
      // babel dependencies
      'babel-core',
      'babel-loader',
      'babel-plugin-add-module-exports',
      'babel-plugin-transform-object-rest-spread',
      'babel-preset-es2015',
      'babel-preset-react',

      // webpack
      'webpack',
      'webpack-dev-server',
    ]

    if (!this.options['skip-lint']) {
      core.push('eslint')
      core.push('eslint-plugin-react')
    }

    if (this.options['skip-tests']) {
      return core
    }

    const testDeps = [
      'enzyme',
      'chai',
      'mocha',

      'karma',
      'karma-mocha',
      'karma-mocha-reporter',
      'karma-phantomjs-launcher',
      'karma-sourcemap-loader',
      'karma-webpack',

      'react-addons-test-utils',
      'react-test-renderer',
    ]

    if (!this.options['skip-coverage']) {
      testDeps.push('babel-plugin-istanbul')
      testDeps.push('karma-coverage')
      testDeps.push('karma-coveralls')
    }

    return core.concat(testDeps)
  }

  _installPackageJson () {
    const scripts = {
      dev: 'webpack-dev-server'
    }

    const tests = []

    if (!this.options['skip-lint']) {
      scripts['test:lint'] = 'eslint src'
      tests.push('test:lint')
    }

    if (!this.options['skip-tests']) {
      const t = 'NODE_ENV=test karma start'
      scripts['test:unit'] = t + ' --single-run'
      scripts['test:unit:watch'] = t + ' --auto-watch'

      tests.push('test:unit')
    }

    scripts.test = tests.length > 0
      ? tests.map(t => `npm run ${t}`).join(' && ')
      : 'echo "Error: no test specified" && exit 1'

    const pkgOpts = {
      // skipping the test command so that we can add the `dev` script
      // command. leaving `test` would cause `generator-npm-init` to
      // overwrite any `scripts` option with a new object only containing
      // the `test` command
      'skip-test': true,

      license: 'GPL-3.0',
      main: './src/index.js',
      version: '0.0.0',
      scripts,
    }

    this.composeWith(require.resolve('generator-npm-init/app'), pkgOpts)
  }

  _copyBabelRc () {
    this.fs.copyTpl(
      this.templatePath('.babelrc'),
      this.destinationPath('./.babelrc'),
      { coverage: !this.options['skip-tests'] && !this.options['skip-coverage']}
    )
  }

  _copyEslintRc () {
    this.fs.copy(
      this.templatePath('.eslintrc.json'),
      this.destinationPath('./.eslintrc.json')
    )
  }

  _copyEditorconfig () {
    this.fs.copy(
      this.templatePath('.editorconfig'),
      this.destinationPath('./.editorconfig')
    )
  }

  _copyGitIgnore () {
    this.fs.copyTpl(
      this.templatePath('.gitignore'),
      this.destinationPath('./.gitignore'),
      { coverage: !this.options['skip-coverage'] }
    )
  }

  _copyPublicIndex () {
    this.fs.copy(
      this.templatePath('app-index.html'),
      this.destinationPath('./public/index.html')
    )
  }

  _copyReactIndex () {
    this.fs.copy(
      this.templatePath('react-index.js'),
      this.destinationPath('./src/index.js')
    )
  }

  _copyTestFiles () {
    this.fs.copy(
      this.templatePath('webpack.test.js'),
      this.destinationPath('./webpack.test.js')
    )

    this.fs.copyTpl(
      this.templatePath('karma.conf.js'),
      this.destinationPath('./karma.conf.js'),
      { coverage: !this.options['skip-coverage'] }
    )
  }

  _copyWebpackConfig () {
    this.fs.copy(
      this.templatePath('webpack.config.js'),
      this.destinationPath('./webpack.config.js')
    )
  }

  _initGit () {
    this.spawnCommandSync('git', ['init', '--quiet'])
  }
}
