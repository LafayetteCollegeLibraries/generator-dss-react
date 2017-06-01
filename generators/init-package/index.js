const Generator = require('yeoman-generator')

module.exports = class extends Generator {
  prompting () {
    const pkgOpts = {
      license: 'GPL-3.0',
      main: './src/index.js',
      version: '0.0.0',
    }

    this.composeWith(require.resolve('generator-npm-init/app'), pkgOpts)
  }

  writing () {
    const scripts = {
      dev: 'webpack-dev-server',
    }

    this.fs.extendJSON(
      this.destinationPath('package.json'),
      {scripts},
      (key, val) => key === '_' ? undefined : val,
    )
  }
}
