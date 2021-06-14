import Dep from './dep';
import { VNode } from '../vdom/vnode';
import { arrayMethods } from './array';
import { isArray, isObject, def, hasProto } from '../utils';

const arrayKeys = Object.getOwnPropertyNames(arrayMethods);

class Observer {
  constructor(data) {
    this.dep = new Dep();
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
  }

  // 判断是否属性本身设置过存储器描述
  const getter = property && property.get;
  const setter = property && property.set;

  let childOb = observe(val); // 对值内部的属性进行数据劫持，这里源码中会做一个 shallow 判断，是否一开始深层进行依赖

  Object.defineProperty(data, key, {
    enumerable: true,
    configurable: true,
    get() {
      const value = getter ? getter.call(data) : val;
      if (Dep.target) {
        dep.depend(); // 收集依赖,包括 Watcher 收集 dep 和 dep 收集 Watcher
        if (childOb) {
          /**
           * 子数据响应对象本身的 this.dep 也进行依赖收集
           * 这里其实对于数组方法重写的劫持触发更新，就是调用这里的 this.dep
           * {a: [1, 2]}
           * a 会闭包一个 dep 依赖，然后 value：[1, 2] 会构建出 ob 然后对 ob.dep 也会收集当前的依赖
           */
          childOb.dep.depend();
          if (Array.isArray(value)) {
            // 如果是数组，对里面每一个响应对象本身的 this.dep 也进行依赖收集
            dependArray(value);
          }
        }
      }
      // console.log('响应式获取：' + value);
      return value;
    },
    set(newVal) {
      const value = getter ? getter.call(newVal) : val;
      // 这里的 newVal !== newVal && value !== value 为了避免 newVal 和 value 是一个 NaN，很严谨
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return;
      }
      // console.log('响应式设置：' + key + ' = ' + newVal);
      if (setter) {
        setter.call(data, newVal);
      } else {
        val = newVal;
      }
      observe(newVal); // 对值内部的属性进行数据劫持，这里源码中会做一个 shallow 判断，是否一开始深层进行依赖
      dep.notify(); // 触发依赖更新函数
    },
  });
}

function dependArray(value) {
  for (let e, i = 0, l = value.length; i < l; i++) {
    e = value[i];
    e && e.__ob__ && e.__ob__.dep.depend();
    if (Array.isArray(e)) {
      dependArray(e);
    }
  }
}

function observe(data) {
  if (!isObject(data) || data instanceof VNode) {
    return;
  }
  let ob;
  if (data.__ob__) {
    ob = data.__ob__;
  } else {
    ob = new Observer(data);
  }
  return ob;
}

export { observe };
