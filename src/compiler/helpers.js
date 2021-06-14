export function addAttr(el, name, value, dynamic) {
  el.attrs.push({
    name,
    value,
    dynamic,
  });
}

export function addHandler(el, name, value, dynamic) {
  let events;
  events = el.events || (el.events = {});
  const newHandler = {
    value: value.trim(),
    dynamic,
  };
  let handlers = events[name]; //尝试获取已经存在的该事件对象
  if (Array.isArray(handlers)) {
    //如果是数组，表示已经插入了两次了，则再把newHandler添加进去
    handlers.push(newHandler);
  } else if (handlers) {
    //如果handlers存在且不是数组，则表示只插入过一次，则把events[name]变为数组
    events[name] = [handlers, newHandler];
  } else {
    events[name] = newHandler; //否则表示是第一次新增该事件，则值为对应的newHandler
  }
}
