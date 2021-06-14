import { nextTick } from '../utils';

const queue = [];
let has = {};
let waiting = false;
let flushing = false;
let index = 0;

// 完成异步任务，将队列清理完毕后，重置
function resetSchedulerState() {
  index = queue.length = 0;
  has = {};
  waiting = flushing = false;
}

function flushSchedulerQueue() {
  let watcher, id;

  queue.sort((a, b) => a.id - b.id);

  for (index = 0; index < queue.length; index++) {
    watcher = queue[index];
    id = watcher.id;
    has[id] = null;
    watcher.run();
  }
  resetSchedulerState();
}

function queueWatcher(watcher) {
  const id = watcher.id;
  // undefined == null -> true
  if (has[id] == null) {
    has[id] = true;
    // 判断异步任务是否开始执行，如果未执行直接放到队列后面
    if (!flushing) {
      queue.push(watcher);
    } else {
      // 如果已经开始执行队列任务了,将当前 watcher 放入到队列排序相应位置，加入执行队列中
      let i = queue.length - 1;
      while (i > index && queue[i].id > watcher.id) {
        i--;
      }
      queue.splice(i + 1, 0, watcher);
    }
    // 初始化、异步队列中已存在 watcher、异步任务执行中且未执行完的状态下，不允许开通下一个异步任务
    if (!waiting) {
      waiting = true;
      nextTick(flushSchedulerQueue);
    }
  }
}

export { queueWatcher };
