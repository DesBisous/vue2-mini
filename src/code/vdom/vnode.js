class VNode {
  constructor(tag, props, children, text) {
    this.tag = tag;
    this.props = props;
    this.children = children;
    this.text = text;
  }
}

function createElementVNode(tag, attrs = {}, ...children) {
  return new VNode(tag, attrs, children);
}

function createTextVNode(text) {
  return new VNode(undefined, undefined, undefined, text);
}

export {
  VNode,
  createElementVNode,
  createTextVNode
}