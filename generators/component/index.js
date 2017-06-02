const Generator = require('yeoman-generator')
const utils = require('../utils')

module.exports = class extends Generator {
  constructor (args, opts) {
    super(args, opts)

    this.argument('name', {
      desc: 'Name of the component (use CamelCase per best-practices)',
      required: true,
      type: String,
    })

    this.option('cjs', {
      desc: 'Use commonjs modules (ex. `module.exports` and `const module = require(\'module\')`',
      type: utils.bool.false,
      default: false,
    })

    this.option('component', {
      desc: 'Shortcut for `--type=component`',
      type: utils.bool.false,
      default: false,
    })

    this.option('container', {
      desc: 'Shortcut for `--type=container`',
      type: utils.bool.false,
      default: false,
    })

    this.option('es6', {
      desc: 'Use es6 modules (ex. `export default` and `import module from \'module\')',
      type: utils.bool.true,
      default: true,
    })

    this.option('screen', {
      desc: 'Shortcut for `--type=screen',
      type: utils.bool.false,
      default: false,
    })

    this.option('shallow', {
      alias: 'S',
      desc: 'Use shallow file modules (creates files in `/src` directory)',
      type: utils.bool.false,
      default: false,
    })

    this.option('test', {
      alias: 't',
      desc: 'Adds empty `test.js` file to directory when in full mode',
      type: utils.bool.true,
      default: true,
    })

    this.option('type', {
      desc: 'Type of component (used to determine directory within `/src` to insert)',
      type: String,
    })

    const split = this.options.name.split(/\//).filter(Boolean)

    this.componentName = this._getComponentName(split)
    this.type = this.options.shallow ? null : this._getComponentType(split)
    this.moduleType = this.options.cjs ? 'cjs' : 'es6'
  }

  writing () {
    this._copyComponent()
    this._addTestFile()
  }

  _addTestFile () {
    if (!this.options.shallow && this.options.test) {
      const outPath = `${this._getDestinationDirectory()}/test.js`
      const tplName = `test.${this.moduleType}.js`

      this.fs.copyTpl(
        this.templatePath(tplName),
        this.destinationPath(this._getDestinationDirectory() + '/test.js'),
        { name: this.componentName }
      )
    }
  }

  _copyComponent () {
    const dest = this._getDestinationPath()

    this.fs.copyTpl(
      this.templatePath(`component.${this.moduleType}.js`),
      this.destinationPath(dest),
      { name: this.componentName }
    )
  }

  _getComponentName (split) {
    return split[split.length - 1]
  }

  _getComponentType (split) {
    if (split.length === 1) {
      if (this.options.type) {
        return this.options.type
      }

      if (this.options.container) {
        return 'container'
      }

      if (this.options.screen) {
        return 'screen'
      }

      return 'component'
    }

    let type = 'component'

    // `{type}/ComponentName`
    if (split.length === 2) {
      type = split[0]
    }

    else if (split.length === 3) {
      type = split[1]
    }

    if (type[type.length - 1] === 's') {
      type = type.substr(0, type.length - 1)
    }

    return type
  }

  _getDestinationDirectory () {
    return this.options.shallow
      ? `src`
      : `src/${this.type}s/${this.componentName}`
  }

  _getDestinationPath () {
    const dir = this._getDestinationDirectory()

    if (this.options.shallow) {
      return `${dir}/${this.componentName}.js`
    }

    return `${dir}/index.js`
  }
}
