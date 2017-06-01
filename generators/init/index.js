// runs all of the init generators

const Generator = require('yeoman-generator')

module.exports = class extends Generator {
  main () {
    this.composeWith('dss-react:init-package')
    this.composeWith('dss-react:init-webpack')
    this.composeWith('dss-react:init-babel')
    this.composeWith('dss-react:init-react')
  }
}
