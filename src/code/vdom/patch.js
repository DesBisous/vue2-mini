
import { isUndef, isDef } from '../../shared/util.js';

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
    el = isRealElement ? oldVnode : oldVnode.el,
    nEl = createElement(vnode),
    parentElement = el.parentElement;

  // el.nextSibling 指的是 el 的兄弟节点
  parentElement.insertBefore(nEl, el.nextSibling);
  parentElement.removeChild(el);
  return nEl;
}

function createElement(vnode) {
  const { tag, props, children, text } = vnode;
  if (typeof tag === 'string') {
    vnode.el = document.createElement(tag);
    updateProps(vnode);
    children.forEach(function (child) {
      vnode.el.appendChild(createElement(child));
    })
  } else {
    vnode.el = document.createTextNode(text);
  }
  return vnode.el;
}

function updateProps(vnode) {
  const el = vnode.el,
    newProps = vnode.props || {};

  for (let key in newProps) {
    if (Object.hasOwnProperty.call(newProps, key)) {
      if (key === 'style') {
        for (let sKey in newProps[key]) {
          if (Object.hasOwnProperty.call(newProps[key], sKey)) {
            el.style[sKey] = newProps[key][sKey];
          }
        }
      } else if (key === 'class') {
        el.className = el.class;
      } else {
        el.setAttribute(key, newProps[key]);
      }
    }
  }
}

function removeElement(oldVnode) {
  // 判断 oldVnode 是否是真实节点
  const isRealElement = isDef(oldVnode.nodeType)
  let el = isRealElement ? oldVnode : oldVnode.el;
  const childNodes = el.childNodes;
  for (const item of childNodes) {
    removeNode(el, childNode);
  }
}

function removeNode(parent, childNode) {
  parent.removeChild(childNode);
}

export {
  patch
};