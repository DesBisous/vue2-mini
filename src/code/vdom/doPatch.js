import { ATTR, TEXT, REMOVE, REPLACE } from './patchTypes';
import { createElement, handleProps } from './rnode';

let index = 0;
let finalPatches = {};

function doPatch(el, patches) {
  index = 0;
  finalPatches = patches;
  rnodeWalk(el);
}

function rnodeWalk(rnode) {
  const patch = finalPatches[index++],
    childNodes = rnode.childNodes;

  [...childNodes].map(c => rnodeWalk(c));

  if (patch) {
    patchAction(rnode, patch);
  }
}

function patchAction(rnode, patch) {
  for (const p of patch) {
    switch (p.type) {
      case ATTR:
        handleProps(rnode, p.attrs);
        break;
      case TEXT:
        rnode.textContent = p.text;
        break;
      case REMOVE:
        rnode.parentNode.removeChild(rnode);
        break;
      case REPLACE:
        rnode.parentNode.replaceChild(createElement(p.vnode), rnode);
        break;
      default:
        break;
    }
  }
}

export { doPatch };
