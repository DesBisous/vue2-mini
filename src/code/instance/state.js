import { observe } from '../observer';
import { proxy } from '../utils';

function initState(vm) {
  vm._watchers = [];
  const options = vm.$options;

  if (options.props) {
    initProps(vm);
  }

  if (options.methods) {
    initMethods(vm, options.methods);
  }

  if (options.data) {
    initData(vm);
  }

  if (options.computed) {
    initComputed(vm);
  }

  if (options.watch) {
    initWatch(vm);
  }
}

function initProps(vm) {}

function initMethods(vm, methods) {
  for (const key in methods) {
    if (Object.hasOwnProperty.call(methods, key) && methods[key]) {
      vm[key] = bind(methods[key], vm);
    }
  }
}

function initData(vm) {
  let data = vm.$options.data;

  vm._data = data = typeof data === 'function' ? data.call(vm) : data;

  for (let key in data) {
    proxy(vm, '_data', key); // 代理数据
  }

  observe(data); // 创建响应式
}

function initComputed(vm) {}

function initWatch(vm) {}

function bind(fn, ctx) {
  function boundFn(argu) {
    const len = arguments.length;
    return len
      ? len > 1
        ? fn.apply(ctx, arguments)
        : fn.call(ctx, argu)
      : fn.call(ctx);
  }
  boundFn._length = fn.length;
  return boundFn;
}

export { initState };
