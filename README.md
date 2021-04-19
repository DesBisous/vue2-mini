## 前言
本项目 vue2-mini 旨在实现一个迷你版本的 Vue2 框架，主要目的用于学习 Vue2 内部的工作原理。

vue2-mini 的内容包含：
- 响应式劫持，收集依赖
- Watcher 的构建与监听
- template 编译为 AST
- AST 构造 render 函数
- render 函数生成 vnode
- vnode 与 oldVnode 的 diff - [待添加]
- 打补丁 patch - [待添加]
- 挂载(mount)与更新(update)