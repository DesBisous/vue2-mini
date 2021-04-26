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

  handleProps(el, newProps);
}

function handleProps(rnode, props) {
  for (let key in props) {
    if (Object.hasOwnProperty.call(props, key)) {
      if (!props[key]) {
        rnode.removeAttribute(key);
      } else if (key === 'style') {
        for (let sKey in props[key]) {
          if (Object.hasOwnProperty.call(props[key], sKey)) {
            rnode.style[sKey] = props[key][sKey];
          }
        }
      } else if (key === 'class') {
        rnode.className = props[key];
      } else if (key === 'value') {
        if (rnode.tagName === 'INPUT' || rnode.tagName === 'TEXTAREA') {
          rnode.value = props[key];
        } else {
          rnode.setAttribute(key, props[key]);
        }
      } else {
        rnode.setAttribute(key, props[key]);
      }
    }
  }
}

function removeElement(oldVnode) {
  // 判断 oldVnode 是否是真实节点
  const isRealElement = isDef(oldVnode.nodeType)
  let el = isRealElement ? oldVnode : oldVnode.el;
  const childNodes = el.childNodes;
  for (const childNode of childNodes) {
    removeNode(el, childNode);
  }
}

function removeNode(parent, childNode) {
  parent.removeChild(childNode);
}

export {
  createElement,
  handleProps,
  removeElement
}