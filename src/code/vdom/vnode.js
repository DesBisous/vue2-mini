class VNode {
  constructor(tag, props, children, text) {
    this.tag = tag;
    this.props = props;
    this.children = children;
    this.text = text;
  }
}

function createElementVNode(tag, props = {}, ...children) {
  return new VNode(tag, props, children);
}

function createTextVNode(text) {
  return new VNode(undefined, undefined, undefined, text);
}

export { VNode, createElementVNode, createTextVNode };
