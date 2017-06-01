const Generator = require('yeoman-generator')

module.exports = class extends Generator {
  installing () {
    const deps = [
      'webpack',
      'webpack-dev-server',
    ]

    this.npmInstall(deps, { 'save-dev': true })
  }

  writing () {
    this._setupWebpackConfig()
    this._setupPublicIndex()
  }

  _setupWebpackConfig () {
    this.fs.copy(
      this.templatePath('webpack.config.js'),
      this.destinationPath('./webpack.config.js')
    )
  }

  _setupPublicIndex () {
    this.fs.copy(
      this.templatePath('index.html'),
      this.destinationPath('./public/index.html')
    )
  }
}
