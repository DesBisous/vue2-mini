import 'core-js/modules/es6.object.get-own-property-names.js';
import 'core-js/modules/es6.object.keys.js';
import 'core-js/modules/es6.object.get-own-property-descriptor.js';
import 'core-js/modules/es6.array.slice.js';
import 'core-js/modules/es6.regexp.split.js';
import 'core-js/modules/es6.object.to-string.js';
import 'core-js/modules/es6.promise.js';
import 'core-js/modules/es6.regexp.constructor.js';
import 'core-js/modules/es6.regexp.match.js';
import 'core-js/modules/es6.function.name.js';
import 'core-js/modules/es6.array.map.js';
import 'core-js/modules/es6.set.js';
import 'core-js/modules/es6.string.iterator.js';
import 'core-js/modules/es6.array.iterator.js';
import 'core-js/modules/web.dom.iterable.js';
import 'core-js/modules/es6.symbol.js';
import 'core-js/modules/es6.array.from.js';

function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var classCallCheck = createCommonjsModule(function (module) {
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

module.exports = _classCallCheck;
module.exports["default"] = module.exports, module.exports.__esModule = true;
});

var _classCallCheck = unwrapExports(classCallCheck);

var createClass = createCommonjsModule(function (module) {
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

module.exports = _createClass;
module.exports["default"] = module.exports, module.exports.__esModule = true;
});

var _createClass = unwrapExports(createClass);

var _typeof_1 = createCommonjsModule(function (module) {
function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    module.exports = _typeof = function _typeof(obj) {
      return typeof obj;
    };

    module.exports["default"] = module.exports, module.exports.__esModule = true;
  } else {
    module.exports = _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };

    module.exports["default"] = module.exports, module.exports.__esModule = true;
  }

  return _typeof(obj);
}

module.exports = _typeof;
module.exports["default"] = module.exports, module.exports.__esModule = true;
});

var _typeof = unwrapExports(_typeof_1);

// can we use __proto__?
var hasProto = ('__proto__' in {}); // Browser environment sniffing

var inBrowser = typeof window !== 'undefined';
var UA = inBrowser && window.navigator.userAgent.toLowerCase();
UA && /msie|trident/.test(UA);
UA && UA.indexOf('msie 9.0') > 0;
var isEdge = UA && UA.indexOf('edge/') > 0;
UA && UA.indexOf('android') > 0;
UA && /iphone|ipad|ipod|ios/.test(UA);
UA && /chrome\/\d+/.test(UA) && !isEdge;
var nextTick = function nextTick(watcher) {
  var nextTickHandler = watcher.run.bind(watcher);
  var timerFunc; // 这里兼容集中异步 Api 处理

  if (typeof setImmediate !== 'undefined') {
    timerFunc = function timerFunc() {
      setImmediate(nextTickHandler);
    };
  } else if (typeof MessageChannel !== 'undefined') {
    var channel = new MessageChannel();
    var port = channel.port2;
    channel.port1.onmessage = nextTickHandler;

    timerFunc = function timerFunc() {
      port.postMessage(1);
    };
  } else if (typeof Promise !== 'undefined') {
    var p = Promise.resolve();

    timerFunc = function timerFunc() {
      p.then(nextTickHandler);
    };
  } else {
    timerFunc = function timerFunc() {
      setTimeout(nextTickHandler, 0);
    };
  } // 开启异步更新


  timerFunc();
};

function proxy(vm, target, key) {
  Object.defineProperty(vm, key, {
    get: function get() {
      return vm[target][key];
    },
    set: function set(newValue) {
      if (newValue === vm[target][key]) return;
      vm[target][key] = newValue;
    }
  });
}

function isObject(value) {
  return _typeof(value) === 'object' && value !== null;
}

function isArray(value) {
  return Array.isArray(value);
}

function def(data, key, value, enumerable) {
  Object.defineProperty(data, key, {
    configurable: true,
    enumerable: !!enumerable,
    writable: true,
    value: value
  });
}

function remove(arr, item) {
  if (arr.length) {
    var index = arr.indexOf(item);

    if (index > -1) {
      return arr.splice(index, 1);
    }
  }
}

var bailRE = /[^\w.$]/;

function parsePath(path) {
  if (bailRE.test(path)) {
    return;
  }

  var segments = path.split('.');
  return function (obj) {
    for (var i = 0; i < segments.length; i++) {
      if (!obj) return;
      obj = obj[segments[i]];
    }

    return obj;
  };
}

var uid$1 = 0;

var Dep = /*#__PURE__*/function () {
  function Dep() {
    _classCallCheck(this, Dep);

    this.id = uid$1++;
    this.subs = [];
  }

  _createClass(Dep, [{
    key: "addSub",
    value: function addSub(sub) {
      this.subs.push(sub);
    }
  }, {
    key: "removeSub",
    value: function removeSub(sub) {
      remove(this.subs, sub);
    }
  }, {
    key: "depend",
    value: function depend() {
      // 给当前 Watcher push 依赖，为了后续和 dep 的 subs 进行比较，移除掉无用的依赖，
      // 意思就是没用到的属性，在属性变更后就不要通知相对应的 Watcher 了
      if (Dep.target) {
        Dep.target.addDep(this); // Watcher 对象中的 addDep，里面会调用 dep.addSub()
      }
    }
  }, {
    key: "notify",
    value: function notify() {
      // stabilize the subscriber list first
      var subs = this.subs.slice(); // 浅拷贝

      for (var i = 0, l = subs.length; i < l; i++) {
        subs[i].update(); // 触发依赖更新函数
      }
    }
  }]);

  return Dep;
}();
Dep.target = null;
var targetStack = [];
function pushTarget(_target) {
  if (Dep.target) targetStack.push(Dep.target);
  Dep.target = _target;
}
function popTarget() {
  Dep.target = targetStack.pop();
}

var VNode = function VNode(tag, props, children, text) {
  _classCallCheck(this, VNode);

  this.tag = tag;
  this.props = props;
  this.children = children;
  this.text = text;
};

function createElementVNode(tag) {
  var attrs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    children[_key - 2] = arguments[_key];
  }

  return new VNode(tag, attrs, children);
}

function createTextVNode(text) {
  return new VNode(undefined, undefined, undefined, text);
}

var originArrMethods = Array.prototype,
    arrayMethods = Object.create(originArrMethods); // 创建一个对象， 并继承 Array.prototype

var ARR_METHODS = ['push', 'pop', 'shift', 'unshify', 'reverse', 'sort', 'splice'];
ARR_METHODS.forEach(function (method) {
  def(arrayMethods, method, function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var result = originArrMethods[method].apply(this, args),
        ob = this.__ob__;
    var newArr;

    switch (method) {
      case 'push':
      case 'unshift':
        newArr = args;
        break;

      case 'splice':
        newArr = args[2];
        break;
    } // 对数组新加入的元素进行数据劫持


    if (newArr) ob.observeArray(newArr); // notify change

    ob.dep.notify(); // 返回原函数执行结果

    return result;
  });
});

var arrayKeys = Object.getOwnPropertyNames(arrayMethods);

var Observer = /*#__PURE__*/function () {
  function Observer(data) {
    _classCallCheck(this, Observer);

    this.dep = new Dep();
    def(data, '__ob__', this);

    if (isArray(data)) {
      var augment = hasProto ? protoAugment : copyAugment;
      augment(data, arrayMethods, arrayKeys);
      this.observeArray(data);
    } else {
      this.walk(data);
    }
  }

  _createClass(Observer, [{
    key: "walk",
    value: function walk(data) {
      var keys = Object.keys(data);
      keys.forEach(function (key) {
        defineReactive(data, key, data[key]);
      });
    }
  }, {
    key: "observeArray",
    value: function observeArray(data) {
      data.forEach(function (item) {
        observe(item);
      });
    }
  }]);

  return Observer;
}();

function protoAugment(target, src, keys) {
  target.__proto__ = src;
}

function copyAugment(target, src, keys) {
  for (var i = 0, l = keys.length; i < l; i++) {
    var key = keys[i];
    def(target, key, src[key]);
  }
}

function defineReactive(data, key, val) {
  var dep = new Dep(); // 闭包一个依赖对象
  // 查找属性的描述器

  var property = Object.getOwnPropertyDescriptor(data, key);

  if (property && property.configurable === false) {
    return;
  } // 判断是否属性本身设置过存储器描述


  var getter = property && property.get;
  var setter = property && property.set;
  var childOb = observe(val); // 对值内部的属性进行数据劫持，这里源码中会做一个 shallow 判断，是否一开始深层进行依赖

  Object.defineProperty(data, key, {
    enumerable: true,
    configurable: true,
    get: function get() {
      var value = getter ? getter.call(data) : val;

      if (Dep.target) {
        dep.depend(); // 收集依赖,包括 Watcher 收集 dep 和 dep 收集 Watcher

        if (childOb) {
          /**
           * 子数据响应对象本身的 this.dep 也进行依赖收集
           * 这里其实对于数组方法重写的劫持触发更新，就是调用这里的 this.dep
           * {a: [1, 2]}
           * a 会闭包一个 dep 依赖，然后 value：[1, 2] 会构建出 ob 然后对 ob.dep 也会收集当前的依赖
           */
          childOb.dep.depend();

          if (Array.isArray(value)) {
            // 如果是数组，对里面每一个响应对象本身的 this.dep 也进行依赖收集
            dependArray(value);
          }
        }
      } // console.log('响应式获取：' + value);


      return value;
    },
    set: function set(newVal) {
      var value = getter ? getter.call(newVal) : val; // 这里的 newVal !== newVal && value !== value 为了避免 newVal 和 value 是一个 NaN，很严谨

      if (newVal === value || newVal !== newVal && value !== value) {
        return;
      } // console.log('响应式设置：' + key + ' = ' + newVal);


      if (setter) {
        setter.call(data, newVal);
      } else {
        val = newVal;
      }

      observe(newVal); // 对值内部的属性进行数据劫持，这里源码中会做一个 shallow 判断，是否一开始深层进行依赖

      dep.notify(); // 触发依赖更新函数
    }
  });
}

function dependArray(value) {
  for (var e, i = 0, l = value.length; i < l; i++) {
    e = value[i];
    e && e.__ob__ && e.__ob__.dep.depend();

    if (Array.isArray(e)) {
      dependArray(e);
    }
  }
}

function observe(data) {
  if (!isObject(data) || data instanceof VNode) {
    return;
  }

  var ob;

  if (data.__ob__) {
    ob = data.__ob__;
  } else {
    ob = new Observer(data);
  }

  return ob;
}

function initState(vm) {
  vm._watchers = [];
  var options = vm.$options;

  if (options.props) ;

  if (options.methods) ;

  if (options.data) {
    initData(vm);
  }

  if (options.computed) ;

  if (options.watch) ;
}

function initData(vm) {
  var data = vm.$options.data;
  vm._data = data = typeof data === 'function' ? data.call(vm) : data;

  for (var key in data) {
    proxy(vm, '_data', key); // 代理数据
  }

  observe(data); // 创建响应式
}

// id="app" id='app' id=app
var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
var dynamicArgAttribute = /^\s*((?:v-[\w-]+:|@|:|#)\[[^=]+?\][^\s"'<>\/=]*)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; //标签名  <my-header></my-header>

var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z]*"; // <my:header></my:header>

var qnameCapture = "((?:".concat(ncname, "\\:)?").concat(ncname, ")"); // <div

var startTagOpen = new RegExp("^<".concat(qnameCapture)); // > />

var startTagClose = /^\s*(\/?)>/; // </div>

var endTag = new RegExp("^<\\/".concat(qnameCapture, "[^>]*>")); // 以上正则是从官方 Vue 源码扣的

function parseHtmlToAst(html) {
  var text,
      root,
      currentParent,
      stack = [];

  while (html) {
    // 查找 < 它包括例如： <div> </div>
    var textEnd = html.indexOf('<');

    if (textEnd === 0) {
      // 获取到标签组装好的结构对象
      var startTagMatch = parseStartTag(); // 对改标签进行子父层级处理

      if (startTagMatch) {
        start(startTagMatch.tagName, startTagMatch.attrs);
        continue;
      } // 获取标签结束 </div> 进行配置


      var endTagMatch = html.match(endTag);

      if (endTagMatch) {
        // 删除结束标签的字符
        advance(endTagMatch[0].length); // 遇到结束标签，进行父子管理处理

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

  function parseStartTag() {
    var start = html.match(startTagOpen);
    var end, attr;

    if (start) {
      // 保存标签名
      var match = {
        tagName: start[1],
        attrs: []
      }; // 删除匹配项

      advance(start[0].length); // 开始匹配标签属性

      while (!(end = html.match(startTagClose)) && (attr = html.match(dynamicArgAttribute) || html.match(attribute))) {
        match.attrs.push({
          name: attr[1],
          value: attr[3] || attr[4] || attr[5]
        });
        advance(attr[0].length);
      }

      if (end) {
        // 删除匹配项
        advance(end[0].length);
        return match;
      }
    }
  } // 对 html 删除匹配项长度父子


  function advance(len) {
    html = html.substring(len);
  } // 对开始标签进行父子关系处理


  function start(tagName, attrs) {
    var element = createASTElement(tagName, attrs);

    if (!root) {
      root = element;
    }

    stack.push(element);
    currentParent = element;
  } // 对结束标签进行父子关系处理


  function end() {
    // 出栈，出栈的就是当前匹配到的结束标签
    var element = stack.pop(); // 判断是否有父级

    if (stack.length > 0) {
      // 取出父级
      currentParent = stack[stack.length - 1]; // 处理父子关系

      element.parent = currentParent;
      currentParent.children.push(element);
    }
  }

  function chars(text) {
    text = text.trim();

    if (text.length > 0) {
      currentParent.children.push({
        type: 3,
        text: text
      });
    }
  } // 组装 AST 标签对象结构


  function createASTElement(tagName, attrs) {
    return {
      tag: tagName,
      type: 1,
      children: [],
      attrs: attrs,
      parent: Window
    };
  }

  return root;
}

var arrayWithHoles = createCommonjsModule(function (module) {
function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

module.exports = _arrayWithHoles;
module.exports["default"] = module.exports, module.exports.__esModule = true;
});

unwrapExports(arrayWithHoles);

var iterableToArrayLimit = createCommonjsModule(function (module) {
function _iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

module.exports = _iterableToArrayLimit;
module.exports["default"] = module.exports, module.exports.__esModule = true;
});

unwrapExports(iterableToArrayLimit);

var arrayLikeToArray = createCommonjsModule(function (module) {
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

  return arr2;
}

module.exports = _arrayLikeToArray;
module.exports["default"] = module.exports, module.exports.__esModule = true;
});

unwrapExports(arrayLikeToArray);

var unsupportedIterableToArray = createCommonjsModule(function (module) {
function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return arrayLikeToArray(o, minLen);
}

module.exports = _unsupportedIterableToArray;
module.exports["default"] = module.exports, module.exports.__esModule = true;
});

unwrapExports(unsupportedIterableToArray);

var nonIterableRest = createCommonjsModule(function (module) {
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

module.exports = _nonIterableRest;
module.exports["default"] = module.exports, module.exports.__esModule = true;
});

unwrapExports(nonIterableRest);

var slicedToArray = createCommonjsModule(function (module) {
function _slicedToArray(arr, i) {
  return arrayWithHoles(arr) || iterableToArrayLimit(arr, i) || unsupportedIterableToArray(arr, i) || nonIterableRest();
}

module.exports = _slicedToArray;
module.exports["default"] = module.exports, module.exports.__esModule = true;
});

var _slicedToArray = unwrapExports(slicedToArray);

// 判断是否为 {{  }} 这种文本
var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;
var dynamicAttrRE = /^:.+$/; // 源码的方法名为：genProps，位置：vue/src/compiler/codegen/index.js

function formatProps(attrs) {
  var attrStr = '';
  var dynamicAttrStr = '';
  var dynamic = false;
  attrs.forEach(function (item) {
    dynamic = dynamicAttrRE.test(item.name);

    if (item.name === 'style') {
      var styleAttrs = {};
      item.value.split(';').forEach(function (subItem) {
        var _subItem$split = subItem.split(':'),
            _subItem$split2 = _slicedToArray(_subItem$split, 2),
            key = _subItem$split2[0],
            value = _subItem$split2[1];

        styleAttrs[key] = value;
      });
      item.value = styleAttrs;
    }

    if (dynamic) {
      dynamicAttrStr += "\"".concat(item.name.slice(1), "\", ").concat(item.value, ",");
    } else {
      attrStr += "".concat(item.name, ": ").concat(JSON.stringify(item.value), ",");
    }
  });
  attrStr = "{".concat(attrStr.slice(0, -1), "}");

  if (dynamicAttrStr) {
    return "_d(".concat(attrStr, ", [").concat(dynamicAttrStr.slice(0, -1), "])");
  } else {
    return attrStr;
  }
}

function generateChild(node) {
  if (node.type === 1) {
    return generate(node);
  } else if (node.type === 3) {
    var text = node.text;

    if (!defaultTagRE.test(text)) {
      // 这里需要 JSON.stringify 在包一下，否者会出现 _v(hello) 解析的时候 hello 不就成了变量了
      return "_v(".concat(JSON.stringify(text), ")");
    }

    var match,
        index,
        // 保存正则成功解析项的开始索引
    // defaultTagRE.lastIndex 会在正则解析的时候，一直处于匹配项末端的索引，下一轮匹配就从 defaultTagRE.lastIndex 开始
    lastIndex = defaultTagRE.lastIndex = 0,
        textArr = [];

    while (match = defaultTagRE.exec(text)) {
      index = match.index; // 保存正则成功解析项的开始索引

      if (index > lastIndex) {
        textArr.push(JSON.stringify(text.slice(lastIndex, index)));
      } // 这里不需要 JSON.stringify 原因是，match[1] 指的就是 data 的属性


      textArr.push("_s(".concat(match[1].trim(), ")"));
      lastIndex = index + match[0].length;
    } // 正则匹配不到了，但是还剩下静态文本


    if (lastIndex < text.length) {
      textArr.push(JSON.stringify(text.slice(lastIndex)));
    } // _v('我的姓名是：'+{{name}}+'，请多多关照~')


    return "_v(".concat(textArr.join('+'), ")");
  }
}

function getChildren(el) {
  var children = el.children;

  if (children) {
    return children.map(function (c) {
      return generateChild(c);
    }).join(',');
  }
}

function generate(el) {
  var children = getChildren(el);
  var code = "_c(".concat(JSON.stringify(el.tag), ", ").concat(el.attrs.length > 0 ? formatProps(el.attrs) : 'undefined').concat(children ? ", ".concat(children) : '', ")");
  return code;
}

function compileToRenderFunction(html) {
  var ast = parseHtmlToAst(html),
      code = generate(ast),
      render = new Function("\n    with(this){ return ".concat(code, "; }\n  "));
  console.log('AST:', ast);
  console.log('render:', code);
  return render;
}

function queueWatcher(watcher) {
  nextTick(watcher);
}

var uid = 0;

var Watcher = /*#__PURE__*/function () {
  function Watcher(vm, expOrFn, options) {
    _classCallCheck(this, Watcher);

    this.vm = vm;

    vm._watchers.push(this); // options 源码中还有更多，比如：deep


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
        this.getter = function () {};

        process.env.NODE_ENV !== 'production' && console.warn("Failed watching path: \"".concat(expOrFn, "\" ") + 'Watcher only accepts simple dot-delimited paths. ' + 'For full control, use a function instead.');
      }
    } // 初次执行


    this.value = this.lazy ? undefined : this.get();
  }

  _createClass(Watcher, [{
    key: "get",
    value: function get() {
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
  }, {
    key: "addDep",
    value: function addDep(dep) {
      var id = dep.id; // 当前 Watcher 的新 depIds 不存在，这加入传进来的 dep

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

  }, {
    key: "cleanupDeps",
    value: function cleanupDeps() {
      // 源码有更多
      this.depIds = this.newDepIds;
      this.newDepIds.clear(); // 清除最新记录 depIds 集合

      this.deps = this.newDeps;
      this.newDeps.length = 0; // 清除最新记录 dep 集合
    }
  }, {
    key: "update",
    value: function update() {
      // 这里的话，源码中会有更多的判断
      // 一般来说更新的话，会进行异步更新，会涉及到 nextTick 函数
      // 最终会执行 run() 函数
      queueWatcher(this);
    }
  }, {
    key: "run",
    value: function run() {
      this.get();
    }
  }]);

  return Watcher;
}();

function isUndef(v) {
  return v === undefined || v === null;
}
function isDef(v) {
  return v !== undefined && v !== null;
}

var ATTR = 'ATTR';
var TEXT = 'TEXT';
var REPLACE = 'REPLACE';
var REMOVE = '';

var patches = {};
var vnIndex = 0;

function diff(oldVnode, vnode) {
  patches = {};
  vnIndex = 0;
  var index = 0; // 初始从零开始

  vNodeWalk(oldVnode, vnode, index);
  return patches;
}

function vNodeWalk(oldVnode, vnode, index) {
  var vnPatch = [];

  if (!vnode) {
    // 新 vnode 被删除了
    vnPatch.push({
      type: REMOVE,
      index: index
    });
  } else if (oldVnode.text && vnode.text) {
    if (oldVnode.text !== vnode.text) {
      vnPatch.push({
        type: TEXT,
        text: vnode.text
      });
    }
  } else if (oldVnode.tag === vnode.tag) {
    var attrsPatch = attrsWalk(oldVnode.props, vnode.props);

    if (Object.keys(attrsPatch).length) {
      vnPatch.push({
        type: ATTR,
        attrs: attrsPatch
      });
    }

    childrenWalk(oldVnode.children, vnode.children);
  } else {
    vnPatch.push({
      type: REPLACE,
      vnode: vnode
    });
  }

  if (vnPatch.length) {
    patches[index] = vnPatch;
  }
}

function attrsWalk(oldProps, newProps) {
  var attrsPatch = {};

  for (var key in oldProps) {
    if (JSON.stringify(oldProps[key]) !== JSON.stringify(newProps[key])) {
      // 旧有，新没，会压入 undefined
      // 旧有，新有，替换
      attrsPatch[key] = newProps[key];
    }
  }

  for (var _key in newProps) {
    if (!Object.hasOwnProperty.call(oldProps, _key)) {
      // 旧没，新有，新增
      attrsPatch[_key] = newProps[_key];
    }
  }

  return attrsPatch;
}

function childrenWalk(oldChildren, newChildren) {
  oldChildren.map(function (child, idx) {
    vNodeWalk(child, newChildren[idx], ++vnIndex);
  });
}

var arrayWithoutHoles = createCommonjsModule(function (module) {
function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return arrayLikeToArray(arr);
}

module.exports = _arrayWithoutHoles;
module.exports["default"] = module.exports, module.exports.__esModule = true;
});

unwrapExports(arrayWithoutHoles);

var iterableToArray = createCommonjsModule(function (module) {
function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
}

module.exports = _iterableToArray;
module.exports["default"] = module.exports, module.exports.__esModule = true;
});

unwrapExports(iterableToArray);

var nonIterableSpread = createCommonjsModule(function (module) {
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

module.exports = _nonIterableSpread;
module.exports["default"] = module.exports, module.exports.__esModule = true;
});

unwrapExports(nonIterableSpread);

var toConsumableArray = createCommonjsModule(function (module) {
function _toConsumableArray(arr) {
  return arrayWithoutHoles(arr) || iterableToArray(arr) || unsupportedIterableToArray(arr) || nonIterableSpread();
}

module.exports = _toConsumableArray;
module.exports["default"] = module.exports, module.exports.__esModule = true;
});

var _toConsumableArray = unwrapExports(toConsumableArray);

function _createForOfIteratorHelper$1(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray$1(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray$1(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$1(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$1(o, minLen); }

function _arrayLikeToArray$1(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function createElement(vnode) {
  var tag = vnode.tag;
      vnode.props;
      var children = vnode.children,
      text = vnode.text;

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

function updateProps(vnode) {
  var el = vnode.el,
      newProps = vnode.props || {};
  handleProps(el, newProps);
}

function handleProps(rnode, props) {
  for (var key in props) {
    if (Object.hasOwnProperty.call(props, key)) {
      if (!props[key]) {
        rnode.removeAttribute(key);
      } else if (key === 'style') {
        for (var sKey in props[key]) {
          if (Object.hasOwnProperty.call(props[key], sKey)) {
            rnode.style[sKey] = props[key][sKey];
          }
        }
      } else if (key === 'class') {
        rnode.className = props[key];
      } else if (key === 'value') {
        if (rnode.tagName === 'INPUT' || rnode.tagName === 'TEXTAREA') {
          rnode.value = props[key];
        } else {
          rnode.setAttribute(key, props[key]);
        }
      } else {
        rnode.setAttribute(key, props[key]);
      }
    }
  }
}

function removeElement(oldVnode) {
  // 判断 oldVnode 是否是真实节点
  var isRealElement = isDef(oldVnode.nodeType);
  var el = isRealElement ? oldVnode : oldVnode.el;
  var childNodes = el.childNodes;

  var _iterator = _createForOfIteratorHelper$1(childNodes),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var childNode = _step.value;
      removeNode(el, childNode);
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
}

function removeNode(parent, childNode) {
  parent.removeChild(childNode);
}

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
var index = 0;
var finalPatches = {};

function doPatch(el, patches) {
  index = 0;
  finalPatches = patches;
  console.log(finalPatches);
  rnodeWalk(el);
}

function rnodeWalk(rnode) {
  var patch = finalPatches[index++],
      childNodes = rnode.childNodes;

  _toConsumableArray(childNodes).map(function (c) {
    return rnodeWalk(c);
  });

  if (patch) {
    patchAction(rnode, patch);
  }
}

function patchAction(rnode, patch) {
  var _iterator = _createForOfIteratorHelper(patch),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var p = _step.value;

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
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
}

function patch(oldVnode, vnode) {
  // 判断新的 vnode 不存在
  if (isUndef(vnode)) {
    // 判断旧节点存在
    if (isDef(oldVnode)) {
      // Vue 源码这里会执行销毁的生命周期函数，直接删除旧节点内容
      removeElement(oldVnode);
    }

    return;
  } // 判断 oldVnode 是否是真实节点


  var isRealElement = isDef(oldVnode.nodeType),
      el = isRealElement ? oldVnode : oldVnode.el;

  if (isRealElement) {
    // 首次挂载
    var nEl = createElement(vnode),
        parentElement = el.parentElement; // el.nextSibling 指的是 el 的兄弟节点

    parentElement.insertBefore(nEl, el.nextSibling);
    parentElement.removeChild(el);
    return nEl;
  } else {
    // oldVnode 与 vnode diff 比较打补丁
    var patches = diff(oldVnode, vnode);

    if (Object.keys(patches).length) {
      // 开始打补丁
      doPatch(el, patches);
    }

    vnode.el = el;
    return el;
  }
}

function mountComponent(vm, el) {
  vm.$el = el; // 做一些环境判断

  if (!vm.$options.render) {
    if (process.env.NODE_ENV !== 'production') {
      if (vm.$options.template && vm.$options.template.charAt(0) !== '#' || vm.$options.el || el) {
        console.warn('You are using the runtime-only build of Vue where the template ' + 'compiler is not available. Either pre-compile the templates into ' + 'render functions, or use the compiler-included build.');
      } else {
        console.warn('Failed to mount component: template or render function not defined.');
      }
    }
  } // 这个方法在源码中声明时会根据 process.env.NODE_ENV !== 'production' 做一些额外处理


  var updateComponent = function updateComponent() {
    vm._update(vm._render());
  }; // 创建一个 render Watcher，这里会执行 updateComponent 对响应式数据做依赖搜集


  vm._watcher = new Watcher(vm, updateComponent);
}

function lifecycleMixin(Vue) {
  Vue.prototype._update = function (vnode) {
    var vm = this,
        prevVnode = vm._vnode; // 保存当前 vnode

    vm._vnode = vnode;

    if (!prevVnode) {
      vm.$el = patch(vm.$el, vnode);
    } else {
      vm.$el = patch(prevVnode, vnode);
    }
  };
}

function initMixin(Vue) {
  // 世界的开始
  Vue.prototype._init = function (options) {
    var vm = this;
    vm.$options = options; // 响应式劫持

    initState(vm);

    if (vm.$options.el) {
      // 挂载函数 Vue.prototype.$mount
      vm.$mount(vm.$options.el);
    }
  };

  Vue.prototype.$mount = function (el) {
    var vm = this,
        options = vm.$options;
    el = document.querySelector(el);

    if (!options.render) {
      var template = options.template;

      if (!template) {
        template = el.outerHTML;
      } // 构建 AST -> Render


      var render = compileToRenderFunction(template);
      options.render = render;
    } // console.log(options.render);


    mountComponent(vm, el);
  };
}

function renderMixin(Vue) {
  Vue.prototype._c = function () {
    return createElementVNode.apply(void 0, arguments);
  };

  Vue.prototype._v = function () {
    return createTextVNode.apply(void 0, arguments);
  };

  Vue.prototype._s = function (value) {
    if (!value) return; // 这里为什么直接获取 value 就行，
    // 因为这个 value 就是执行 render 的时候在通过 with 作用下直接获取到了 vm 代理后拿到 _data 的属性

    return _typeof(value) === 'object' ? JSON.stringify(value) : value;
  };

  Vue.prototype._d = function (baseObj, values) {
    for (var i = 0; i < values.length; i += 2) {
      var key = values[i];

      if (typeof key === 'string' && key) {
        baseObj[values[i]] = values[i + 1];
      }
    }

    return baseObj;
  };

  Vue.prototype._render = function () {
    var vm = this,
        render = vm.$options.render,
        vnode = render.call(vm); // 执行这个 render 的时候，会调用 _c、_v、_s 函数

    return vnode;
  };
}

function Vue(options) {
  this._init(options);
}

initMixin(Vue);
lifecycleMixin(Vue);
renderMixin(Vue);

export default Vue;
//# sourceMappingURL=index.esm.js.map
