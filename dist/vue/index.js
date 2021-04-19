(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
}(this, (function () { 'use strict';

  // can we use __proto__?
  const hasProto = ('__proto__' in {}); // Browser environment sniffing

  const inBrowser = typeof window !== 'undefined';
  const UA = inBrowser && window.navigator.userAgent.toLowerCase();
  UA && /msie|trident/.test(UA);
  UA && UA.indexOf('msie 9.0') > 0;
  const isEdge = UA && UA.indexOf('edge/') > 0;
  UA && UA.indexOf('android') > 0;
  UA && /iphone|ipad|ipod|ios/.test(UA);
  UA && /chrome\/\d+/.test(UA) && !isEdge;
  const nextTick = function (watcher) {
    const nextTickHandler = watcher.run.bind(watcher);
    let timerFunc; // 这里兼容集中异步 Api 处理

    if (typeof setImmediate !== 'undefined') {
      timerFunc = () => {
        setImmediate(nextTickHandler);
      };
    } else if (typeof MessageChannel !== 'undefined') {
      const channel = new MessageChannel();
      const port = channel.port2;
      channel.port1.onmessage = nextTickHandler;

      timerFunc = () => {
        port.postMessage(1);
      };
    } else if (typeof Promise !== 'undefined') {
      const p = Promise.resolve();

      timerFunc = () => {
        p.then(nextTickHandler);
      };
    } else {
      timerFunc = () => {
        setTimeout(nextTickHandler, 0);
      };
    } // 开启异步更新


    timerFunc();
  };

  function proxy(vm, target, key) {
    Object.defineProperty(vm, key, {
      get() {
        return vm[target][key];
      },

      set(newValue) {
        if (newValue === vm[target][key]) return;
        vm[target][key] = newValue;
      }

    });
  }

  function isObject(value) {
    return typeof value === 'object' && value !== null;
  }

  function isArray(value) {
    return Array.isArray(value);
  }

  function def(data, key, value, enumerable) {
    Object.defineProperty(data, key, {
      configurable: true,
      enumerable: !!enumerable,
      writable: true,
      value
    });
  }

  function remove(arr, item) {
    if (arr.length) {
      var index = arr.indexOf(item);

      if (index > -1) {
        return arr.splice(index, 1);
      }
    }
  }

  const bailRE = /[^\w.$]/;

  function parsePath(path) {
    if (bailRE.test(path)) {
      return;
    }

    const segments = path.split('.');
    return function (obj) {
      for (let i = 0; i < segments.length; i++) {
        if (!obj) return;
        obj = obj[segments[i]];
      }

      return obj;
    };
  }

  let uid$1 = 0;
  class Dep {
    constructor() {
      this.id = uid$1++;
      this.subs = [];
    }

    addSub(sub) {
      this.subs.push(sub);
    }

    removeSub(sub) {
      remove(this.subs, sub);
    }

    depend() {
      // 给当前 Watcher push 依赖，为了后续和 dep 的 subs 进行比较，移除掉无用的依赖，
      // 意思就是没用到的属性，在属性变更后就不要通知相对应的 Watcher 了
      if (Dep.target) {
        Dep.target.addDep(this); // Watcher 对象中的 addDep，里面会调用 dep.addSub()
      }
    }

    notify() {
      // stabilize the subscriber list first
      const subs = this.subs.slice(); // 浅拷贝

      for (let i = 0, l = subs.length; i < l; i++) {
        subs[i].update(); // 触发依赖更新函数
      }
    }

  }
  Dep.target = null;
  const targetStack = [];
  function pushTarget(_target) {
    if (Dep.target) targetStack.push(Dep.target);
    Dep.target = _target;
  }
  function popTarget() {
    Dep.target = targetStack.pop();
  }

  const originArrMethods = Array.prototype,
        arrayMethods = Object.create(originArrMethods); // 创建一个对象， 并继承 Array.prototype

  const ARR_METHODS = ['push', 'pop', 'shift', 'unshify', 'reverse', 'sort', 'splice'];
  ARR_METHODS.forEach(function (method) {
    arrayMethods[method] = function (...args) {
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

  const arrayKeys = Object.getOwnPropertyNames(arrayMethods);

  class Observer {
    constructor(data) {
      def(data, '__ob__', this);

      if (isArray(data)) {
        const augment = hasProto ? protoAugment : copyAugment;
        augment(data, arrayMethods, arrayKeys);
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

  function protoAugment(target, src, keys) {
    target.__proto__ = src;
  }

  function copyAugment(target, src, keys) {
    for (let i = 0, l = keys.length; i < l; i++) {
      const key = keys[i];
      def(target, key, src[key]);
    }
  }

  function defineReactive(data, key, val) {
    const dep = new Dep(); // 闭包一个依赖对象
    // 查找属性的描述器

    const property = Object.getOwnPropertyDescriptor(data, key);

    if (property && property.configurable === false) {
      return;
    } // 判断是否属性本身设置过存储器描述


    const getter = property && property.get;
    const setter = property && property.set;
    observe(val); // 对值内部的属性进行数据劫持，这里源码中会做一个 shallow 判断，是否一开始深层进行依赖

    Object.defineProperty(data, key, {
      enumerable: true,
      configurable: true,

      get() {
        const value = getter ? getter.call(data) : val;

        if (Dep.target) {
          dep.depend(); // 收集依赖,包括 Watcher 收集 dep 和 dep 收集 Watcher
        }

        console.log('响应式获取：' + value);
        return value;
      },

      set(newVal) {
        const value = getter ? getter.call(newVal) : val; // 这里的 newVal !== newVal && value !== value 为了避免 newVal 和 value 是一个 NaN，很严谨

        if (newVal === value || newVal !== newVal && value !== value) {
          return;
        }

        console.log('响应式设置：' + key + ' = ' + newVal);

        if (setter) {
          setter.call(data, newVal);
        } else {
          val = newVal;
        }

        observe(newVal); // 对值内部的属性进行数据劫持，这里源码中会做一个 shallow 判断，是否一开始深层进行依赖

        dep.notify(); // 触发依赖更新函数
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
    vm._watchers = [];
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

  // id="app" id='app' id=app
  const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; //标签名  <my-header></my-header>

  const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`; // <my:header></my:header>

  const qnameCapture = `((?:${ncname}\\:)?${ncname})`; // <div

  const startTagOpen = new RegExp(`^<${qnameCapture}`); // > />

  const startTagClose = /^\s*(\/?)>/; // </div>

  const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 以上正则是从官方 Vue 源码扣的

  function parseHtmlToAst(html) {
    let text,
        root,
        currentParent,
        stack = [];

    while (html) {
      // 查找 < 它包括例如： <div> </div>
      let textEnd = html.indexOf('<');

      if (textEnd === 0) {
        // 获取到标签组装好的结构对象
        const startTagMatch = parseStartTag(); // 对改标签进行子父层级处理

        if (startTagMatch) {
          start(startTagMatch.tagName, startTagMatch.attrs);
          continue;
        } // 获取标签结束 </div> 进行配置


        const endTagMatch = html.match(endTag);

        if (endTagMatch) {
          // 删除结束标签的字符
          advance(endTagMatch[0].length); // 遇到结束标签，进行父子管理处理

          end();
          continue;
        }
      }

      if (textEnd > 0) {
        text = html.substring(0, textEnd);
      }

      if (text) {
        advance(text.length);
        chars(text);
      }
    }

    function parseStartTag() {
      const start = html.match(startTagOpen);
      let end, attr;

      if (start) {
        // 保存标签名
        const match = {
          tagName: start[1],
          attrs: []
        }; // 删除匹配项

        advance(start[0].length); // 开始匹配标签属性

        while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
          match.attrs.push({
            name: attr[1],
            value: attr[3] || attr[4] || attr[5]
          });
          advance(attr[0].length);
        }

        if (end) {
          // 删除匹配项
          advance(end[0].length);
          return match;
        }
      }
    } // 对 html 删除匹配项长度父子


    function advance(len) {
      html = html.substring(len);
    }

    function start(tagName, attrs) {
      const element = createASTElement(tagName, attrs);

      if (!root) {
        root = element;
      }

      stack.push(element);
      currentParent = element;
    } // 对结束标签进行父子关系处理


    function end() {
      // 出栈，出栈的就是当前匹配到的结束标签
      const element = stack.pop(); // 判断是否有父级

      if (stack.length > 0) {
        // 取出父级
        currentParent = stack[stack.length - 1]; // 处理父子关系

        element.parent = currentParent;
        currentParent.children.push(element);
      }
    }

    function chars(text) {
      text = text.trim();

      if (text.length > 0) {
        currentParent.children.push({
          type: 3,
          text
        });
      }
    } // 组装 AST 标签对象结构


    function createASTElement(tagName, attrs) {
      return {
        tag: tagName,
        type: 1,
        children: [],
        attrs,
        parent: Window
      };
    }

    return root;
  }

  // 判断是否为 {{  }} 这种文本
  const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;

  function formatProps(attrs) {
    let attrStr = '';
    attrs.forEach(item => {
      if (item.name === 'style') {
        let styleAttrs = {};
        item.value.split(';').forEach(subItem => {
          const [key, value] = subItem.split(':');
          styleAttrs[key] = value;
        });
        item.value = styleAttrs;
      }

      attrStr += `${item.name}: ${JSON.stringify(item.value)},`;
    });
    return `{${attrStr.slice(0, -1)}}`;
  }

  function generateChild(node) {
    if (node.type === 1) {
      return generate(node);
    } else if (node.type === 3) {
      let text = node.text;

      if (!defaultTagRE.test(text)) {
        // 这里需要 JSON.stringify 在包一下，否者会出现 _v(hello) 解析的时候 hello 不就成了变量了
        return `_v(${JSON.stringify(text)})`;
      }

      let match,
          index,
          // 保存正则成功解析项的开始索引
      // defaultTagRE.lastIndex 会在正则解析的时候，一直处于匹配项末端的索引，下一轮匹配就从 defaultTagRE.lastIndex 开始
      lastIndex = defaultTagRE.lastIndex = 0,
          textArr = [];

      while (match = defaultTagRE.exec(text)) {
        index = match.index; // 保存正则成功解析项的开始索引

        if (index > lastIndex) {
          textArr.push(JSON.stringify(text.slice(lastIndex, index)));
        } // 这里不需要 JSON.stringify 原因是，match[1] 指的就是 data 的属性


        textArr.push(`_s(${match[1].trim()})`);
        lastIndex = index + match[0].length;
      } // 正则匹配不到了，但是还剩下静态文本


      if (lastIndex < text.length) {
        textArr.push(JSON.stringify(text.slice(lastIndex)));
      } // _v('我的姓名是：'+{{name}}+'，请多多关照~')


      return `_v(${textArr.join('+')})`;
    }
  }

  function getChildren(el) {
    const children = el.children;

    if (children) {
      return children.map(c => generateChild(c)).join(',');
    }
  }

  function generate(el) {
    const children = getChildren(el);
    const code = `_c(${JSON.stringify(el.tag)}, ${el.attrs.length > 0 ? formatProps(el.attrs) : 'undefined'}${children ? `, ${children}` : ''})`;
    return code;
  }

  function compileToRenderFunction(html) {
    const ast = parseHtmlToAst(html),
          code = generate(ast),
          render = new Function(`
      with(this){ return ${code}; }
    `); // console.log(ast);
    // console.log(code);

    return render;
  }

  function queueWatcher(watcher) {
    nextTick(watcher);
  }

  let uid = 0;
  class Watcher {
    constructor(vm, expOrFn, options) {
      this.vm = vm;

      vm._watchers.push(this); // options 源码中还有更多，比如：deep


      if (options) {
        this.lazy = !!options.lazy;
      } else {
        this.lazy = false;
      }

      this.id = ++uid;
      this.deps = []; // 存储和当前 watcher 相关的响应式属性的 dep

      this.newDeps = []; // 新的 deps

      this.depIds = new Set();
      this.newDepIds = new Set();

      if (typeof expOrFn === 'function') {
        this.getter = expOrFn;
      } else {
        // parsePath 解析属性(a.b.c)对应在 vm 的 value，源码存在但本处不涉及到
        this.getter = parsePath(expOrFn);

        if (!this.getter) {
          this.getter = function () {};

          process.env.NODE_ENV !== 'production' && console.warn(`Failed watching path: "${expOrFn}" ` + 'Watcher only accepts simple dot-delimited paths. ' + 'For full control, use a function instead.');
        }
      } // 初次执行


      this.value = this.lazy ? undefined : this.get();
    }

    get() {
      // 这就是让 Dep.target 保存当前的 Watcher
      pushTarget(this);

      try {
        this.getter(); // 执行更新函数
      } catch (e) {
        throw e;
      } finally {
        popTarget(); // 弹出 Dep.Target

        this.cleanupDeps(); // 做 Watcher 的 dep 清除
      }
    }

    addDep(dep) {
      const id = dep.id; // 当前 Watcher 的新 depIds 不存在，这加入传进来的 dep

      if (!this.newDepIds.has(id)) {
        this.newDepIds.add(id);
        this.newDeps.push(dep); // Watcher 关联的 dep 保存
        // Watcher 关联的 dep 没有保存过，让 dep 收集当前的 Watcher 依赖
        // Watcher 已保存过了 dep 那就说明，当前 dep 也已经收集了当前 Watcher 了，所有就不需要让 dep 收集依赖了

        if (!this.depIds.has(id)) {
          dep.addSub(this);
        }
      }
    }
    /**
     * Clean up for dependency collection.
     */


    cleanupDeps() {
      // 源码有更多
      this.depIds = this.newDepIds;
      this.newDepIds.clear(); // 清除最新记录 depIds 集合

      this.deps = this.newDeps;
      this.newDeps.length = 0; // 清除最新记录 dep 集合
    }

    update() {
      // 这里的话，源码中会有更多的判断
      // 一般来说更新的话，会进行异步更新，会涉及到 nextTick 函数
      // 最终会执行 run() 函数
      queueWatcher(this);
    }

    run() {
      this.get();
    }

  }

  function isUndef(v) {
    return v === undefined || v === null;
  }
  function isDef(v) {
    return v !== undefined && v !== null;
  }

  function patch(oldVnode, vnode) {
    // 判断新的 vnode 不存在
    if (isUndef(vnode)) {
      // 判断旧节点存在
      if (isDef(oldVnode)) {
        // Vue 源码这里会执行销毁的生命周期函数，直接删除旧节点内容
        removeElement(oldVnode);
      }

      return;
    } // 判断 oldVnode 是否是真实节点


    const isRealElement = isDef(oldVnode.nodeType),
          el = isRealElement ? oldVnode : oldVnode.el,
          nEl = createElement$1(vnode),
          parentElement = el.parentElement; // el.nextSibling 指的是 el 的兄弟节点

    parentElement.insertBefore(nEl, el.nextSibling);
    parentElement.removeChild(el);
    return nEl;
  }

  function createElement$1(vnode) {
    const {
      tag,
      props,
      children,
      text
    } = vnode;

    if (typeof tag === 'string') {
      vnode.el = document.createElement(tag);
      updateProps(vnode);
      children.forEach(function (child) {
        vnode.el.appendChild(createElement$1(child));
      });
    } else {
      vnode.el = document.createTextNode(text);
    }

    return vnode.el;
  }

  function updateProps(vnode) {
    const el = vnode.el,
          newProps = vnode.props || {};

    for (let key in newProps) {
      if (Object.hasOwnProperty.call(newProps, key)) {
        if (key === 'style') {
          for (let sKey in newProps[key]) {
            if (Object.hasOwnProperty.call(newProps[key], sKey)) {
              el.style[sKey] = newProps[key][sKey];
            }
          }
        } else if (key === 'class') {
          el.className = el.class;
        } else {
          el.setAttribute(key, newProps[key]);
        }
      }
    }
  }

  function removeElement(oldVnode) {
    // 判断 oldVnode 是否是真实节点
    const isRealElement = isDef(oldVnode.nodeType);
    let el = isRealElement ? oldVnode : oldVnode.el;
    const childNodes = el.childNodes;

    for (const item of childNodes) {
      removeNode(el, childNode);
    }
  }

  function removeNode(parent, childNode) {
    parent.removeChild(childNode);
  }

  function mountComponent(vm, el) {
    vm.$el = el; // 做一些环境判断

    if (!vm.$options.render) {
      if (process.env.NODE_ENV !== 'production') {
        if (vm.$options.template && vm.$options.template.charAt(0) !== '#' || vm.$options.el || el) {
          console.warn('You are using the runtime-only build of Vue where the template ' + 'compiler is not available. Either pre-compile the templates into ' + 'render functions, or use the compiler-included build.');
        } else {
          console.warn('Failed to mount component: template or render function not defined.');
        }
      }
    } // 这个方法在源码中声明时会根据 process.env.NODE_ENV !== 'production' 做一些额外处理


    const updateComponent = () => {
      vm._update(vm._render());
    }; // 创建一个 render Watcher，这里会执行 updateComponent 对响应式数据做依赖搜集


    vm._watcher = new Watcher(vm, updateComponent);
  }

  function lifecycleMixin(Vue) {
    Vue.prototype._update = function (vnode) {
      const vm = this,
            prevVnode = vm._vnode; // 保存当前 vnode

      vm._vnode = vnode;

      if (!prevVnode) {
        vm.$el = patch(vm.$el, vnode);
      } else {
        vm.$el = patch(prevVnode, vnode);
      }
    };
  }

  function initMixin(Vue) {
    // 世界的开始
    Vue.prototype._init = function (options) {
      const vm = this;
      vm.$options = options; // 响应式劫持

      initState(vm);

      if (vm.$options.el) {
        // 挂载函数 Vue.prototype.$mount
        vm.$mount(vm.$options.el);
      }
    };

    Vue.prototype.$mount = function (el) {
      const vm = this,
            options = vm.$options;
      el = document.querySelector(el);

      if (!options.render) {
        let template = options.template;

        if (!template) {
          template = el.outerHTML;
        } // 构建 AST -> Render


        const render = compileToRenderFunction(template);
        options.render = render;
      } // console.log(options.render);


      mountComponent(vm, el);
    };
  }

  class VNode {
    constructor(tag, props, children, text) {
      this.tag = tag;
      this.props = props;
      this.children = children;
      this.text = text;
    }

  }

  function createElement(tag, attrs = {}, ...children) {
    return new VNode(tag, attrs, children);
  }

  function createTextVNode(text) {
    return new VNode(undefined, undefined, undefined, text);
  }

  function renderMixin(Vue) {
    Vue.prototype._c = function () {
      return createElement(...arguments);
    };

    Vue.prototype._v = function () {
      return createTextVNode(...arguments);
    };

    Vue.prototype._s = function (value) {
      if (!value) return; // 这里为什么直接获取 value 就行，
      // 因为这个 value 就是执行 render 的时候在通过 with 作用下直接获取到了 vm 代理后拿到 _data 的属性

      return typeof value === 'object' ? JSON.stringify(value) : value;
    };

    Vue.prototype._render = function () {
      const vm = this,
            render = vm.$options.render,
            vnode = render.call(vm); // 执行这个 render 的时候，会调用 _c、_v、_s 函数

      return vnode;
    };
  }

  function Vue(options) {
    this._init(options);
  }

  initMixin(Vue);
  lifecycleMixin(Vue);
  renderMixin(Vue);

  return Vue;

})));
//# sourceMappingURL=index.js.map
