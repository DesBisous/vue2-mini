import { ATTR, TEXT, REMOVE, REPLACE } from './patchTypes';

// 存储 diff 产生的补丁
let patches = {};
let vnIndex = 0;

function diff(oldVnode, vnode) {
  patches = {};
  vnIndex = 0;
  const index = 0; // 初始从零开始
  vNodeWalk(oldVnode, vnode, index);
  return patches;
}

function vNodeWalk(oldVnode, vnode, index) {
  const vnPatch = [];

  if (!vnode) {
    // 新 vnode 被删除了
    vnPatch.push({
      type: REMOVE,
      index,
    });
  } else if (oldVnode.text && vnode.text) {
    if (oldVnode.text !== vnode.text) {
      vnPatch.push({
        type: TEXT,
        text: vnode.text,
      });
    }
  } else if (oldVnode.tag === vnode.tag) {
    const attrsPatch = attrsWalk(oldVnode.props, vnode.props);
    if (Object.keys(attrsPatch).length) {
      vnPatch.push({
        type: ATTR,
        attrs: attrsPatch,
      });
    }
    childrenWalk(oldVnode.children, vnode.children);
  } else {
    vnPatch.push({
      type: REPLACE,
      vnode,
    });
  }

  if (vnPatch.length) {
    patches[index] = vnPatch;
  }
}

function attrsWalk(oldProps, newProps) {
  const attrsPatch = {};

  for (const key in oldProps) {
    if (JSON.stringify(oldProps[key]) !== JSON.stringify(newProps[key])) {
      // 旧有，新没，会压入 undefined
      // 旧有，新有，替换
      attrsPatch[key] = newProps[key];
    }
  }

  for (const key in newProps) {
    if (!Object.hasOwnProperty.call(oldProps, key)) {
      // 旧没，新有，新增
      attrsPatch[key] = newProps[key];
    }
  }
  return attrsPatch;
}

function childrenWalk(oldChildren, newChildren) {
  oldChildren.map((child, idx) => {
    vNodeWalk(child, newChildren[idx], ++vnIndex);
  });
}

export { diff };
