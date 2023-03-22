# 初见 Web Component
Web Components 旨在解决这些问题 — 它由三项主要技术组成，它们可以一起使用来创建封装功能的定制元素，可以在你喜欢的任何地方重用，不必担心代码冲突。
- Custom element（自定义元素）：一组 JavaScript API，允许您定义 custom elements 及其行为。
- Shadow DOM（影子 DOM）：一组 JavaScript API，用于将封装的“影子”DOM 树附加到元素（与主文档 DOM 分开呈现）并控制其关联的功能。通过这种方式，您可以保持元素的功能私有，这样它们就可以被脚本化和样式化，而不用担心与文档的其他部分发生冲突。
- HTML template（HTML 模板）： `<template>`和`<slot>`元素使您可以编写不在呈现页面中显示的标记模板。然后它们可以作为自定义元素结构的基础被多次重用。


## Features
一个自定义元素主要有几个特性：
1. 样式隔离
2. 可以读取传入的属性
3. 具有特定的生命周期回调函数
