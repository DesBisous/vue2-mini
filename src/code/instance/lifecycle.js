
import Watcher from '../observer/Watcher';
import { patch } from '../vdom/patch';

function mountComponent(vm, el) {
  vm.$el = el;
  // 做一些环境判断
  if (!vm.$options.render) {
    if (process.env.NODE_ENV !== 'production') {
      if ((vm.$options.template && vm.$options.template.charAt(0) !== '#') ||
        vm.$options.el || el) {
        console.warn(
          'You are using the runtime-only build of Vue where the template ' +
          'compiler is not available. Either pre-compile the templates into ' +
          'render functions, or use the compiler-included build.'
        )
      } else {
        console.warn(
          'Failed to mount component: template or render function not defined.'
        )
      }
    }
  }

  // 这个方法在源码中声明时会根据 process.env.NODE_ENV !== 'production' 做一些额外处理
  const updateComponent = () => {
    vm._update(vm._render())
  }

  // 创建一个 render Watcher，这里会执行 updateComponent 对响应式数据做依赖搜集
  vm._watcher = new Watcher(vm, updateComponent);

}

function lifecycleMixin(Vue) {
  Vue.prototype._update = function (vnode) {
    const vm = this,
      prevVnode = vm._vnode;

    // 保存当前 vnode
    vm._vnode = vnode;

    if (!prevVnode) {
      vm.$el = patch(vm.$el, vnode);
    } else {
      vm.$el = patch(prevVnode, vnode);
    }
  }
}

export {
  lifecycleMixin,
  mountComponent
}