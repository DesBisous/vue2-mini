(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
}(this, (function () { 'use strict';

  const originArrMethods = Array.prototype,
        newArrMethods = Object.create(originArrMethods); // 创建一个对象， 并继承 Array.prototype

  const ARR_METHODS = ['push', 'pop', 'shift', 'unshify', 'reverse', 'sort', 'splice'];
  ARR_METHODS.forEach(function (method) {
    newArrMethods[method] = function (...args) {
      const result = originArrMethods[method].apply(this, args),
            ob = this.__ob__;
      let newArr;

      switch (method) {
        case 'push':
        case 'unshift':
          newArr = args;
          break;

        case 'splice':
          newArr = args[2];
          break;
      } // 对数组新加入的元素进行数据劫持


      if (newArr) ob.observeArray(newArr); // 返回原函数执行结果

      return result;
    };
  });

  function proxy(vm, target, key) {
    Object.defineProperty(vm, key, {
      get() {
        return target[key];
      },

      set(newValue) {
        if (newValue === target[key]) return;
        target[key] = newValue;
      }

    });
  }

  function isObject(value) {
    return typeof value === 'object' && value !== null;
  }

  function isArray(value) {
    return Array.isArray(value);
  }

  function setConstantProperty(data, key, value) {
    Object.defineProperty(data, key, {
      configurable: false,
      enumerable: false,
      writable: true,
      value
    });
  }

  class Observer {
    constructor(data) {
      setConstantProperty(data, '__ob__', this);

      if (isArray(data)) {
        data.__proto__ == newArrMethods;
        this.observeArray(data);
      } else {
        this.walk(data);
      }
    }

    walk(data) {
      const keys = Object.keys(data);
      keys.forEach(function (key) {
        defineReactive(data, key, data[key]);
      });
    }

    observeArray(data) {
      data.forEach(function (item) {
        observe(item);
      });
    }

  }

  function defineReactive(data, key, value) {
    Object.defineProperty(data, key, {
      get() {
        console.log('响应式获取：' + value);
        return value;
      },

      set() {
        console.log('响应式设置：' + key + ' = ' + newValue);
        observe(newValue); // 对新加入的数据 value 进行数据劫持

        value = newValue;
      }

    });
  }

  function observe(data) {
    if (!isObject(data) || data.__ob__) {
      return data;
    }

    new Observer(data);
  }

  function initState(vm) {
    const options = vm.$options;

    if (options.props) ;

    if (options.methods) ;

    if (options.data) {
      initData(vm);
    }

    if (options.computed) ;

    if (options.watch) ;
  }

  function initData(vm) {
    let data = vm.$options.data;
    vm._data = data = typeof data === 'function' ? data.call(vm) : data;

    for (let key in data) {
      proxy(vm, '_data', key);
    }

    observe(data);
  }

  // import { mountComponent } from './instance/lifecycle';

  function initMixin(Vue) {
    // 世界的开始
    Vue.prototype._init = function (option) {
      const vm = this;
      vm.$options = options; // 响应式劫持

      initState(vm); // if (vm.$options.el) {
      //     // 挂载函数 Vue.prototype.$mount
      //     vm.$mount(vm.$options.el)
      // }
    }; // Vue.prototype.$mount = function(el) {
    //     const vm = this,
    //         options = vm.$options;
    //     el = document.querySelector('el'),
    //     vm.$el = el;
    //     if (!options.render) {
    //         let template = options.template;
    //         if (!template) {
    //             template = el.outerHTML;
    //         }
    //         // 构建 AST -> Render
    //         const render = compileToRenderFunction(template);
    //         options.render = render;
    //     }
    //     mountComponent(vm);
    // }

  }

  // import { renderMixin } from './code/vdom';

  function Vue(options) {
    this_init(options);
  }

  initMixin(Vue); // lifecycleMixin(Vue);

  return Vue;

})));
//# sourceMappingURL=index.jsx.map
