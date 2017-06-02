const Generator = require('yeoman-generator')

module.exports = class extends Generator {
  prompting () {
    this._installPackageJson()
  }

  writing () {
    this._copyBabelRc()
    this._copyWebpackConfig()
    this._copyReactIndex()
    this._copyPublicIndex()
  }

  install () {
    const devDeps = this._getDevDependencies()
    const deps = this._getDependencies()

    this.npmInstall(devDeps, { 'save-dev': true })
    this.npmInstall(deps, { 'save': true })
  }

  _getDependencies () {
    return [
      'react',
      'react-dom',
      'prop-types',
    ]
  }

  _getDevDependencies () {
    return [
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
  }

  _installPackageJson () {
    const pkgOpts = {
      // skipping the test command so that we can add the `dev` script
      // command. leaving `test` would cause `generator-npm-init` to
      // overwrite any `scripts` option with a new object only containing
      // the `test` command
      'skip-test': true,

      license: 'GPL-3.0',
      main: './src/index.js',
      scripts: {
        dev: 'webpack-dev-server',
        test: 'echo "Error: no test specified" && exit 1',
      },
      version: '0.0.0',
    }

    this.composeWith(require.resolve('generator-npm-init/app'), pkgOpts)
  }

  _copyBabelRc () {
    this.fs.copy(
      this.templatePath('.babelrc'),
      this.destinationPath('./.babelrc')
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
      this.templatePath('./react-index.js'),
      this.destinationPath('./src/index.js')
    )
  }

  _copyWebpackConfig () {
    this.fs.copy(
      this.templatePath('webpack.config.js'),
      this.destinationPath('./webpack.config.js')
    )
  }
}
