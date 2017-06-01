const Generator = require('yeoman-generator')

module.exports = class extends Generator {
  install () {
    const deps = [
      'babel-core',
      'babel-loader',
      'babel-plugin-add-module-exports',
      'babel-plugin-transform-object-rest-spread',
      'babel-preset-es2015',
      'babel-preset-react',
    ]

    this.npmInstall(deps, { 'save-dev': true })
  }

  writing () {
    this.fs.copy(
      this.templatePath('.babelrc'),
      this.destinationPath('./.babelrc')
    )
  }
}


