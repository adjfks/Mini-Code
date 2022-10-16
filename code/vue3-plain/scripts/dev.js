const { build } = require('esbuild')
const { resolve } = require('path')
const args = require('minimist')(process.argv.slice(2))

const target = args._[0] || 'reactivity'
const format = args.f || args.format || 'global'

// console.log(args)
// node scripts/dev.js reactivity -f global
// { _: [ 'reactivity' ], f: 'global' }

// 开发环境只打包某一个
const pkg = require(resolve(__dirname, `../packages/${target}/package.json`))

const outputFormat = format.startsWith('gloabal')
  ? 'iife'
  : format === 'cjs'
  ? 'cjs'
  : 'esm'

const outfile = resolve(
  __dirname,
  `../packages/${target}/dist/${target}.${format}.js`
)

// 使用esbuild打包，天生支持ts
build({
  entryPoints: [resolve(__dirname, `../packages/${target}/src/index.ts`)],
  outfile,
  bundle: true,
  sourcemap: true,
  format: outputFormat,
  globalName: pkg.buildOptions.name,
  platform: format === 'cjs' ? 'node' : 'browser',
  watch: {
    // 监控文件变化
    onRebuild(error) {
      if (!error) console.log('rebuild...')
    },
  },
}).then(() => {
  console.log('esbuild is watching...')
})
