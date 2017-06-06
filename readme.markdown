generator-dss-react
===================

[Yeoman][1] generator to work with React apps within DSS.

usage (so far)
--------------

```
git clone https://github.com/LafayetteCollegeLibraries/generator-dss-react
cd generator-dss-react
npm link
```

then

```
mkdir new-app
cd new-app

yo dss-react:init
# ~ or ~ #
yo dss-react:component
```

### `yo dss-react:init`

Creates a new React project and installs `babel`, `webpack`, and `react`
dependencies as well as sets up a new git repository (and optionally
allows you to create an initial commit).

```
❯ yo dss-react:init --help
Usage:
  yo dss-react:init [options]

Options:
  -h,   --help               # Print the generator's options and usage
        --skip-cache         # Do not remember prompt answers                             Default: false
        --skip-install       # Do not automatically install dependencies                  Default: false
        --commit             # Message for intitial commit (does not commit if missing)
        --skip-coverage      # Skip coverage reporting via Istanbul / Coveralls           Default: false
        --skip-editorconfig  # Skip adding .editorconfig file                             Default: false
        --skip-git           # Skip setting up git                                        Default: false
        --skip-lint          # Skip linting via eslint                                    Default: false
        --skip-tests         # Skip installing testing architecture (Karma, Mocha, Chai)  Default: false
```

### `yo dss-react:component`

Creates a new component

```
❯ yo dss-react:component --help
Usage:
  yo dss-react:component [options] <name>

Options:
  -h,   --help          # Print the generator's options and usage
        --skip-cache    # Do not remember prompt answers                                                     Default: false
        --skip-install  # Do not automatically install dependencies                                          Default: false
        --cjs           # Use commonjs modules (ex. `module.exports` and `const module = require('module')`  Default: false
        --component     # Shortcut for `--type=component`                                                    Default: false
        --container     # Shortcut for `--type=container`                                                    Default: false
        --es6           # Use es6 modules (ex. `export default` and `import module from 'module')            Default: true
        --screen        # Shortcut for `--type=screen                                                        Default: false
  -S,   --shallow       # Use shallow file modules (creates files in `/src` directory)                       Default: false
  -t,   --test          # Adds empty `test.js` file to directory when in full mode                           Default: true
        --type          # Type of component (used to determine directory within `/src` to insert)

Arguments:
  name  # Name of the component (use CamelCase per best-practices)  Type: String  Required: true
```

[1]: http://yeoman.io
