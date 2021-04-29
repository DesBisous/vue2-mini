## 前言

首先，将要记录的是项目是旨在实现一个迷你版本的 Vue2 Mini  框架，主要目的是针对于 Vue2 内部的工作原理的梳理和学习，希望能够为有着同样需求 的前端同学们提供小小的帮助。

vue2-mini 框架实现的内容主要包含以下几点：

- 响应式劫持，收集依赖（包含对象、数组）

- 事件 Methods 注册（待实现）

- Watcher 的构建与监听（包含 render Watcher）

- template 编译为 AST

- AST 构造 render 函数（包含处理动态属性、双花括号取值）

- render 函数生成 vnode

- 挂载(初次 Mount)

- vnode 与 oldVnode 的 diff

- 打补丁 doPatch

- 更新(Update Node)

## Vue2 Mini 关键点

#### 响应式劫持，收集依赖（包含对象、数组）
Vue2 的响应式是通过订阅与发布模式 + 数据劫持来实现的。

Vue 对于对象和数字类型的数据劫持方式分别采用的是 `Object.defineProperty` 和重写数组原型链上的`push, pop, shift, unshift, sort, splice, reverse`方法实现的。

Vue 在处理 data 内部的属性的时候，都会代理到 Vue 实例上，因此通常我们通过 `this.xx` 也可以获取到 data 上面数据。
```
function initData(vm) {
  let data = vm.$options.data;

  vm._data = data = typeof data === 'function' ? data.call(vm) : data;

  for (let key in data) {
    proxy(vm, '_data', key); // 代理数据
  }

  observe(data); // 创建响应式
}
```
将 data 代理到 Vue 实例上后，就进行数据劫持的封装了，接下来看看 `observe` 做了什么?

```
function observe(data) {
  // 不是 object 或者是 VNode 子类，不做响应式处理，返回 undefine
  if (!isObject(data) || data instanceof VNode) {
    return;
  }
  let ob;
  if (data.__ob__) {
    ob = data.__ob__; // 标识已进行响应式封装，直接返回
  } else {
    ob = new Observer(data); // 创建新的观察者
  }
  return ob;
}
```
这里第一步返回的 undefined 其实也是有着作用的，针对于数组的依赖收集。

接下来看看 Observer 主要处理了什么事情。
```
class Observer {
  constructor(data) {
    this.dep = new Dep(); // 数组专用依赖
    def(data, '__ob__', this);

    if (isArray(data)) {
      const augment = hasProto
        ? protoAugment
        : copyAugment
      augment(data, arrayMethods, arrayKeys) // 绑定到__proto__或者自身
      this.observeArray(data);
    } else {
      this.walk(data);
    }
  }

  walk(data) {
    const keys = Object.keys(data);
    keys.forEach(function (key) {
      defineReactive(data, key, data[key]); // 属性 key 的存储器描述定义
    });
  }

  observeArray(data) {
    data.forEach(function (item) {
      observe(item); // 数组项也要响应式
    });
  }
}
```
Observer 主要进行数据的响应式进行封装，对数组重写方法，数组的每一项也要封装为 Observer，对象的属性执行 `defineReactive` 进行设置 `set、get`方法。

其中有两个特殊的地方：
1. this.dep = new Dep();

    这个就有意思了，想必看过一些源码的人都知道，对于数组采用的是重写原型上的七个方法进行监听，但监听完后如何触发依赖呢？这里的 `this.dep` 就是数组方法被调用后，触发的依赖，这个依赖对象收集的 Watcher 当会是数组这个 value 的 key 所收集的 Watcher，这可能很抽象，不是很好理解，大概就是这样：
    ```
    let a: {
        b: [1, 2]
    }
    ```
    这里的 b 属性自身内部会闭包一个 dep 依赖列表，当这个 dep 依赖列表需要增加 Watcher 的时候，就会通知 b 的 value 也就是 [1, 2] 这个 Observer 自身的 `this.dep` 也去收集当前的 Watcher，使得 b 和 [1, 2] 产生了神奇的关系纽带，具体的可以看下面的 `defineReactive` 实现。
    
2. augment(data, arrayMethods, arrayKeys)
    这个方法使用来给数组重新定义原型上的方法的，只不过做了兼容，如果没有 `__proto__` 属性的话，会定义在数组自身上。

```
function defineReactive(data, key, val) {
  const dep = new Dep(); // 闭包一个依赖对象

    ...

  let childOb = observe(val); // 对值内部的属性进行数据劫持，这里源码中会做一个 shallow 判断，是否一开始深层进行依赖

  Object.defineProperty(data, key, {
    get() {
      const value = getter ? getter.call(data) : val;
      if (Dep.target) {
        dep.depend(); // 收集依赖,包括 Watcher 收集 dep 和 dep 收集 Watcher
        if (childOb) {
          childOb.dep.depend();
          if (Array.isArray(value)) {
            // 如果是数组，对里面每一个响应对象本身的 this.dep 也进行依赖收集
            dependArray(value);
          }
        }
      }
      return value;
    },
    set(newVal) {
      const value = getter ? getter.call(newVal) : val;
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      if (setter) {
        setter.call(data, newVal)
      } else {
        val = newVal
      }
      observe(newVal);
      dep.notify(); // 触发依赖更新函数
    }
  })
}
```
`get` 会进行数据依赖收集，这里有一个比较有意思的是，`childOb.dep.depend()` 会对数组自身的 `this.dep` 进行依赖收集，上面说到 `childOb` 有可能返回 undefined，这时候就不会进行该条件了。

`set` 会触发依赖列表，并且还会对新设置的数据再次进行响应式数据封装，这里也有一个有意思的判断：`newVal !== newVal && value !== value`，这就很奇怪了，`newVal` 肯定等于 `newVal` 呀，怎么会这样判断呢？其实并不然，当 `newVal` 如果是 `NaN` 的时候，`newVal !== newVal` 就会变成 `true` 了，所以 Vue 在这里也做到了很细致的。

#### 事件 Methods 注册（待实现）

#### Watcher 的构建与监听（包含 render Watcher）

#### template 编译为 AST

#### AST 构造 render 函数（包含处理动态属性、双花括号取值）

#### render 函数生成 vnode

#### 挂载(初次 Mount)

#### vnode 与 oldVnode 的 diff

#### 打补丁 doPatch

#### 更新(Update Node)

## 总结