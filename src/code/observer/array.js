import { def } from '../utils';

const originArrMethods = Array.prototype,
  arrayMethods = Object.create(originArrMethods); // 创建一个对象， 并继承 Array.prototype

const ARR_METHODS = [
  'push',
  'pop',
  'shift',
  'unshify',
  'reverse',
  'sort',
  'splice',
];

ARR_METHODS.forEach(function (method) {
  def(arrayMethods, method, function (...args) {
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
      default:
        break;
    }

    // 对数组新加入的元素进行数据劫持
    if (newArr) ob.observeArray(newArr);
    // notify change
    ob.dep.notify();
    // 返回原函数执行结果
    return result;
  });
});

export { arrayMethods };
