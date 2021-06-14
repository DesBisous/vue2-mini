import { isDef } from '../../shared/util.js';

function createElement(vnode) {
  const { tag, children, text } = vnode;
  if (typeof tag === 'string') {
    vnode.el = document.createElement(tag);
    updateProps(vnode);
    children.forEach(function (child) {
      vnode.el.appendChild(createElement(child));
    });
  } else {
    vnode.el = document.createTextNode(text);
  }
  return vnode.el;
}

function updateProps(vnode) {
  const el = vnode.el,
    newProps = vnode.props || {};

  handleProps(el, newProps);
}

function handleProps(rnode, props) {
  handleAttrs(rnode, props.attrs);
  updateDOMListeners(rnode, props.on);
}

function handleAttrs(rnode, attrs) {
  for (let key in attrs) {
    if (Object.hasOwnProperty.call(attrs, key)) {
      if (!attrs[key]) {
        rnode.removeAttribute(key);
      } else if (key === 'style') {
        for (let sKey in attrs[key]) {
          if (Object.hasOwnProperty.call(attrs[key], sKey)) {
            rnode.style[sKey] = attrs[key][sKey];
          }
        }
      } else if (key === 'class') {
        rnode.className = attrs[key];
      } else if (key === 'value') {
        if (rnode.tagName === 'INPUT' || rnode.tagName === 'TEXTAREA') {
          rnode.value = attrs[key];
        } else {
          rnode.setAttribute(key, attrs[key]);
        }
      } else {
        rnode.setAttribute(key, attrs[key]);
      }
    }
  }
}

function updateDOMListeners(rnode, on) {
  function add(event, handler) {
    rnode.addEventListener(event, handler, false);
  }

  for (const name in on) {
    //遍历on,此时name就是对应的事件类型，比如:click
    const cur = on[name];
    if (Array.isArray(cur)) {
      for (const handler of on) {
        add(name, handler);
      }
    } else {
      add(name, cur);
    }
  }
}

function removeElement(oldVnode) {
  // 判断 oldVnode 是否是真实节点
  const isRealElement = isDef(oldVnode.nodeType);
  let el = isRealElement ? oldVnode : oldVnode.el;
  const childNodes = el.childNodes;
  for (const childNode of childNodes) {
    removeNode(el, childNode);
  }
}

function removeNode(parent, childNode) {
  parent.removeChild(childNode);
}

export { createElement, handleProps, removeElement };
