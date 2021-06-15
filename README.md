## 前言

首先，将要记录的项目是旨在实现一个迷你版本的 Vue2 Mini  框架，主要目的是针对于 Vue2 内部的工作原理的梳理和学习，希望能够为有着同样需求 的前端同学们提供小小的帮助。

vue2-mini 框架实现的内容主要包含以下几点：

- 响应式劫持，收集依赖（包含对象、数组）

- template 编译为 AST

- AST 构造 render 函数（包含处理动态属性、双花括号取值）

- render 函数生成 vnode

- Watcher 的构建与监听（包含 render Watcher）

- 挂载(初次 Mount)

- 事件 Methods 注册（涉及到多个位置）

- vnode 与 oldVnode 的 diff

- 打补丁 doPatch

- 更新(Update Node)

## Vue2 Mini 关键点

#### 响应式劫持，收集依赖（包含对象、数组）
Vue2 的响应式是通过订阅与发布模式 + 数据劫持来实现的。

Vue 对于对象和数字类型的数据劫持方式分别采用的是 `Object.defineProperty` 和重写数组原型链上的`push, pop, shift, unshift, sort, splice, reverse`方法实现的。

Vue 在处理 data 内部的属性的时候，都会代理到 Vue 实例上，因此通常我们通过 `this.xx` 也可以获取到 data 上面数据。
```
function initData(vm) {
  let data = vm.$options.data;

  vm._data = data = typeof data === 'function' ? data.call(vm) : data;

  for (let key in data) {
    proxy(vm, '_data', key); // 代理数据
  }

  observe(data); // 创建响应式
}
```
将 data 代理到 Vue 实例上后，就进行数据劫持的封装了，接下来看看 `observe` 做了什么?

```
function observe(data) {
  // 不是 object 或者是 VNode 子类，不做响应式处理，返回 undefine
  if (!isObject(data) || data instanceof VNode) {
    return;
  }
  let ob;
  if (data.__ob__) {
    ob = data.__ob__; // 标识已进行响应式封装，直接返回
  } else {
    ob = new Observer(data); // 创建新的观察者
  }
  return ob;
}
```
这里第一步返回的 undefined 其实也是有着作用的，针对于数组的依赖收集，具体可往下看。

接下来看看 Observer 主要处理了什么事情。
```
class Observer {
  constructor(data) {
    this.dep = new Dep(); // 数组专用依赖
    def(data, '__ob__', this);

    if (isArray(data)) {
      const augment = hasProto
        ? protoAugment
        : copyAugment
      augment(data, arrayMethods, arrayKeys) // 绑定到__proto__或者自身
      this.observeArray(data);
    } else {
      this.walk(data);
    }
  }

  walk(data) {
    const keys = Object.keys(data);
    keys.forEach(function (key) {
      defineReactive(data, key, data[key]); // 属性 key 的存储器描述定义
    });
  }

  observeArray(data) {
    data.forEach(function (item) {
      observe(item); // 数组项也要响应式
    });
  }
}
```
Observer 主要进行数据的响应式进行封装，对数组重写方法，数组的每一项也要封装为 Observer，对象的属性执行 `defineReactive` 进行设置 `set、get`方法。

其中有两个特殊的地方：
1. this.dep = new Dep();

    这个就有意思了，想必看过一些源码的人都知道，对于数组采用的是重写原型上的七个方法进行监听，但监听完后如何触发依赖呢？这里的 `this.dep` 就是数组方法被调用后，触发的依赖，这个依赖对象收集的 Watcher 会是数组这个 value 的 key 所收集的 Watcher，这可能很抽象，不是很好理解，大概就是这样：
    ```
    let a: {
        b: [1, 2]
    }
    ```
    这里的 b 属性自身内部会闭包一个 dep 依赖列表，当这个 dep 依赖列表需要增加 Watcher 的时候，就会通知 b 的 value 也就是 [1, 2] 这个 Observer 自身的 `this.dep` 也去收集当前的 Watcher，使得 b 和 [1, 2] 产生了神奇的关系纽带，具体的可以看下面的 `defineReactive` 实现。
    
2. augment(data, arrayMethods, arrayKeys)
    这个方法使用来给数组重新定义原型上的方法的，只不过做了兼容，如果没有 `__proto__` 属性的话，会定义在数组自身上。

```
function defineReactive(data, key, val) {
  const dep = new Dep(); // 闭包一个依赖对象

    ...

  let childOb = observe(val); // 对值内部的属性进行数据劫持，这里源码中会做一个 shallow 判断，是否一开始深层进行依赖

  Object.defineProperty(data, key, {
    get() {
      const value = getter ? getter.call(data) : val;
      if (Dep.target) {
        dep.depend(); // 收集依赖,包括 Watcher 收集 dep 和 dep 收集 Watcher
        if (childOb) {
          childOb.dep.depend();
          if (Array.isArray(value)) {
            // 如果是数组，对里面每一个响应对象本身的 this.dep 也进行依赖收集
            dependArray(value);
          }
        }
      }
      return value;
    },
    set(newVal) {
      const value = getter ? getter.call(newVal) : val;
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      if (setter) {
        setter.call(data, newVal)
      } else {
        val = newVal
      }
      observe(newVal);
      dep.notify(); // 触发依赖更新函数
    }
  })
}
```
`get` 会进行数据依赖收集，这里有一个比较有意思的是，`childOb.dep.depend()` 会对数组自身的 `this.dep` 进行依赖收集，上面说到 `childOb` 有可能返回 undefined，这时候数据 value 不是对象类型的就不会进入该条件了。

`set` 会触发依赖列表，并且还会对新设置的数据再次进行响应式数据封装，这里也有一个有意思的判断：`newVal !== newVal && value !== value`，这就很奇怪了，`newVal` 肯定等于 `newVal` 呀，怎么会这样判断呢？其实并不然，当 `newVal` 如果是 `NaN` 的时候，`newVal !== newVal` 就会变成 `true` 了，所以 Vue 在这里也做到了很细致的。

#### template 编译为 AST
Vue 的 Html 编写，写过 Vue 的都知道，它不像 react 那样，写一个 jsx，内部通过 `createElement` 进行生成 vNode，Vue 是通过编写 template 的方式来处理，说实在的就是一串类似 Html 结构的字符串。

在整个 Vue 的工作过程中，Vue 需要把我们编写的类似 Html 的字符串进行处理，最后生成 `render` 函数，以至于生成 vNode，那这个生成 `render` 之前的这个中间过程是什么呢？那就是 AST 树（Abstract Syntax Tree 抽象语法树）。

AST 树就是将 template 模板的类似 Html 的字符串转换成树形结构：

![image](https://note.youdao.com/yws/api/personal/file/WEBacf8d4be21ba2cabd728c2dc5e02cc2f?method=download&shareKey=80a7cb81d5521b1f5a78101d5032be39)

至于这里就有人找茬，为什么一定要把 template 变成树形结构呢？又为什么要出现 vNode 这样的树形结构，搞得数据转来转去，为什么就不能根据数据发生变化后直接 `el.innerHTML = template` 进行更新输出不就好了，其实大家心里都懂，只不过就还差点，请看 Vue 尤雨溪的答复：
> 如果没有 Virtual DOM，简单来想就是直接重置 innerHTML。
> 
> 很多人都没有意识到，在一个大型列表所有数据都变了的情况下，重置 innerHTML 其实是一个还算合理的操作... 
> 
> 真正的问题是在 “全部重新渲染” 的思维模式下，即使只有一行数据变了，它也需要重置整个 innerHTML，这时候显然就有大量的浪费。
> 
> 我们可以比较一下 innerHTML vs. Virtual DOM 的重绘性能消耗：
>
> 1. innerHTML: render html string O(template size) + 重新创建所有 DOM 元素 O(DOM size)
> 2. Virtual DOM: render Virtual DOM + diff O(template size) + 必要的 DOM 更新 O(DOM change)
 

> Virtual DOM render + diff 显然比渲染 html 字符串要慢，但是！它依然是纯 js 层面的计算，比起后面的 DOM 操作来说，依然便宜了太多。
>
> 可以看到，innerHTML 的总计算量不管是 js 计算还是 DOM 操作都是和整个界面的大小相关，但 Virtual DOM 的计算量里面，只有 js 计算和界面大小相关，DOM 操作是和数据的变动量相关的。前面说了，和 DOM 操作比起来，js 计算是极其便宜的。
>
> 这才是为什么要有 Virtual DOM：它保证了
>
> 1. 不管你的数据变化多少，每次重绘的性能都可以接受；
> 2. 你依然可以用类似 innerHTML 的思路去写你的应用。

接下来就来说说，Vue 是如何将 template 解析为 AST 树的，这里按照一个简单的 template 来分析：
```
<div id="app" style="color: red; font-size: 20px">
  我的姓名是：{{name}}，请多多关照~
  <h1 :class="name">{{ name }}</h1>
</div>
```
对 template 的解析流程整体上是一个不断正则匹配，然后删除匹配项，直到 template 字符串被删除完毕即生成 AST 树了。

```
 // html 就是上面例子的 template
 while (html) {
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
 }
```
`textEnd` 每次获取到开始节点的开始位置，如果 `<` 是在 0 的位置，那就是相当于上面匹配到了 `<div`，之后进入 `parseStartTag` 方法进行获取该 `div` 节点的信息，如下：
```
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
```
`start` 正则匹配到的是 `<div` 字符串，构建一个 `match` 节点对象，之后通过 `advance` 对字符串的删除，开始循环匹配标签属性，通过判断未到达 `>` 标识符，但是又能正则匹配到 `id="app"` 这类结构的字符串，就会把匹配结果 `push` 到 `match` 节点中，之后继续执行 `advance` 删除匹配项，不断循环此操作，直到匹配到结束符号 `>` 将 `match` 返回给前面的 `startTagMatch` 变量中，这样一个 `div` 的节点就解析出来了。

现在回到前面的代码块,会继续调用 `start(startTagMatch.tagName, startTagMatch.attrs);` 方法，该方法是对当前解析出来的 `startTagMatch` 入栈,通过栈的前进后出机制来识别子父级关系，执行完 `start` 后就执行 `continue` 跳过该轮循环，到此为止，template 变为了以下样子：

```
  我的姓名是：{{name}}，请多多关照~
  <h1 :class="name">{{ name }}</h1>
</div>
```
之后循环再次匹配 `<` 得到 `textEnd` 这时候 `textEnd` 大于 0，那是因为出现了 `我的姓名是：{{name}}，请多多关照~` 这部分内容，所以先对该部分内容进行处理，将它保存为文本节点，并进行 `push` 进当前的父级节点中的 `child` 数组中，当前的父节点就是之前的 `<div>` 节点：
```
if (textEnd > 0) {
  text = html.substring(0, textEnd);
}

if (text) {
  advance(text.length);
  chars(text);
}
```

进过该步骤后，template 就变成了如下样子：
```
  <h1 :class="name">{{ name }}</h1>
</div>
```
这之后继续匹配 `<` 开始标签，得到了 `textEnd` 等于 0，再次进入之前的步骤解析为节点入栈，这里就不进行赘述了，按照这样的循环，会匹配到结束标签：
```
const endTagMatch = html.match(endTag);

if (endTagMatch) {
    // 删除结束标签的字符
    advance(endTagMatch[0].length);
    // 遇到结束标签，进行父子管理处理
    end();
    continue;
}
```
这里的 `endTagMatch` 将会是 `</h1>` 或者是 `</div>`，比如现在匹配到了 `</h1>`，会执行 `end` 方法，该方法是对该节点的子父级关系进行绑定操作：
```
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
    // 解析指令
    closeElement(element);
}
```
`end` 方法通过栈的特性对节点整理父子关系，最后有一个方法 `closeElement` 对解析出来的 `element` 节点进行指令解析

```JavaScript
// 节点完结时，处理额外事物
function closeElement(element) {
    element = processElement(element);
}

function processElement(element) {
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
          addHandler(el, name, value, isDynamic);
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
```
`processAttrs` 将会对 AST 树的每个节点上 `attrs` 进行指令解析，比如: 
1. `bindRE: /^:|^v-bind:/` 用来解析动态属性
2. `onRE: /^@|^v-on:/` 用来解析事件属性

注意到还有一个 `isDynamic = dynamicArgRE.test(name);` 用来判断，每一个属性的 key 是否也为动态的，如果是则会被标记上动态标识。

这样经过以上的步骤进行解析，直到 template 被删除干净，跳出 `while(html)` 循环，即可生成上图中的 AST 树型结构的数据了。

到此为止 AST 解析就完毕了，AST 树的解析其实也没有很难的算法，就是一些正则的匹配，利用栈进行父子关系绑定，还有就是一些字符串循环的小技巧而已。

#### AST 构造 render 函数（包含处理动态属性、双花括号取值）

render 函数的产生离不开几个关键点：
- AST 树
- _c、_v、_s、_d 函数
- with 语法应用

首先还是看看一个例子:
```
<div id="app" style="color: red; font-size: 20px">
  我的姓名是：{{name}}，请多多关照~
  <h1 :class="name">{{ name }}</h1>
</div>
```
这个例子产生的 AST 树是如何的呢？
```
{
    type: 1,
    tag: 'div',
    attr: [
        { name: "id", value: "app" },
        { name: "style", value: { color: " red", " font-size": " 20px" } }
    ],
    children: [
        { type: 3, text: "我的姓名是: {{name}}, 请多多关照~" },
        { 
            tag: "h1", 
            type: 1,
            attr: [{ ":class", value: "name" }],
            children: [
                { type: 3, text: "{{ name }}" }
            ]
        }
    ]
}
```
这个例子最后产生的 render 函数是怎么样的呢？
```
_c("div", {id: "app",style: {"color":" red"," font-size":" 20px"}}, _v("我的姓名是："+_s(name)+"，请多多关照~"),_c("h1", _d({}, ["class", name]), _v(_s(name))))
```

从以上这三者的变化中可以观察到，AST 树仅仅是把 template 转化为树形结构的数据，

而在 AST 树转化成 render 函数的时候，会把指令、花括号、动态属性等等都会进行了处理，目的就是为了生成用于对应真实节点的虚拟节点，

因为真实节点和虚拟节点当然不能还存在 `v-bind`，`v-model` 吧，接下来就来了解一下，如何把 AST 转换为 render 函数的：

```
function generate(el) {
  const children = getChildren(el);

  const code = `_c(${JSON.stringify(el.tag)}, ${
    genData(el)
  }${children ? `, ${children}` : ''})`;

  return code;
}
```
首先 render 函数包含了 `_c`、`_v`、`_s` 等三种方法，分别是创建节点、创建文本、包裹双花括号，

`_c` 方法第一参数为节点 tag、第二个参数为节点属性 attr、后面的参数都是该节点的子字节，通过枚举平铺传入。

`generate` 函数先看子节点封装后面的代码，生成一个顶层 `_c`，第一个传 tag，第二个，调用 `genData` 进行解析获取 props 参数，最后传入已封装好的 children 传入。

上面使用到了一个 `genData` 方法，来看看 `genData` 做了什么事情：

```
function genData(el) {
  let data = '{';
  if (el.attrs) {
    data += `attrs:${genProps(el.attrs)},`;
  }
  if (el.events) {
    data += `${genHandlers(el.events, false)},`;
  }
  data = data.replace(/,$/, '') + '}';
  return data;
}

function genProps(attrs) {
  let attrStr = '';
  let dynamicAttrStr = '';
  let dynamic = false;

  attrs.forEach(item => {
    dynamic = item.dynamic;
    if (dynamic) {
      // className, name | "name"
      dynamicAttrStr += `${item.name.slice(1)}, ${item.value},`;
    } else {
      // "class": app | "app"
      attrStr += `${JSON.stringify(item.name)}: ${item.value},`;
    }
  });

  attrStr = `{${attrStr.slice(0, -1)}}`;

  if (dynamicAttrStr) {
    return `_d(${attrStr}, [${dynamicAttrStr.slice(0, -1)}])`;
  } else {
    return attrStr;
  }
}
```

其实也就是对节点的 attr 数组进行遍历解析成一个字符串，针对 style 属性的话，就在进行循环一层，只不过这里有一点较为有意思的是，对于动态属性的 name 和静态的属性 name 又不一样的处理

动态属性的 name 不会进行 JSON.stringify() 转成字符串，而是产生这样的结构：
`className, "value"`,这是因为这里的 `className` 并不是一个字符串，而是需要在 render 执行的时候获取到 vue 实例上的 data 属性的。

静态属性解析出来的是这样子的：`"id": "app",style: {"color":" red"," font-size":" 20px"},` 可以看到静态属性的 name 都是通过 `JSON.stringify(item.name)` 去包装的。

最后将产生的 `dynamicAttrStr` 和 `attrStr` 进行合并：
```
attrStr = `{${attrStr.slice(0, -1)}}`;

if (dynamicAttrStr) {
    return `_d(${attrStr}, [${dynamicAttrStr.slice(0, -1)}])`;
} else {
    return attrStr;
}
```
这里的会去除掉各自结尾多余的逗号，如果有动态属性，那就会用 _d 函数包一层，最终执行 render 函数的时候，就会把静态属性和动态属性合并，到此，attr 的解析就完成了，最终会返回类似
```
_d({"id": "xxx"}, [className, "name"])
```
这样的字符串，传入到 `_c` 函数的第二个参数中。

上面还有一个针对 `events` 处理的 `genHandlers`，其实和 `genProps` 差别不大，只不过最终事件放到 `on` 属性上，而节点属性是放到 attrs 属性上。

现在回到 generate 函数，再来看看如何解析节点的 children 的：
```
const children = getChildren(el);

function getChildren(el) {
  const children = el.children;

  if (children) {
    return children.map(c => generateChild(c)).join(',');
  }
}
```
这里得到的 children 要有一个大概的模子，它作为 `_c` 第三个参数传入并且子节点是按照枚举平铺开来传入的，所以它将会是这样的结构：

```
_v("我的姓名是："+_s(name)+"，请多多关照~"),_c("h1", _d({}, ["class", name]), _v(_s(name)))
```
每一个子节点单独解析然后按照逗号拼接的字符串，对于节点的处理就是递归 `generate` 方法，对文本节点就额外进行处理了，接下来看看 `generateChild` 函数如何处理：

```
function generateChild(node) {
  if (node.type === 1) {
    return generate(node);
  } else if (node.type === 3) {
    let text = node.text;

    if (!defaultTagRE.test(text)) {
      // 这里需要 JSON.stringify 在包一下，否者会出现 _v(hello) 解析的时候 hello 不就成了变量了
      return `_v(${JSON.stringify(text)})`;
    }

    let match,
      index, // 保存正则成功解析项的开始索引
      // defaultTagRE.lastIndex 会在正则解析的时候，一直处于匹配项末端的索引，下一轮匹配就从 defaultTagRE.lastIndex 开始
      lastIndex = (defaultTagRE.lastIndex = 0),
      textArr = [];

    while ((match = defaultTagRE.exec(text))) {
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

    // _v('我的姓名是：'+_s(name)+'，请多多关照~')
    return `_v(${textArr.join('+')})`;
  }
}
```
`generateChild` 方法中对 type 为 1 的节点直接递归 `generate` 方法，主要来看 type 为 3 的文本节点。

首先会对文本节点匹配正则 `defaultTagRE` 是否存在双花括号，如果不存在，那直接通过 `_v` 包裹即可了,如果文本中存在双花括号，就需要不断的循环字符串：

```
while ((match = defaultTagRE.exec(text))) {
  index = match.index; // 保存正则成功解析项的开始索引
  if (index > lastIndex) {
    textArr.push(JSON.stringify(text.slice(lastIndex, index)));
  }
  // 这里不需要 JSON.stringify 原因是，match[1] 指的就是 data 的属性
  textArr.push(`_s(${match[1].trim()})`);
  lastIndex = index + match[0].length;
}
```
匹配花括号内容，每次获取 `lastIndex` 到花括号起始位置的字符串 `push` 到 `textArr` 数组中，这一部分就是静态文本，之后在向 `textArr` 压入匹配到的双花括号内容 `_s(${match[1].trim()})`，这里的 `_s` 就是在 render 函数执行的时候判断一下取出来的数据是否为对象，如果是对象会使用 `JSON.stringify(value)` 输出,最后更新 `lastIndex` 值，赋值为当前双括号匹配的结束位置：`lastIndex = index + match[0].length;`。

按照这个逻辑下去，就可以得到这样的 `textArr` 数组：
```
['我的姓名是：', _s(name), '，请多多关照~']
```
这样就算解析完毕文本节点了，最后通过 `_v` 包装一下进行返回为：`_v('我的姓名是：'+_s(name)+'，请多多关照~')`。

看到这里通过 AST 树生产 render 函数来到最后阶段了：
```
var code = generate(ast);
```
这里的 code 就是：
```
_c("div", {id: "app",style: {"color":" red"," font-size":" 20px"}}, _v("我的姓名是："+_s(name)+"，请多多关照~"),_c("h1", _d({}, ["class", name]), _v(_s(name))))
```
但这个 code 其实还只是一个字符串而已，那要如何生成一个方法呢？这里应该要想到 `new Function()` 这个 API 了：
```
var render = new Function(`
    with(this){ return ${code}; }
  `);
```

这里你会发现，怎么多了一个 with 进行了包装，上面得到的 code ，你会发现里面有一些变量需要从 Vue 实例 data 属性中获取，比如：name 这个变量，那有没有发现，他没有 this.name 这样去拿，直接 name 要如何获取到 Vue 实例的 data 属性呢？

这里就要讲一下 with 了,看个例子：
```
var obj = {a: 1, b: 2};
with(obj) { console.log(a,b) }
// 输出：1 2
```
看到这里你会发现，只要通过 `with` 包裹，将 `obj` 传入，就会发现内部直接可以获取 `obj` 的属性了

上面的包装了 `with(this)` 这里的 this 在调用 render 方法的时候会绑定 `render.call(vm)` 方法，在通过 data 的属性已经代理到了 vm 实例上了，所以 render 函数一执行就能获取到相对应的属性值，并且通过 `_c`、`_v`、`_s`、`_d` 就能够生成虚拟节点 vnode 了。 

#### Watcher 的构建与监听（包含 render Watcher）

Watcher 监听者角色其实在 Vue 中有三类：
- render Watcher
- computed Watcher
- self Watcher（开发者自定义的 watcher）

本案例中只实现了 render Watcher 的监听，首先对于 Watcher 的历史发展来看看监听者这个角色发生了什么变化：

**Vue1**
 
 ![image](https://note.youdao.com/yws/api/personal/file/WEBf53b204be247dea901456d779e804956?method=download&shareKey=0d38773d8c9e8fcb26eb6fce0caffb3f)
  
 在早期的 Vue1 版本中，是没有 diff 算法的，每一个节点都有一个 Watcher 进行监听，Vue1 在 compile 阶段，就对 template 的节点进行遍历，每次遍历到新节点的时候就会 `new Watcher()` 监听者，并且如果节点使用到了 data 数据取值的时候，就会将这个 Watcher 监听者进行收集了，所以在 Vue1 版本会存在十分庞大的 Watcher 数量，使得性能出现了瓶颈，就如上图所示。
 
 **Vue2**
  
![image](https://note.youdao.com/yws/api/personal/file/WEB37e47848da2cc5083d90e48ab0c0f73f?method=download&shareKey=63bfa927bbef9dff39d93f8809ad5a84)

Vue2 可以看到，出现了了 diff 机制，当然是借鉴了 React 的做法，但是不同的是，React 的 diff 是项目整个树进行 diff，而 Vue2 做了一个折中的做法，在组件层面上采用的是 Watcher，在组件内部的节点才进行 diff 的比较，这也是 Vue2 做出的优化，因此本文说到的 render Watcher 就是在组件层面上的监听者了。

Vue3 大致的机制是一样的，只不过在 diff 的机制上增加了静态标识，事件做了事件缓存机制，diff 算法增加了最长递增子序列等优化项。

接下来看看 Vue2 的 render Watcher 是如果操作的，上面我们讲到从 template 变成 AST，再把 AST 变成 render 函数，这个 render 函数最终就会被进行包装放入到一个监听者中进行关联了。

```
Vue.prototype.$mount = function (el) {
    ...
    // 构建 AST -> Render
    const render = compileToRenderFunction(template);
    options.render = render;
    ...
    mountComponent(vm, el); // 挂载
}
```
```
function mountComponent(vm, el) {

  ...
    
  // 封装 render
  const updateComponent = () => {
    vm._update(vm._render())
  }

  // 创建一个 render Watcher，这里会执行 updateComponent 对响应式数据做依赖搜集
  vm._watcher = new Watcher(vm, updateComponent);

}
```
从上诉代码中可以看到，render 函数经过包装后，会传入到 Watcher 中，由 Watcher 来控制 render 方法的行为了。

Watcher 整体流程下来会做这几件事情：
1. Watcher 创建执行构造函数的时候，会定义 deps 存储所观察的可观察对象等属性
2. 执行 updateComponent 方法，触发 render 执行，生成 vnode，触发 data 依赖收集
3. 定义了 update 方法，可观察对象发生变化，触发观察者的 update 方法，进行一步更新
4. update 进行就是执行 render 产生新的 vnode 进行 diff 打补丁

接下来看看 Watcher 的类内部做了什么事情。

```
export default class Watcher {
  constructor(vm, expOrFn, options) {
    this.id = ++uid;
    this.deps = []; // 存储和当前 watcher 相关的响应式属性的 dep
    this.newDeps = []; // 新的 deps
    this.depIds = new Set();
    this.newDepIds = new Set();
    this.getter = expOrFn;
    
    // 初次执行
    this.value = this.get();
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
}
```
从代码中可以看到，Watcher 创建执行了构造函数，最终会执行 get 方法，执行 expOrFn 调用 updateComponent，这样就会执行 render 函数生成 vnode 触发依赖收集功能。

`pushTarget(this);` 将当前 watcher 放到 `Dep.target = _target;` 中，目的是为了执行 render 的时候，数据的依赖收集能找得到对应的 watcher 对象。

`popTarget()` 目的在于将压入栈的 watcher 弹出。

Watcher 创建后触发 render 函数生成，触发依赖收集过程，该过程如下：
```
Object.defineProperty(data, key, {
    enumerable: true,
    configurable: true,
    get() {
      const value = getter ? getter.call(data) : val;
      if (Dep.target) { dep.depend(); }
    }
}
```
触发每个 data 属性中闭包的 `dep.depend()` 收集监听者 watcher，但在收集的过程中会先让待收集的 Watcher 先收集即将要监听的 data 属性的依赖集合 dep 对象：

```
depend() {
  if (Dep.target) {
    Dep.target.addDep(this); // Watcher 对象中的 addDep，里面会调用   dep.addSub()
  }
}
```
这里的 `Dep.target` 保存着 Watcher 这里调用了 Watcher 的 `addDep()` 方法:

```
addDep(dep) {
    const id = dep.id;
    // 当前 Watcher 的新 depIds 不存在，就加入传进来的 dep
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
```
这里的操作就是 Watcher 和 Dep 互相收集保存了，目的是当某个属性在 render 的时候不在显示取值了，Watcher 检查到 newDepIds 没有了旧 newDeps 的某个 dep 收集的当前 Watcher 移除，发生变化不再通知监听者 Watcher。

到此为止，Watcher 和 Dep 的相互收集，互相依赖关系就差不多了，剩下的就是当 data 数据发生变化，通知 dep 列表的 Watcher 执行 `update` 方法会开启异步任务，这就是为什么 data 数据发生变化后，为什么没有更新 Dom，拿不到最新值:
```
 update() {
    queueWatcher(this);
}

function queueWatcher(watcher) {
    ...
    queue.push(watcher); // 压入队列
    ...
    // 开启异步任务，传入回调，这个回调就是执行 queue 中的所有 watcher，并且执行 watcher.run()
    nextTick(flushSchedulerQueue);
}

export const nextTick = function (flushSchedulerQueue) {
  const nextTickHandler = flushSchedulerQueue;
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
      port.postMessage(1);
    };
  } else if (typeof Promise !== 'undefined') {
    const p = Promise.resolve();
    timerFunc = () => {
      p.then(nextTickHandler);
    };
  } else {
    timerFunc = () => {
      setTimeout(nextTickHandler, 0);
    };
  }
  // 开启异步更新
  timerFunc();
};
```
到这里就完结了关于 Watcher 这个角色的工作流程。

#### render 函数生成 vnode

通过上面的讲解，到目前为止已经可以得到 AST 树、render 函数了，在 `new Watcher` 的时候就会调用 `render` 函数来生成 vnode。

那接下来就来看看 render 执行是如何生成 vnode 的，首先来看看前面所生成的 render 函数是什么样子的：
```
var render = new Function(`
    with(this){ return _c("div", {id: "app",style: {"color":" red"," font-size":" 20px"}}, _v("我的姓名是："+_s(name)+"，请多多关照~"),_c("h1", _d({}, ["class", name]), _v(_s(name)))); }
  `);
```
可以看到，render 函数执行无非就是执行了 `_c、_v、_s、_d` 函数，并且 `render` 函数采用了 `with` 语法，内部的方法和属性获取直接来自于 this Vue实例上，那表明这里的 `_c、_v、_s、_d` 函数是在 Vue 实例上存在的，为此最简单的想到就是在 Vue 实例的 prototype 上存在这些方法，下面就来看看这些方法都是些什么：
```
// vdom/index.js
function renderMixin(Vue) {
  Vue.prototype._c = function () {
    return createElementVNode(...arguments);
  };

  Vue.prototype._v = function () {
    return createTextVNode(...arguments);
  };

  Vue.prototype._s = function (value) {
    if (!value) return;
    return typeof value === 'object' ? JSON.stringify(value) : value;
  };

  Vue.prototype._d = function (baseObj, values) {
    for (let i = 0; i < values.length; i += 2) {
      const key = values[i];
      if (typeof key === 'string' && key) {
        baseObj[values[i]] = values[i + 1];
      }
    }
    return baseObj;
  };
}
```
通过 `renderMixin` 方法在 Vue 实例上绑定 `_c、_v、_s、_d` 函数，在执行这些方法的时候，即可创建出虚拟节点，首先来看看 `_c、_v`，该方法执行了 `createElementVNode`，`createTextVNode` 创建元素虚拟节点和文本虚拟节点
```
class VNode {
  constructor(tag, props, children, text) {
    this.tag = tag;
    this.props = props;
    this.children = children;
    this.text = text;
  }
}

function createElementVNode(tag, props = {}, ...children) {
  return new VNode(tag, props, children);
}

function createTextVNode(text) {
  return new VNode(undefined, undefined, undefined, text);
}
```
通过 new 一个 VNode 实例，生成相对应的元素节点和文本节点，`_c` 和 `_v` 就完成了。

接下来看看 `_s`，`_s` 就是为了处理双花括号的的情景，对进行展示的数据判断是否为对象，如果为对象则转换成 String 类型，`_s` 的 value 值不再是一个字符串，而是执行 render 的时候在通过 with 作用下直接获取到了 vm 代理后拿到 _data 的属性的值。

最后就是 `_d` 函数，这个函数只为了处理动态属性的，比如上面的：
```
<h1 :class="name">{{ name }}</h1>
```
就会解析为：
```
_d({}, ['class', name])
```
在执行 `render` 函数的时候，这里的 `name` 就能拿到 vm 代理后拿到 _data 的属性的值，随后将 class 属性放到和静态属性一起的对象 `baseObj` 中一起返回。

现在来看看上面的 `render` 函数执行后产生的 VNode 节点是怎么样的:
```
{
  children: [
    {
      children: undefined,
      props: undefined,
      tag: undefined,
      text: '我的姓名是：晓滨，请多多关照~',
    },
    {
      children: [
        {
          children: undefined,
          props: undefined,
          tag: undefined,
          text: '晓滨',
        },
      ],
      props: { attrs: { class: '晓滨' } },
      tag: 'h1',
      text: undefined,
    },
  ],
  props: {
    id: 'app',
    style: {
      color: ' red',
      'font-size': ' 20px',
    },
  },
  tag: 'div',
  text: undefined,
}
```
可以发现，虚拟节点和 AST 树其实长得还挺像的，只不过就是 AST 树只是将 `template` 进行结构化，而虚拟节点对结构化后的 AST 树进行了内容解析，最直观的就是 AST 树包含了 `{{ name }}`，虚拟节点就不存在这种东西了

#### 挂载(初次 Mount)

现在来到了 Vue 的整个工作流程初始化的最后一步了，那就是将虚拟节点渲染成真实节点挂载到 document 中。

```
const updateComponent = () => {
    vm._update(vm._render());
};

vm._watcher = new Watcher(vm, updateComponent);

Vue.prototype._update = function (vnode) {
    const vm = this;
    vm.$el = patch(vm.$el, vnode);
};
```
在 Watcher 章节，在 `new Watcher` 实例化的时候会执行 `updateComponent` 方法，再通过执行 `render` 函数生成虚拟节点传入到更新函数 `update` 中，之后就是挂载操作了，将 `vm.$el` 根节点传入，对虚拟节点转成真实节点挂载到根节点 `vm.$el` 上，下面来看看 `patch` 函数：

```
function patch(oldVnode, vnode) {
    // 首次挂载
    const nEl = createElement(vnode),
      parentElement = el.parentElement;

    // el.nextSibling 指的是 el 的兄弟节点
    parentElement.insertBefore(nEl, el.nextSibling);
    parentElement.removeChild(el);
    return nEl;
}
```
这里简单的看就是会调用 `createElement` 对虚拟节点进行递归创建真实节点，然后将生成好的真实节点更换掉根节点 `el` 内部的内容以此完成初始化时虚拟节点的挂载操作。

这里的 `patch` 的函数内部调用了 `createElement`，这里来简单看看该方法做了什么：
```
function createElement(vnode) {
  const { tag, props, children, text } = vnode;
  if (typeof tag === 'string') {
    vnode.el = document.createElement(tag);
    updateProps(vnode);
    children.forEach(function (child) {
      vnode.el.appendChild(createElement(child));
    });
  } else {
    vnode.el = document.createTextNode(text);
  }
  return vnode.el;
}
```
该方法就是负责创建真实节点，判断如果 `tag` 属性类型为字符串就使用 `document.createElement(tag);` 创建元素节点，否者就使用 `document.createTextNode(text);` 创建文本节点。

其中在创建元素节点的时候，会通过 `updateProps(vnode);` 查找 vnode 的 `props` 的不同类型的属性进行遍历设置到元素节点上，并且判断 vnode 的 children 对子节点进行遍历递归，以此完成 vnode 节点生成真实节点的逻辑。

到此为止，对于 Vue 完整的简易版初始化工作流程就结束了，相信认真看到这里的小伙伴们应该能够对 Vue 的工作原理有一定的认知了。下面讲解的就是 Vue 在数据发生变更后，对 Dom 的一个 Update 操作。

#### 事件 Methods 注册（涉及到多个位置）

Vue 的函数机制，是将 `methods` 上定义的方法，代理到 Vue 实例上：
```
Vue.prototype._init = function (options) {
    // ...
    initState(vm);
    // ...
}

function initState(vm) {
    if (options.data) {
        initData(vm);
    }
    // 处理函数
    if (options.methods) {
        initMethods(vm, options.methods);
    }
}
function initMethods(vm, methods) {
  for (const key in methods) {
    if (Object.hasOwnProperty.call(methods, key) && methods[key]) {
      vm[key] = bind(methods[key], vm);
    }
  }
}
function bind(fn, ctx) {
  function boundFn(argu) {
    const len = arguments.lengtrnoceh;
    return len
      ? len > 1
        ? fn.apply(ctx, arguments)
        : fn.call(ctx, argu)
      : fn.call(ctx);
  }
  boundFn._length = fn.length;
  return boundFn;
}
```
从上面的 `initMethods` 可以了解到，Vue 就是将 `methods` 属性中的所有方法代理到了 Vue 实例上了，其中使用了 `apply` 和 `call` 去绑定 this 作用，这其实倒没什么的，哈哈。

接下来，看看我们使用：
```
<button id="clickEvent" @click="onClickEvent">点击事件</button>
```
是如何做到，点击按钮的时候，触发 onClickEvent 时间，并且更改 data 属性的值：

首先我们先理一理思路：

1. 对于 Template 上的 `@click` 的指令，肯定需要经过 Templace -> Ast 的编辑解析
2. 然后对于 AST 树转换成 Render 函数，并且需要在 Render 函数执行的时候都要有节点绑定事件的信息（要知道的是，事件肯定是要绑定 rNode 真实节点上的, Render -> vNode -> rNode）
3. 执行 Render 函数，生成 vNode 虚拟节点，然后将 vNode 虚拟节点渲染为 rNode 真实节点的时候，将 vNode 节点上的事件信息绑定到当前的 rNode 真实节上，就大功告成了



接下来就从第一步来看：
```
function end() {
    // 出栈，出栈的就是当前匹配到的结束标签
    const element = stack.pop();
    // ...
    closeElement(element);
}
```
这个 `end` 函数上面也讲过了，是处理 AST 树转换的最后一步处理父子关系函数，在这函数的最后一步，调用 `closeElement` 解析指令，首先看看 element 是什么东东：

```
{
  tag: "button",
  type: 1,
  parent: "Parent",
  attrs: [
    {
      name: "id",
      value: "clickEvent",
    },
    {
      name: "@click",
      value: "onClickEvent"
    }
  ],
  children: [
    {type: 3, text: "点击事件"}
  ]
}
```
可以看到在处理之前,所有节点上的属性，都解析到 attrs 中，其中还包括 `@click`,接下来就进行 AST 树的指令解析：

```JavaScript
// 节点完结时，处理额外事物
function closeElement(element) {
    element = processElement(element);
}

function processElement(element) {
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
          addHandler(el, name, value, isDynamic);
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
```
`processAttrs` 将会对 AST 树的每个节点上 `attrs` 进行指令解析，比如: 
1. `bindRE: /^:|^v-bind:/` 用来解析动态属性
2. `onRE: /^@|^v-on:/` 用来解析事件属性

注意到还有一个 `isDynamic = dynamicArgRE.test(name);` 用来判断，每一个属性的 key 是否也为动态的，如果是则会被标记上动态标识。

处理后：
```
{
  tag: "button",
  type: 1,
  parent: "Parent",
  events: {
    click: {value: "onClickEvent", dynamic: false}
  },
  attrs: [
    {
      name: "id",
      value: "\"clickEvent\"",
      dynamic: false,
    }
  ],
  children: [
    {type: 3, text: "点击事件"}
  ]
}
```
通过以上处理得到的 events 属性就是最终的 AST 树真实事件的解析结果，接下来就进入第二步：
```
function generate(el) {
  const children = getChildren(el);

  const code = `_c(${JSON.stringify(el.tag)}, ${
    genData(el)
    // el.attrs.length > 0 ? formatProps(el.attrs) : 'undefined'
  }${children ? `, ${children}` : ''})`;

  return code;
}
function genData(el) {
  let data = '{';
  if (el.attrs) {
    data += `attrs:${genProps(el.attrs)},`;
  }
  if (el.events) {
    data += `${genHandlers(el.events, false)},`;
  }
  data = data.replace(/,$/, '') + '}';
  return data;
}
function genHandlers(events, isNative) {
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
```
以上就是将 AST 树转换成 render 函数的过程，针对于 events 字段会调用 `genHandlers` 对事件进行解析，最终和 `attrs` 一样，作为 `_c` 的第二个参数 `props` 的 `on` 属性传入，产生的 render 函数如下：
```
_c("button", {attrs:{"id": "clickEvent"},on:{"click":onClickEvent}}, _v("点击事件"))
```
最后第三步，就是进入 render 函数执行，生成虚拟节点 vnode 最后转换为真实节点 rnode，在通过 vnode 转换为 rnode 的时候，就会根据 vnode 的信息对 rnode 节点进行事件绑定：
```
function createElement(vnode) {
  const { tag, children, text } = vnode;
  if (typeof tag === 'string') {
    vnode.el = document.createElement(tag);
    updateProps(vnode);
    children.forEach(function (child) {
      vnode.el.appendChild(createElement(child));
    });
  } else {
    vnode.el = document.createTextNode(text);
  }
  return vnode.el;
}
```
创建真实节点的时候，就会调用 `updateProps(vnode);` 方法，处理 props 属性：
```
function updateProps(vnode) {
  const el = vnode.el,
    newProps = vnode.props || {};

  handleProps(el, newProps);
}
function handleProps(rnode, props) {
  handleAttrs(rnode, props.attrs);
  updateDOMListeners(rnode, props.on);
}
function updateDOMListeners(rnode, on) {
  function add(event, handler) {
    rnode.addEventListener(event, handler, false);
  }

  for (const name in on) {
    //遍历on,此时name就是对应的事件类型，比如:click
    const cur = on[name];
    if (Array.isArray(cur)) {
      for (const handler of cur) {
        add(name, handler);
      }
    } else {
      add(name, cur);
    }
  }
}
```
可以看到，这里的 `on[name]` 比如就是：`on['click']` 点击事件，这里可能会是一个数组，有多个点击事件，不过最后都是通调用 `add` 方法，使用 `addEventListener` 去绑定事件的，这样就完成完成了时间在真实节点上的绑定了


#### vnode 与 oldVnode 的 diff
diff 算法可以说也是 Vue 中主要的核心，这个步骤的触发时机就是在 data 数据发生变化之后，会进入到数据劫持的 set 方法，触发 `dep.notify();` 通知收集的依赖，也就是 render Watcher，并执行 watcher 监听者的 update 函数：
```
const updateComponent = () => {
    vm._update(vm._render());
};
```
重新调用 `render` 方法生成新的 虚拟节点，之后就会进行新旧虚拟节点的 diff 算法，找出补丁的逻辑，最后就是打补丁的操作。

这里要说明的是传统的两棵树的差异比较并且计算最小变更路劲的复杂度是需要 O(3)，但在 Vue 和 React 的 diff 算法中只有 O(1)，这是为什么呢，请看下图：

![image](https://note.youdao.com/yws/api/personal/file/WEB6c9e2aa1b27569c21e2faf62b0f5bc19?method=download&shareKey=00b83c308953a04d738439774df7f3af)

这里有两个树的对比，这其中包括了属性的变化，文本节点内容的变化，元素的删除等，在 Vue 的 diff 算法的比较中，有以下几点标准：

1. 采用深度优先策略，对两棵树都是从根节点按照深度优先策略进行查找和对比
2. 不做扩层级比较在水平方向上对比差异，因为对于 HTML 来说，元素节点扩层级的变化的量不会很大
3. 舍弃了计算节点的最小变更路劲，而是遇到节点元素 tagName 发生了变化，直接对该节点以及子节点重新创建替换

Vue 通过以上几点等一些列的策略变化，使得两棵树的 diff 比较控制在 O(1) 中，Vue 在 diff 比较上，根据 HTML 的特点，舍弃了传统的精准 diff 比较，按照实际出发，依据 HTML 的特点制定了 diff 策略来得到一个变更补丁，最后实现按需更新操作。

当然，Vue 除了以上几点外，还做了很多工作，比如：同一层级的 diff 比较、节点的缓存操作，以至于 Vue3 的静态标识、事件缓存等等，这里就不进行阐述了，该项目仅仅实现了较为简易版本的 Vue MiNi。

下面就来了根据上面的代码，解一下 diff 操作，可以看到在重新 `render` 后会执行 `update` 函数：

```
function lifecycleMixin(Vue) {
  Vue.prototype._update = function (vnode) {
    const vm = this,
      prevVnode = vm._vnode;

    // 保存当前 vnode
    vm._vnode = vnode;

    if (!prevVnode) {
      vm.$el = patch(vm.$el, vnode);
    } else {
      vm.$el = patch(prevVnode, vnode);
    }
  };
}
```
`update` 方法每次会把当前 vnode 保存在 vm 实例中，等下一次执行 `update` 的时候就会获取上一次的 vnode，传入到 `patch` 中进行 diff 操作：

```
function patch(oldVnode, vnode) {
    const isRealElement = isDef(oldVnode.nodeType),
    if (isRealElement) {
        ....
    } else {
        const patches = diff(oldVnode, vnode);
        if (Object.keys(patches).length) {
          doPatch(el, patches);
        }
        vnode.el = el;
        return el;
    }
}
```
首先在 patch 函数中会判断一下 oldVnode 是否为真实节点，可以看前面的初始化挂载章节，初始化的时候传入进来的 oldVnode 是真实节点，update 阶段oldVnode 是上一个虚拟节点，之后就进入 diff 函数进行比较产生补丁了：
```
function diff(oldVnode, vnode) {
  patches = {};
  vnIndex = 0;
  const index = 0; // 初始从零开始
  vNodeWalk(oldVnode, vnode, index);
  return patches;
}
```
这里开始进行 diff 算法之前会定义一个索引 vnIndex = 0，在进行深度优先遍历的时候，会给每一个节点进行索引标识，是为了后续打补丁所需的。

在接着讲解 vNodeWalk 方法之前，先来大概认识一下 vue diff 的补丁长什么样子的：
```
{
    1: [{
        text: "我的姓名是：Benson，请多多关照~"
        type: "TEXT"
    }],
    2: [{
        attrs: {class: "Benson"}
        type: "ATTR"
    }],
    3: [{
        type: REMOVE,
        index,
    }],
    4: [{
        type: REPLACE,
        vnode,
    }],
}
```
以上就是 diff 后所产生的的大概的补丁结构，从结构可以看出，`vNodeWalk` 方法就是在生成这样的结果
```
function vNodeWalk(oldVnode, vnode, index) {
  const vnPatch = [];

  if (!vnode) {
    vnPatch.push({
      type: REMOVE,
      index,
    });
  } else if (oldVnode.text && vnode.text) {
    if (oldVnode.text !== vnode.text) {
      vnPatch.push({
        type: TEXT,
        text: vnode.text,
      });
    }
  } else if (oldVnode.tag === vnode.tag) {
    const attrsPatch = attrsWalk(oldVnode.props, vnode.props);
    if (Object.keys(attrsPatch).length) {
      vnPatch.push({
        type: ATTR,
        attrs: attrsPatch,
      });
    }
    childrenWalk(oldVnode.children, vnode.children);
  } else {
    vnPatch.push({
      type: REPLACE,
      vnode,
    });
} 
```
从 `vNodeWalk` 和补丁的数据结构，相信都看得明白了，这里就不做过多的阐述了。接下来就是打补丁的操作了。


#### 打补丁 doPatch
在上一章节通过遍历虚拟节点对比新老节点产生一份补丁，接下来就是按照这份补丁对真实节点进行打补丁的操作，这里要说明的一点是，虚拟节点和真实节点在结构上是保持一致的。
```
const patches = diff(oldVnode, vnode);
if (Object.keys(patches).length) {
  // 开始打补丁
  doPatch(el, patches);
}

function doPatch(el, patches) {
  index = 0;
  finalPatches = patches;
  rnodeWalk(el);
}

function rnodeWalk(rnode) {
  const patch = finalPatches[index++],
    childNodes = rnode.childNodes;

  [...childNodes].map(c => rnodeWalk(c));

  if (patch) {
    patchAction(rnode, patch);
  }
}
```
在执行打补丁前，也先定义了一个索引 index，然后就对真实节点进行深度优先遍历，每次遍历的时候就让 index 加 1，这样就对应上每一个节点的索引，针对当前节点的索引去 patches 补丁中查找是否存在补丁，如果存在就执行 `patchAction` 方法进行打补丁，打补丁的操作就是根据`ATTR、TEXT、REMOVE、REPLACE` 去对 HTML 的元素节点进行操作，这个过程就是一个局部按需更新过程，请看下面的更新章节

#### 更新(Update Node)
更新操作就是执行了 `patchAction` 方法，针对不同类型的补丁进行更新：
```
function patchAction(rnode, patch) {
  for (const p of patch) {
    switch (p.type) {
      case ATTR:
        handleProps(rnode, p.attrs);
        break;
      case TEXT:
        rnode.textContent = p.text;
        break;
      case REMOVE:
        rnode.parentNode.removeChild(rnode);
        break;
      case REPLACE:
        rnode.parentNode.replaceChild(createElement(p.vnode), rnode);
        break;
      default:
        break;
    }
  }
}
```
比如: 
- `ATTR` 就是属性发生变化，对 rnode 进行属性变更，使用诸如：`rnode.setAttribute、rnode.className` 等操作
- `TEXT` 就是文本节点发生变化，使用：`rnode.textContent` 替换文本内容
- `REMOVE` 就是删除节点操作，使用: `rnode.parentNode.removeChild`
- `REPLACE` 就是节点替换，针对节点 `nodeType` 发生了变化，直接调用 `createElement` 方法对该节点的进行递归创建，包括整个子树，最后使用: ` rnode.parentNode.replaceChild` 进行替换

经过以上步骤就完成了 diff 到按需更新的一整个过程，看到这里对于 Vue 的整个工作原理应该有了一个清楚的概念了。

## 总结

Vue 的整个工作原理上其实深入了解后会发现还是比较亲民的，整个工作流程包括几点核心转换：

Template -> Ast -> Render -> VNode -> Diff -> RNode

每一个步骤虽然说都不会特别的困难，但其中使用上了很多小技巧，并且 Vue 在针对 HTML 的特殊性也有独立的 Diff 算法，这是特别值得学习的，对待事物不能死板，一定要学会变通，灵活使用才能发出最大的价值。

本文主要是为了学习 Vue 的整个工作原理，因此实现了整个简易版工作流程的 Vue，只是仅仅实现了简单的功能，在 Vue 源码中是肯定做了更多的事情的，但本项目仅仅是为了学习而建，对 Vue 源码感兴趣的小伙伴可以自己去查阅 Vue 源码学习更多优秀的内容~
