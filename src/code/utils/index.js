function proxy(vm, target, key) {
  Object.defineProperty(vm, key, {
    get() {
      return vm[target][key];
    },
    set(newValue) {
      if (newValue === vm[target][key]) return;
      vm[target][key] = newValue;
    }
  })
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
  })
}

function remove(arr, item) {
  if (arr.length) {
    var index = arr.indexOf(item);
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}

const bailRE = /[^\w.$]/
function parsePath(path) {
  if (bailRE.test(path)) {
    return
  }
  const segments = path.split('.')
  return function (obj) {
    for (let i = 0; i < segments.length; i++) {
      if (!obj) return
      obj = obj[segments[i]]
    }
    return obj
  }
}

export * from './env';

export {
  proxy,
  isObject,
  isArray,
  def,
  remove,
  parsePath
};