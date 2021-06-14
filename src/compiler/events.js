const fnExpRE = /^([\w$_]+|\([^)]*?\))\s*=>|^function(?:\s+[\w$]+)?\s*\(/;
const fnInvokeRE = /\([^)]*?\);*$/;
const simplePathRE =
  /^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['[^']*?']|\["[^"]*?"]|\[\d+]|\[[A-Za-z_$][\w$]*])*$/;

function genHandler(handler) {
  if (!handler) {
    return 'function(){}';
  }
  if (Array.isArray(handler)) {
    return `[${handler.map(handler => genHandler(handler)).join(',')}]`;
  }

  const isMethodPath = simplePathRE.test(handler.value); //是否为简单的表达式，比如 onShow 等
  const isFunctionExpression = fnExpRE.test(handler.value); //是否为函数表达式(箭头函数或function(){}格式的匿名函数)
  const isFunctionInvocation = simplePathRE.test(
    // 是否需要 return
    handler.value.replace(fnInvokeRE, '')
  );

  // 是否有修饰符，比如 @click.sync
  if (!handler.modifiers) {
    if (isMethodPath || isFunctionExpression) {
      return handler.value;
    }
    return `function($event){${
      isFunctionInvocation ? `return ${handler.value}` : handler.value
    }}`; // inline statement
  }
}

export function genHandlers(events, isNative) {
  const prefix = isNative ? 'nativeOn:' : 'on:';
  let staticHandlers = ``;
  let dynamicHandlers = ``;
  for (const name in events) {
    const handlerCode = genHandler(events[name]);
    if (events[name] && events[name].dynamic) {
      dynamicHandlers += `${name},${handlerCode},`;
    } else {
      staticHandlers += `"${name}":${handlerCode},`;
    }
  }
  staticHandlers = `{${staticHandlers.slice(0, -1)}}`;
  if (dynamicHandlers) {
    return prefix + `_d(${staticHandlers},[${dynamicHandlers.slice(0, -1)}])`;
  } else {
    return prefix + staticHandlers;
  }
}
