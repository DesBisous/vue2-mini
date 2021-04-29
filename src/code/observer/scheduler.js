import { nextTick } from '../utils';

function queueWatcher(watcher) {
  nextTick(watcher);
}

export { queueWatcher };
