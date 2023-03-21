import esbuild from 'esbuild'
import fs from 'node:fs'
import swc from '@swc/core'

await esbuild.build({
  entryPoints: ['./index.ts'],
  bundle: true, // 模块单独打包
  loader: {
    '.js': 'js',
    '.ts': 'ts',
    '.jsx': 'jsx',
    '.tsx': 'tsx'
  },
  treeShaking: true,
  define: {
    'process.env.NODE_ENV': 'production'
  },
  plugins: [
    {
      name: 'swc-loader',
      setup(build) {
        build.onLoad({ filter: /\.(js|jsx|ts|tsx)$/ }, (args) => {
          const content = fs.readFileSync(args.path, 'utf-8')
          const { code } = swc.transformSync(content, {
            filename: args.path
          })
          return {
            contents: code
          }
        })
      }
    }
  ],
  outdir: 'dist'
})
