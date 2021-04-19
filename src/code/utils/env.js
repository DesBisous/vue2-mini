// can we use __proto__?
export const hasProto = '__proto__' in {}

// Browser environment sniffing
export const inBrowser = typeof window !== 'undefined'
export const UA = inBrowser && window.navigator.userAgent.toLowerCase()
export const isIE = UA && /msie|trident/.test(UA)
export const isIE9 = UA && UA.indexOf('msie 9.0') > 0
export const isEdge = UA && UA.indexOf('edge/') > 0
export const isAndroid = UA && UA.indexOf('android') > 0
export const isIOS = UA && /iphone|ipad|ipod|ios/.test(UA)
export const isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge

export const nextTick = function (watcher) {
  const nextTickHandler = watcher.run.bind(watcher);
  let timerFunc;
  // 这里兼容集中异步 Api 处理
  if (typeof setImmediate !== 'undefined') {
    timerFunc = () => {
      setImmediate(nextTickHandler);
    };
  } else if (typeof MessageChannel !== 'undefined') {
    const channel = new MessageChannel();
    const port = channel.port2;
    channel.port1.onmessage = nextTickHandler;
    timerFunc = () => {
      port.postMessage(1)
    }
  } else
    if (typeof Promise !== 'undefined') {
      const p = Promise.resolve();
      timerFunc = () => {
        p.then(nextTickHandler);
      }
    } else {
      timerFunc = () => {
        setTimeout(nextTickHandler, 0);
      }
    }
  // 开启异步更新
  timerFunc();
}