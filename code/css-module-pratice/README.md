# css-module-pratice

在create-react-app创建的react项目中已经内置了css module支持，有两种使用方式：

1. 将需要模块化的css文件命名为`xxx.module.css`然后使用即可。

2. 使用`npm run eject`命令，此命令会将脚手架中隐藏的配置都展示出来，此过程不可逆

默认css配置
```js
const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;

{
  test: cssRegex,
  exclude: cssModuleRegex,
  use: getStyleLoaders({
    importLoaders: 1,
    sourceMap: isEnvProduction
      ? shouldUseSourceMap
      : isEnvDevelopment,
    modules: {
      mode: 'icss',
    },
  }),
  // Don't consider CSS imports dead code even if the
  // containing package claims to have no side effects.
  // Remove this when webpack adds a warning or an error for this.
  // See https://github.com/webpack/webpack/issues/6571
  sideEffects: true,
},
{
  test: cssModuleRegex,
  use: getStyleLoaders({
    importLoaders: 1,
    sourceMap: isEnvProduction
      ? shouldUseSourceMap
      : isEnvDevelopment,
    modules: {
      mode: 'local',
      getLocalIdent: getCSSModuleLocalIdent,
    },
  }),
},
```
