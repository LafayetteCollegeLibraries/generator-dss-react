const Generator = require('yeoman-generator')

const flagTest =  val => (
  val && (val === 'false' || val === 'no' || val === '0')
    ? false
    : true
)

module.exports = class extends Generator {
  constructor (args, opts) {
    super(args, opts)

    this.option('coverage', {
      type: flagTest,
      desc: 'Adds coverage reporting via Istanbul / Coveralls',
      default: true,
    })

    this.option('editorconfig', {
      type: flagTest,
      desc: 'Adds .editorconfig file',
      default: true,
    })

    this.option('lint', {
      type: flagTest,
      desc: 'Adds linting via eslint',
      default: true,
    })

    this.option ('tests', {
      type: flagTest,
      desc: 'Installs testing architecture (Karma, Mocha, Chai)',
      default: true,
    })
  }

  prompting () {
    this._installPackageJson()
  }

  writing () {
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

    if (this.options.lint) {
      core.push('eslint')
      core.push('eslint-plugin-react')
    }

    if (!this.options.tests) {
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

    if (this.options.coverage) {
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

    if (this.options.lint) {
      scripts['test:lint'] = 'eslint src'
      tests.push('test:lint')
    }

    if (this.options.tests) {
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
      { coverage: this.options.tests && this.options.coverage}
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
      { coverage: this.options.coverage }
    )
  }

  _copyWebpackConfig () {
    this.fs.copy(
      this.templatePath('webpack.config.js'),
      this.destinationPath('./webpack.config.js')
    )
  }
}
