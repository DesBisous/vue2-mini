import { isUndef, isDef } from '../../shared/util.js';
import { diff } from './diff.js';
import { doPatch } from './doPatch.js';
import { createElement, removeElement } from './rnode.js';

function patch(oldVnode, vnode) {
  // 判断新的 vnode 不存在
  if (isUndef(vnode)) {
    // 判断旧节点存在
    if (isDef(oldVnode)) {
      // Vue 源码这里会执行销毁的生命周期函数，直接删除旧节点内容
      removeElement(oldVnode);
    }
    return;
  }

  // 判断 oldVnode 是否是真实节点
  const isRealElement = isDef(oldVnode.nodeType),
    el = isRealElement ? oldVnode : oldVnode.el;

  if (isRealElement) {
    // 首次挂载
    const nEl = createElement(vnode),
      parentElement = el.parentElement;

    // el.nextSibling 指的是 el 的兄弟节点
    parentElement.insertBefore(nEl, el.nextSibling);
    parentElement.removeChild(el);
    return nEl;
  } else {
    // oldVnode 与 vnode diff 比较打补丁
    const patches = diff(oldVnode, vnode);
    console.log('patches', patches);
    if (Object.keys(patches).length) {
      // 开始打补丁
      doPatch(el, patches);
    }
    vnode.el = el;
    return el;
  }
}

export { patch };
