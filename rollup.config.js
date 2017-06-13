import babel from 'rollup-plugin-babel'
import babelrc from 'babelrc-rollup'

let pkg = require('./package.json')
let external = Object.keys(pkg.dependencies)

let plugins = [
  babel(babelrc())
]

export default {
  entry: 'src/index.js',
  plugins,
  external,
  targets: [{
    dest: pkg.main,
    format: 'umd',
    moduleName: 'qrcoder',
    sourceMap: true
  }, {
    dest: pkg.module,
    format: 'es',
    sourceMap: true
  }]
}
