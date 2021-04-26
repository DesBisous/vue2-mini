import { createElement, createTextVNode } from './vnode';

function renderMixin(Vue) {

  Vue.prototype._c = function () {
    return createElement(...arguments);
  }

  Vue.prototype._v = function () {
    return createTextVNode(...arguments);
  }

  Vue.prototype._s = function (value) {
    if (!value) return;
    // 这里为什么直接获取 value 就行，
    // 因为这个 value 就是执行 render 的时候在通过 with 作用下直接获取到了 vm 代理后拿到 _data 的属性
    return typeof value === 'object' ? JSON.stringify(value) : value;
  }

  Vue.prototype._d = function (baseObj, values) {
    for (let i = 0; i < values.length; i += 2) {
      const key = values[i];
      if (typeof key === 'string' && key) {
        baseObj[values[i]] = values[i + 1];
      }
    }
    return baseObj;
  }

  Vue.prototype._render = function () {
    const vm = this,
      render = vm.$options.render,
      vnode = render.call(vm); // 执行这个 render 的时候，会调用 _c、_v、_s 函数
    return vnode;
  }
}

export {
  renderMixin
};