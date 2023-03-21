# Esbuild + SWC 打包实践

esbuild是go语言编写的并且是多线程执行,性能是js的好几十倍，所以很快。

swc是用rust写的，所实现的功能跟babel一样，es6语法转es5，但是速度比babel更快。

@swc/core 是 swc 的核心包，用于编译 JavaScript 和 TypeScript 代码

esbuild 是一个快速的 JavaScript 和 TypeScript 构建工具

@swc/helpers 是 swc 的辅助包，用于转换 JSX 代码。

swc转换生成器 迭代器 和 装饰器 更优
