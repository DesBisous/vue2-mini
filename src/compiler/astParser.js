import { addAttr, addHandler } from './helpers';
// id="app" id='app' id=app
const attribute =
  /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
const dynamicArgAttribute =
  /^\s*((?:v-[\w-]+:|@|:|#)\[[^=]+?\][^\s"'<>\/=]*)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
//标签名  <my-header></my-header>
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`;
// <my:header></my:header>
const qnameCapture = `((?:${ncname}\\:)?${ncname})`;
// <div
const startTagOpen = new RegExp(`^<${qnameCapture}`);
// > />
const startTagClose = /^\s*(\/?)>/;
// </div>
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`);

const dynamicArgRE = /^\[.*\]$/;
const dirRE = /^v-|^@|^:|^#/;
const bindRE = /^:|^v-bind:/;
const onRE = /^@|^v-on:/;

// 以上正则是从官方 Vue 源码扣的

// src/compiler/parser/index.js 方法名：parse -> parseHTML
function parseHtmlToAst(html) {
  let text,
    root,
    currentParent,
    stack = [];

  while (html) {
    // 查找 < 它包括例如： <div> </div>
    let textEnd = html.indexOf('<');

    if (textEnd === 0) {
      // 获取到标签组装好的结构对象
      const startTagMatch = parseStartTag();

      // 对该标签进行子父层级处理
      if (startTagMatch) {
        start(startTagMatch.tagName, startTagMatch.attrs);
        continue;
      }

      // 获取标签结束 </div> 进行配置
      const endTagMatch = html.match(endTag);

      if (endTagMatch) {
        // 删除结束标签的字符
        advance(endTagMatch[0].length);
        // 遇到结束标签，进行父子管理处理
        end();
        continue;
      }
    }

    if (textEnd > 0) {
      text = html.substring(0, textEnd);
    }

    if (text) {
      advance(text.length);
      chars(text);
    }
  }

  // src/compiler/parser/html-parser.js
  function parseStartTag() {
    const start = html.match(startTagOpen);

    let end, attr;

    if (start) {
      // 保存标签名
      const match = {
        tagName: start[1],
        attrs: [],
      };
      // 删除匹配项
      advance(start[0].length);

      // 开始匹配标签属性
      while (
        !(end = html.match(startTagClose)) &&
        (attr = html.match(dynamicArgAttribute) || html.match(attribute))
      ) {
        match.attrs.push({
          name: attr[1],
          value: attr[3] || attr[4] || attr[5],
        });
        advance(attr[0].length);
      }

      if (end) {
        // 删除匹配项
        advance(end[0].length);
        return match;
      }
    }
  }

  // 节点完结时，处理额外事物
  function closeElement(element) {
    element = processElement(element);
  }

  function processElement(element) {
    // processRef(element);
    // processSlotContent(element);
    // processSlotOutlet(element);
    // processComponent(element);
    processAttrs(element);
    return element;
  }

  function processAttrs(el) {
    const list = el.attrs;
    el.attrs = [];
    let i, l, name, value, isDynamic;
    for (i = 0, l = list.length; i < l; i++) {
      name = list[i].name;
      value = list[i].value;
      // vue 指令
      if (dirRE.test(name)) {
        if (bindRE.test(name)) {
          // v-bind
          name = name.replace(bindRE, '');
          isDynamic = dynamicArgRE.test(name);
          if (isDynamic) {
            name = name.slice(1, -1);
          }
          addAttr(el, name, value, isDynamic);
        } else if (onRE.test(name)) {
          // v-on
          name = name.replace(onRE, '');
          isDynamic = dynamicArgRE.test(name);
          if (isDynamic) {
            name = name.slice(1, -1);
          }
          addHandler(el, name, value);
        }
      } else {
        isDynamic = false;
        name = name.replace(dirRE, '');
        if (name === 'style') {
          let styleAttrs = {};
          value.split(';').forEach(subItem => {
            const [key, value] = subItem.split(':');
            styleAttrs[key] = value;
          });
          value = styleAttrs;
        }
        value = JSON.stringify(value);
        addAttr(el, name, value, isDynamic);
      }
    }
  }

  // 对 html 删除匹配项长度父子
  function advance(len) {
    html = html.substring(len);
  }

  // 对开始标签进行父子关系处理
  function start(tagName, attrs) {
    const element = createASTElement(tagName, attrs);

    if (!root) {
      root = element;
    }

    stack.push(element);
    currentParent = element;
  }

  // 对结束标签进行父子关系处理
  function end() {
    // 出栈，出栈的就是当前匹配到的结束标签
    const element = stack.pop();

    // 判断是否有父级
    if (stack.length > 0) {
      // 取出父级
      currentParent = stack[stack.length - 1];
      // 处理父子关系
      element.parent = currentParent;
      currentParent.children.push(element);
    }
    closeElement(element);
  }

  function chars(text) {
    text = text.trim();

    if (text.length > 0) {
      currentParent.children.push({
        type: 3,
        text,
      });
    }
  }

  // 组装 AST 标签对象结构
  function createASTElement(tagName, attrs) {
    return {
      tag: tagName,
      type: 1,
      children: [],
      attrs,
      parent: Window,
    };
  }

  return root;
}

export { parseHtmlToAst };
