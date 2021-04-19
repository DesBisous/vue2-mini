// 判断是否为 {{  }} 这种文本
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;

function formatProps(attrs) {
  var a = {
    class: '',
    style: {
      color: '',
      fontSize: '',
    }
  }

  let attrStr = '';

  attrs.forEach(item => {
    if (item.name === 'style') {
      let styleAttrs = {};
      item.value.split(';').forEach((subItem) => {
        const [key, value] = subItem.split(':');
        styleAttrs[key] = value;
      })
      item.value = styleAttrs;
    }
    attrStr += `${item.name}: ${JSON.stringify(item.value)},`;
  })

  return `{${attrStr.slice(0, -1)}}`;
}

function generateChild(node) {
  if (node.type === 1) {
    return generate(node);
  } else if (node.type === 3) {
    let text = node.text;

    if (!defaultTagRE.test(text)) {
      // 这里需要 JSON.stringify 在包一下，否者会出现 _v(hello) 解析的时候 hello 不就成了变量了
      return `_v(${JSON.stringify(text)})`
    }

    let match,
      index, // 保存正则成功解析项的开始索引
      // defaultTagRE.lastIndex 会在正则解析的时候，一直处于匹配项末端的索引，下一轮匹配就从 defaultTagRE.lastIndex 开始
      lastIndex = defaultTagRE.lastIndex = 0,
      textArr = [];

    while (match = defaultTagRE.exec(text)) {
      index = match.index; // 保存正则成功解析项的开始索引
      if (index > lastIndex) {
        textArr.push(JSON.stringify(text.slice(lastIndex, index)));
      }
      // 这里不需要 JSON.stringify 原因是，match[1] 指的就是 data 的属性
      textArr.push(`_s(${match[1].trim()})`);
      lastIndex = index + match[0].length;
    }

    // 正则匹配不到了，但是还剩下静态文本
    if (lastIndex < text.length) {
      textArr.push(JSON.stringify(text.slice(lastIndex)));
    }

    // _v('我的姓名是：'+{{name}}+'，请多多关照~')
    return `_v(${textArr.join('+')})`;
  }
}

function getChildren(el) {
  const children = el.children;

  if (children) {
    return children.map(c => generateChild(c)).join(',');
  }
}

function generate(el) {
  const children = getChildren(el);

  const code = `_c(${JSON.stringify(el.tag)}, ${el.attrs.length > 0 ?
    formatProps(el.attrs) : 'undefined'
    }${children ?
      `, ${children}` : ''
    })`;

  return code;
};

export {
  generate,
}

