import { parsePath } from '../utils';
import { pushTarget, popTarget } from './dep';
import { queueWatcher } from './scheduler';

let uid = 0;

export default class Watcher {
  constructor(vm, expOrFn, options) {
    this.vm = vm;
    vm._watchers.push(this);

    // options 源码中还有更多，比如：deep
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
        this.getter = function () { }
        process.env.NODE_ENV !== 'production' && console.warn(
          `Failed watching path: "${expOrFn}" ` +
          'Watcher only accepts simple dot-delimited paths. ' +
          'For full control, use a function instead.'
        )
      }
    }

    // 初次执行
    this.value = this.lazy
      ? undefined
      : this.get();
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
    const id = dep.id;
    // 当前 Watcher 的新 depIds 不存在，这加入传进来的 dep
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