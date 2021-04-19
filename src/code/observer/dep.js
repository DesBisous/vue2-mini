import { remove } from '../utils';

let uid = 0;

export default class Dep {
  constructor() {
    this.id = uid++;
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

export function pushTarget(_target) {
  if (Dep.target) targetStack.push(Dep.target);
  Dep.target = _target;
}

export function popTarget() {
  Dep.target = targetStack.pop();
}