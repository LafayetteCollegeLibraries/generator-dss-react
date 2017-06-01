const Generator = require('yeoman-generator')

module.exports = class extends Generator {
  installing () {
    const deps = [
      'react',
      'react-dom',
    ]

    this.npmInstall(deps, { save: true }, this.copySrcIndex)
  }

  writing () {
    this.fs.copy(
      this.templatePath('./base-es6.js'),
      this.destinationPath('./src/index.js')
    )
  }
}
