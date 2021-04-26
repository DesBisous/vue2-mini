import Dep from './dep';
import { arrayMethods } from './array';
import { isArray, isObject, def, hasProto } from "../utils";

const arrayKeys = Object.getOwnPropertyNames(arrayMethods);

class Observer {
  constructor(data) {
    def(data, '__ob__', this);

    if (isArray(data)) {
      const augment = hasProto
        ? protoAugment
        : copyAugment
      augment(data, arrayMethods, arrayKeys)
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
  target.__proto__ = src
}

function copyAugment(target, src, keys) {
  for (let i = 0, l = keys.length; i < l; i++) {
    const key = keys[i]
    def(target, key, src[key])
  }
}

function defineReactive(data, key, val) {
  const dep = new Dep(); // 闭包一个依赖对象

  // 查找属性的描述器
  const property = Object.getOwnPropertyDescriptor(data, key)
  if (property && property.configurable === false) {
    return
  }

  // 判断是否属性本身设置过存储器描述
  const getter = property && property.get
  const setter = property && property.set

  observe(val); // 对值内部的属性进行数据劫持，这里源码中会做一个 shallow 判断，是否一开始深层进行依赖

  Object.defineProperty(data, key, {
    enumerable: true,
    configurable: true,
    get() {
      const value = getter ? getter.call(data) : val;
      if (Dep.target) {
        dep.depend(); // 收集依赖,包括 Watcher 收集 dep 和 dep 收集 Watcher
      }
      // console.log('响应式获取：' + value);
      return value;
    },
    set(newVal) {
      const value = getter ? getter.call(newVal) : val;
      // 这里的 newVal !== newVal && value !== value 为了避免 newVal 和 value 是一个 NaN，很严谨
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      console.log('响应式设置：' + key + ' = ' + newVal);
      if (setter) {
        setter.call(data, newVal)
      } else {
        val = newVal
      }
      observe(newVal); // 对值内部的属性进行数据劫持，这里源码中会做一个 shallow 判断，是否一开始深层进行依赖
      dep.notify(); // 触发依赖更新函数
    }
  })
}

function observe(data) {
  if (!isObject(data) || data.__ob__) {
    return data
  }
  new Observer(data);
}

export {
  observe
}