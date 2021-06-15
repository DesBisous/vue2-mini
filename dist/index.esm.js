function unwrapExports(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default')
    ? x['default']
    : x;
}

function createCommonjsModule(fn, module) {
  return (module = { exports: {} }), fn(module, module.exports), module.exports;
}

var classCallCheck = createCommonjsModule(function (module) {
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError('Cannot call a class as a function');
    }
  }

  module.exports = _classCallCheck;
  (module.exports['default'] = module.exports),
    (module.exports.__esModule = true);
});

var _classCallCheck = unwrapExports(classCallCheck);

var createClass = createCommonjsModule(function (module) {
  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ('value' in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  module.exports = _createClass;
  (module.exports['default'] = module.exports),
    (module.exports.__esModule = true);
});

var _createClass = unwrapExports(createClass);

var _global = createCommonjsModule(function (module) {
  // https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
  var global = (module.exports =
    typeof window != 'undefined' && window.Math == Math
      ? window
      : typeof self != 'undefined' && self.Math == Math
      ? self
      : // eslint-disable-next-line no-new-func
        Function('return this')());
  if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef
});

var _core = createCommonjsModule(function (module) {
  var core = (module.exports = { version: '2.6.12' });
  if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef
});
_core.version;

var _isObject = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

var _anObject = function (it) {
  if (!_isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};

var _fails = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};

// Thank's IE8 for his funny defineProperty
var _descriptors = !_fails(function () {
  return (
    Object.defineProperty({}, 'a', {
      get: function () {
        return 7;
      },
    }).a != 7
  );
});

var document$2 = _global.document;
// typeof document.createElement is 'object' in old IE
var is = _isObject(document$2) && _isObject(document$2.createElement);
var _domCreate = function (it) {
  return is ? document$2.createElement(it) : {};
};

var _ie8DomDefine =
  !_descriptors &&
  !_fails(function () {
    return (
      Object.defineProperty(_domCreate('div'), 'a', {
        get: function () {
          return 7;
        },
      }).a != 7
    );
  });

// 7.1.1 ToPrimitive(input [, PreferredType])

// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
var _toPrimitive = function (it, S) {
  if (!_isObject(it)) return it;
  var fn, val;
  if (
    S &&
    typeof (fn = it.toString) == 'function' &&
    !_isObject((val = fn.call(it)))
  )
    return val;
  if (typeof (fn = it.valueOf) == 'function' && !_isObject((val = fn.call(it))))
    return val;
  if (
    !S &&
    typeof (fn = it.toString) == 'function' &&
    !_isObject((val = fn.call(it)))
  )
    return val;
  throw TypeError("Can't convert object to primitive value");
};

var dP$4 = Object.defineProperty;

var f$7 = _descriptors
  ? Object.defineProperty
  : function defineProperty(O, P, Attributes) {
      _anObject(O);
      P = _toPrimitive(P, true);
      _anObject(Attributes);
      if (_ie8DomDefine)
        try {
          return dP$4(O, P, Attributes);
        } catch (e) {
          /* empty */
        }
      if ('get' in Attributes || 'set' in Attributes)
        throw TypeError('Accessors not supported!');
      if ('value' in Attributes) O[P] = Attributes.value;
      return O;
    };

var _objectDp = {
  f: f$7,
};

var _propertyDesc = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value,
  };
};

var _hide = _descriptors
  ? function (object, key, value) {
      return _objectDp.f(object, key, _propertyDesc(1, value));
    }
  : function (object, key, value) {
      object[key] = value;
      return object;
    };

var hasOwnProperty = {}.hasOwnProperty;
var _has = function (it, key) {
  return hasOwnProperty.call(it, key);
};

var id = 0;
var px = Math.random();
var _uid = function (key) {
  return 'Symbol('.concat(
    key === undefined ? '' : key,
    ')_',
    (++id + px).toString(36)
  );
};

var _library = false;

var _shared = createCommonjsModule(function (module) {
  var SHARED = '__core-js_shared__';
  var store = _global[SHARED] || (_global[SHARED] = {});

  (module.exports = function (key, value) {
    return store[key] || (store[key] = value !== undefined ? value : {});
  })('versions', []).push({
    version: _core.version,
    mode: 'global',
    copyright: '© 2020 Denis Pushkarev (zloirock.ru)',
  });
});

var _functionToString = _shared('native-function-to-string', Function.toString);

var _redefine = createCommonjsModule(function (module) {
  var SRC = _uid('src');

  var TO_STRING = 'toString';
  var TPL = ('' + _functionToString).split(TO_STRING);

  _core.inspectSource = function (it) {
    return _functionToString.call(it);
  };

  (module.exports = function (O, key, val, safe) {
    var isFunction = typeof val == 'function';
    if (isFunction) _has(val, 'name') || _hide(val, 'name', key);
    if (O[key] === val) return;
    if (isFunction)
      _has(val, SRC) ||
        _hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
    if (O === _global) {
      O[key] = val;
    } else if (!safe) {
      delete O[key];
      _hide(O, key, val);
    } else if (O[key]) {
      O[key] = val;
    } else {
      _hide(O, key, val);
    }
    // add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
  })(Function.prototype, TO_STRING, function toString() {
    return (
      (typeof this == 'function' && this[SRC]) || _functionToString.call(this)
    );
  });
});

var _aFunction = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};

// optional / simple context binding

var _ctx = function (fn, that, length) {
  _aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1:
      return function (a) {
        return fn.call(that, a);
      };
    case 2:
      return function (a, b) {
        return fn.call(that, a, b);
      };
    case 3:
      return function (a, b, c) {
        return fn.call(that, a, b, c);
      };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};

var PROTOTYPE$2 = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var target = IS_GLOBAL
    ? _global
    : IS_STATIC
    ? _global[name] || (_global[name] = {})
    : (_global[name] || {})[PROTOTYPE$2];
  var exports = IS_GLOBAL ? _core : _core[name] || (_core[name] = {});
  var expProto = exports[PROTOTYPE$2] || (exports[PROTOTYPE$2] = {});
  var key, own, out, exp;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    // export native or passed
    out = (own ? target : source)[key];
    // bind timers to global for call from export context
    exp =
      IS_BIND && own
        ? _ctx(out, _global)
        : IS_PROTO && typeof out == 'function'
        ? _ctx(Function.call, out)
        : out;
    // extend global
    if (target) _redefine(target, key, out, type & $export.U);
    // export
    if (exports[key] != out) _hide(exports, key, exp);
    if (IS_PROTO && expProto[key] != out) expProto[key] = out;
  }
};
_global.core = _core;
// type bitmap
$export.F = 1; // forced
$export.G = 2; // global
$export.S = 4; // static
$export.P = 8; // proto
$export.B = 16; // bind
$export.W = 32; // wrap
$export.U = 64; // safe
$export.R = 128; // real proto method for `library`
var _export = $export;

// most Object methods by ES6 should accept primitives

var _objectSap = function (KEY, exec) {
  var fn = (_core.Object || {})[KEY] || Object[KEY];
  var exp = {};
  exp[KEY] = exec(fn);
  _export(
    _export.S +
      _export.F *
        _fails(function () {
          fn(1);
        }),
    'Object',
    exp
  );
};

var toString$1 = {}.toString;

var _cof = function (it) {
  return toString$1.call(it).slice(8, -1);
};

// fallback for non-array-like ES3 and non-enumerable old V8 strings

// eslint-disable-next-line no-prototype-builtins
var _iobject = Object('z').propertyIsEnumerable(0)
  ? Object
  : function (it) {
      return _cof(it) == 'String' ? it.split('') : Object(it);
    };

// 7.2.1 RequireObjectCoercible(argument)
var _defined = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};

// to indexed object, toObject with fallback for non-array-like ES3 strings

var _toIobject = function (it) {
  return _iobject(_defined(it));
};

// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor$1 = Math.floor;
var _toInteger = function (it) {
  return isNaN((it = +it)) ? 0 : (it > 0 ? floor$1 : ceil)(it);
};

// 7.1.15 ToLength

var min$2 = Math.min;
var _toLength = function (it) {
  return it > 0 ? min$2(_toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};

var max$1 = Math.max;
var min$1 = Math.min;
var _toAbsoluteIndex = function (index, length) {
  index = _toInteger(index);
  return index < 0 ? max$1(index + length, 0) : min$1(index, length);
};

// false -> Array#indexOf
// true  -> Array#includes

var _arrayIncludes = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = _toIobject($this);
    var length = _toLength(O.length);
    var index = _toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el)
      while (length > index) {
        value = O[index++];
        // eslint-disable-next-line no-self-compare
        if (value != value) return true;
        // Array#indexOf ignores holes, Array#includes - not
      }
    else
      for (; length > index; index++)
        if (IS_INCLUDES || index in O) {
          if (O[index] === el) return IS_INCLUDES || index || 0;
        }
    return !IS_INCLUDES && -1;
  };
};

var shared = _shared('keys');

var _sharedKey = function (key) {
  return shared[key] || (shared[key] = _uid(key));
};

var arrayIndexOf = _arrayIncludes(false);
var IE_PROTO$2 = _sharedKey('IE_PROTO');

var _objectKeysInternal = function (object, names) {
  var O = _toIobject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO$2) _has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i)
    if (_has(O, (key = names[i++]))) {
      ~arrayIndexOf(result, key) || result.push(key);
    }
  return result;
};

// IE 8- don't enum bug keys
var _enumBugKeys =
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'.split(
    ','
  );

// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)

var hiddenKeys = _enumBugKeys.concat('length', 'prototype');

var f$6 =
  Object.getOwnPropertyNames ||
  function getOwnPropertyNames(O) {
    return _objectKeysInternal(O, hiddenKeys);
  };

var _objectGopn = {
  f: f$6,
};

// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window

var gOPN$2 = _objectGopn.f;
var toString = {}.toString;

var windowNames =
  typeof window == 'object' && window && Object.getOwnPropertyNames
    ? Object.getOwnPropertyNames(window)
    : [];

var getWindowNames = function (it) {
  try {
    return gOPN$2(it);
  } catch (e) {
    return windowNames.slice();
  }
};

var f$5 = function getOwnPropertyNames(it) {
  return windowNames && toString.call(it) == '[object Window]'
    ? getWindowNames(it)
    : gOPN$2(_toIobject(it));
};

var _objectGopnExt = {
  f: f$5,
};

// 19.1.2.7 Object.getOwnPropertyNames(O)
_objectSap('getOwnPropertyNames', function () {
  return _objectGopnExt.f;
});

// 7.1.13 ToObject(argument)

var _toObject = function (it) {
  return Object(_defined(it));
};

// 19.1.2.14 / 15.2.3.14 Object.keys(O)

var _objectKeys =
  Object.keys ||
  function keys(O) {
    return _objectKeysInternal(O, _enumBugKeys);
  };

// 19.1.2.14 Object.keys(O)

_objectSap('keys', function () {
  return function keys(it) {
    return _objectKeys(_toObject(it));
  };
});

var f$4 = {}.propertyIsEnumerable;

var _objectPie = {
  f: f$4,
};

var gOPD$1 = Object.getOwnPropertyDescriptor;

var f$3 = _descriptors
  ? gOPD$1
  : function getOwnPropertyDescriptor(O, P) {
      O = _toIobject(O);
      P = _toPrimitive(P, true);
      if (_ie8DomDefine)
        try {
          return gOPD$1(O, P);
        } catch (e) {
          /* empty */
        }
      if (_has(O, P)) return _propertyDesc(!_objectPie.f.call(O, P), O[P]);
    };

var _objectGopd = {
  f: f$3,
};

// 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)

var $getOwnPropertyDescriptor$1 = _objectGopd.f;

_objectSap('getOwnPropertyDescriptor', function () {
  return function getOwnPropertyDescriptor(it, key) {
    return $getOwnPropertyDescriptor$1(_toIobject(it), key);
  };
});

var document$1 = _global.document;
var _html = document$1 && document$1.documentElement;

var arraySlice = [].slice;

// fallback for not array-like ES3 strings and DOM objects
_export(
  _export.P +
    _export.F *
      _fails(function () {
        if (_html) arraySlice.call(_html);
      }),
  'Array',
  {
    slice: function slice(begin, end) {
      var len = _toLength(this.length);
      var klass = _cof(this);
      end = end === undefined ? len : end;
      if (klass == 'Array') return arraySlice.call(this, begin, end);
      var start = _toAbsoluteIndex(begin, len);
      var upTo = _toAbsoluteIndex(end, len);
      var size = _toLength(upTo - start);
      var cloned = new Array(size);
      var i = 0;
      for (; i < size; i++)
        cloned[i] =
          klass == 'String' ? this.charAt(start + i) : this[start + i];
      return cloned;
    },
  }
);

var _typeof_1 = createCommonjsModule(function (module) {
  function _typeof(obj) {
    '@babel/helpers - typeof';

    if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') {
      module.exports = _typeof = function _typeof(obj) {
        return typeof obj;
      };

      (module.exports['default'] = module.exports),
        (module.exports.__esModule = true);
    } else {
      module.exports = _typeof = function _typeof(obj) {
        return obj &&
          typeof Symbol === 'function' &&
          obj.constructor === Symbol &&
          obj !== Symbol.prototype
          ? 'symbol'
          : typeof obj;
      };

      (module.exports['default'] = module.exports),
        (module.exports.__esModule = true);
    }

    return _typeof(obj);
  }

  module.exports = _typeof;
  (module.exports['default'] = module.exports),
    (module.exports.__esModule = true);
});

var _typeof = unwrapExports(_typeof_1);

var _wks = createCommonjsModule(function (module) {
  var store = _shared('wks');

  var Symbol = _global.Symbol;
  var USE_SYMBOL = typeof Symbol == 'function';

  var $exports = (module.exports = function (name) {
    return (
      store[name] ||
      (store[name] =
        (USE_SYMBOL && Symbol[name]) ||
        (USE_SYMBOL ? Symbol : _uid)('Symbol.' + name))
    );
  });

  $exports.store = store;
});

// 7.2.8 IsRegExp(argument)

var MATCH = _wks('match');
var _isRegexp = function (it) {
  var isRegExp;
  return (
    _isObject(it) &&
    ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : _cof(it) == 'RegExp')
  );
};

// 7.3.20 SpeciesConstructor(O, defaultConstructor)

var SPECIES$3 = _wks('species');
var _speciesConstructor = function (O, D) {
  var C = _anObject(O).constructor;
  var S;
  return C === undefined || (S = _anObject(C)[SPECIES$3]) == undefined
    ? D
    : _aFunction(S);
};

// true  -> String#at
// false -> String#codePointAt
var _stringAt = function (TO_STRING) {
  return function (that, pos) {
    var s = String(_defined(that));
    var i = _toInteger(pos);
    var l = s.length;
    var a, b;
    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 ||
      a > 0xdbff ||
      i + 1 === l ||
      (b = s.charCodeAt(i + 1)) < 0xdc00 ||
      b > 0xdfff
      ? TO_STRING
        ? s.charAt(i)
        : a
      : TO_STRING
      ? s.slice(i, i + 2)
      : ((a - 0xd800) << 10) + (b - 0xdc00) + 0x10000;
  };
};

var at = _stringAt(true);

// `AdvanceStringIndex` abstract operation
// https://tc39.github.io/ecma262/#sec-advancestringindex
var _advanceStringIndex = function (S, index, unicode) {
  return index + (unicode ? at(S, index).length : 1);
};

// getting tag from 19.1.3.6 Object.prototype.toString()

var TAG$1 = _wks('toStringTag');
// ES3 wrong here
var ARG =
  _cof(
    (function () {
      return arguments;
    })()
  ) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (e) {
    /* empty */
  }
};

var _classof = function (it) {
  var O, T, B;
  return it === undefined
    ? 'Undefined'
    : it === null
    ? 'Null'
    : // @@toStringTag case
    typeof (T = tryGet((O = Object(it)), TAG$1)) == 'string'
    ? T
    : // builtinTag case
    ARG
    ? _cof(O)
    : // ES3 arguments fallback
    (B = _cof(O)) == 'Object' && typeof O.callee == 'function'
    ? 'Arguments'
    : B;
};

var builtinExec = RegExp.prototype.exec;

// `RegExpExec` abstract operation
// https://tc39.github.io/ecma262/#sec-regexpexec
var _regexpExecAbstract = function (R, S) {
  var exec = R.exec;
  if (typeof exec === 'function') {
    var result = exec.call(R, S);
    if (typeof result !== 'object') {
      throw new TypeError(
        'RegExp exec method returned something other than an Object or null'
      );
    }
    return result;
  }
  if (_classof(R) !== 'RegExp') {
    throw new TypeError('RegExp#exec called on incompatible receiver');
  }
  return builtinExec.call(R, S);
};

// 21.2.5.3 get RegExp.prototype.flags

var _flags = function () {
  var that = _anObject(this);
  var result = '';
  if (that.global) result += 'g';
  if (that.ignoreCase) result += 'i';
  if (that.multiline) result += 'm';
  if (that.unicode) result += 'u';
  if (that.sticky) result += 'y';
  return result;
};

var nativeExec = RegExp.prototype.exec;
// This always refers to the native implementation, because the
// String#replace polyfill uses ./fix-regexp-well-known-symbol-logic.js,
// which loads this file before patching the method.
var nativeReplace = String.prototype.replace;

var patchedExec = nativeExec;

var LAST_INDEX$1 = 'lastIndex';

var UPDATES_LAST_INDEX_WRONG = (function () {
  var re1 = /a/,
    re2 = /b*/g;
  nativeExec.call(re1, 'a');
  nativeExec.call(re2, 'a');
  return re1[LAST_INDEX$1] !== 0 || re2[LAST_INDEX$1] !== 0;
})();

// nonparticipating capturing group, copied from es5-shim's String#split patch.
var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;

var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED;

if (PATCH) {
  patchedExec = function exec(str) {
    var re = this;
    var lastIndex, reCopy, match, i;

    if (NPCG_INCLUDED) {
      reCopy = new RegExp('^' + re.source + '$(?!\\s)', _flags.call(re));
    }
    if (UPDATES_LAST_INDEX_WRONG) lastIndex = re[LAST_INDEX$1];

    match = nativeExec.call(re, str);

    if (UPDATES_LAST_INDEX_WRONG && match) {
      re[LAST_INDEX$1] = re.global ? match.index + match[0].length : lastIndex;
    }
    if (NPCG_INCLUDED && match && match.length > 1) {
      // Fix browsers whose `exec` methods don't consistently return `undefined`
      // for NPCG, like IE8. NOTE: This doesn' work for /(.?)?/
      // eslint-disable-next-line no-loop-func
      nativeReplace.call(match[0], reCopy, function () {
        for (i = 1; i < arguments.length - 2; i++) {
          if (arguments[i] === undefined) match[i] = undefined;
        }
      });
    }

    return match;
  };
}

var _regexpExec = patchedExec;

_export(
  {
    target: 'RegExp',
    proto: true,
    forced: _regexpExec !== /./.exec,
  },
  {
    exec: _regexpExec,
  }
);

var SPECIES$2 = _wks('species');

var REPLACE_SUPPORTS_NAMED_GROUPS = !_fails(function () {
  // #replace needs built-in support for named groups.
  // #match works fine because it just return the exec results, even if it has
  // a "grops" property.
  var re = /./;
  re.exec = function () {
    var result = [];
    result.groups = { a: '7' };
    return result;
  };
  return ''.replace(re, '$<a>') !== '7';
});

var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = (function () {
  // Chrome 51 has a buggy "split" implementation when RegExp#exec !== nativeExec
  var re = /(?:)/;
  var originalExec = re.exec;
  re.exec = function () {
    return originalExec.apply(this, arguments);
  };
  var result = 'ab'.split(re);
  return result.length === 2 && result[0] === 'a' && result[1] === 'b';
})();

var _fixReWks = function (KEY, length, exec) {
  var SYMBOL = _wks(KEY);

  var DELEGATES_TO_SYMBOL = !_fails(function () {
    // String methods call symbol-named RegEp methods
    var O = {};
    O[SYMBOL] = function () {
      return 7;
    };
    return ''[KEY](O) != 7;
  });

  var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL
    ? !_fails(function () {
        // Symbol-named RegExp methods call .exec
        var execCalled = false;
        var re = /a/;
        re.exec = function () {
          execCalled = true;
          return null;
        };
        if (KEY === 'split') {
          // RegExp[@@split] doesn't call the regex's exec method, but first creates
          // a new one. We need to return the patched regex when creating the new one.
          re.constructor = {};
          re.constructor[SPECIES$2] = function () {
            return re;
          };
        }
        re[SYMBOL]('');
        return !execCalled;
      })
    : undefined;

  if (
    !DELEGATES_TO_SYMBOL ||
    !DELEGATES_TO_EXEC ||
    (KEY === 'replace' && !REPLACE_SUPPORTS_NAMED_GROUPS) ||
    (KEY === 'split' && !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC)
  ) {
    var nativeRegExpMethod = /./[SYMBOL];
    var fns = exec(
      _defined,
      SYMBOL,
      ''[KEY],
      function maybeCallNative(
        nativeMethod,
        regexp,
        str,
        arg2,
        forceStringMethod
      ) {
        if (regexp.exec === _regexpExec) {
          if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
            // The native String method already delegates to @@method (this
            // polyfilled function), leasing to infinite recursion.
            // We avoid it by directly calling the native @@method method.
            return {
              done: true,
              value: nativeRegExpMethod.call(regexp, str, arg2),
            };
          }
          return { done: true, value: nativeMethod.call(str, regexp, arg2) };
        }
        return { done: false };
      }
    );
    var strfn = fns[0];
    var rxfn = fns[1];

    _redefine(String.prototype, KEY, strfn);
    _hide(
      RegExp.prototype,
      SYMBOL,
      length == 2
        ? // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
          // 21.2.5.11 RegExp.prototype[@@split](string, limit)
          function (string, arg) {
            return rxfn.call(string, this, arg);
          }
        : // 21.2.5.6 RegExp.prototype[@@match](string)
          // 21.2.5.9 RegExp.prototype[@@search](string)
          function (string) {
            return rxfn.call(string, this);
          }
    );
  }
};

var $min = Math.min;
var $push = [].push;
var $SPLIT = 'split';
var LENGTH = 'length';
var LAST_INDEX = 'lastIndex';
var MAX_UINT32 = 0xffffffff;

// babel-minify transpiles RegExp('x', 'y') -> /x/y and it causes SyntaxError
var SUPPORTS_Y = !_fails(function () {
  RegExp(MAX_UINT32, 'y');
});

// @@split logic
_fixReWks('split', 2, function (defined, SPLIT, $split, maybeCallNative) {
  var internalSplit;
  if (
    'abbc'[$SPLIT](/(b)*/)[1] == 'c' ||
    'test'[$SPLIT](/(?:)/, -1)[LENGTH] != 4 ||
    'ab'[$SPLIT](/(?:ab)*/)[LENGTH] != 2 ||
    '.'[$SPLIT](/(.?)(.?)/)[LENGTH] != 4 ||
    '.'[$SPLIT](/()()/)[LENGTH] > 1 ||
    ''[$SPLIT](/.?/)[LENGTH]
  ) {
    // based on es5-shim implementation, need to rework it
    internalSplit = function (separator, limit) {
      var string = String(this);
      if (separator === undefined && limit === 0) return [];
      // If `separator` is not a regex, use native split
      if (!_isRegexp(separator)) return $split.call(string, separator, limit);
      var output = [];
      var flags =
        (separator.ignoreCase ? 'i' : '') +
        (separator.multiline ? 'm' : '') +
        (separator.unicode ? 'u' : '') +
        (separator.sticky ? 'y' : '');
      var lastLastIndex = 0;
      var splitLimit = limit === undefined ? MAX_UINT32 : limit >>> 0;
      // Make `global` and avoid `lastIndex` issues by working with a copy
      var separatorCopy = new RegExp(separator.source, flags + 'g');
      var match, lastIndex, lastLength;
      while ((match = _regexpExec.call(separatorCopy, string))) {
        lastIndex = separatorCopy[LAST_INDEX];
        if (lastIndex > lastLastIndex) {
          output.push(string.slice(lastLastIndex, match.index));
          if (match[LENGTH] > 1 && match.index < string[LENGTH])
            $push.apply(output, match.slice(1));
          lastLength = match[0][LENGTH];
          lastLastIndex = lastIndex;
          if (output[LENGTH] >= splitLimit) break;
        }
        if (separatorCopy[LAST_INDEX] === match.index)
          separatorCopy[LAST_INDEX]++; // Avoid an infinite loop
      }
      if (lastLastIndex === string[LENGTH]) {
        if (lastLength || !separatorCopy.test('')) output.push('');
      } else output.push(string.slice(lastLastIndex));
      return output[LENGTH] > splitLimit ? output.slice(0, splitLimit) : output;
    };
    // Chakra, V8
  } else if ('0'[$SPLIT](undefined, 0)[LENGTH]) {
    internalSplit = function (separator, limit) {
      return separator === undefined && limit === 0
        ? []
        : $split.call(this, separator, limit);
    };
  } else {
    internalSplit = $split;
  }

  return [
    // `String.prototype.split` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.split
    function split(separator, limit) {
      var O = defined(this);
      var splitter = separator == undefined ? undefined : separator[SPLIT];
      return splitter !== undefined
        ? splitter.call(separator, O, limit)
        : internalSplit.call(String(O), separator, limit);
    },
    // `RegExp.prototype[@@split]` method
    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@split
    //
    // NOTE: This cannot be properly polyfilled in engines that don't support
    // the 'y' flag.
    function (regexp, limit) {
      var res = maybeCallNative(
        internalSplit,
        regexp,
        this,
        limit,
        internalSplit !== $split
      );
      if (res.done) return res.value;

      var rx = _anObject(regexp);
      var S = String(this);
      var C = _speciesConstructor(rx, RegExp);

      var unicodeMatching = rx.unicode;
      var flags =
        (rx.ignoreCase ? 'i' : '') +
        (rx.multiline ? 'm' : '') +
        (rx.unicode ? 'u' : '') +
        (SUPPORTS_Y ? 'y' : 'g');

      // ^(? + rx + ) is needed, in combination with some S slicing, to
      // simulate the 'y' flag.
      var splitter = new C(SUPPORTS_Y ? rx : '^(?:' + rx.source + ')', flags);
      var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
      if (lim === 0) return [];
      if (S.length === 0)
        return _regexpExecAbstract(splitter, S) === null ? [S] : [];
      var p = 0;
      var q = 0;
      var A = [];
      while (q < S.length) {
        splitter.lastIndex = SUPPORTS_Y ? q : 0;
        var z = _regexpExecAbstract(splitter, SUPPORTS_Y ? S : S.slice(q));
        var e;
        if (
          z === null ||
          (e = $min(
            _toLength(splitter.lastIndex + (SUPPORTS_Y ? 0 : q)),
            S.length
          )) === p
        ) {
          q = _advanceStringIndex(S, q, unicodeMatching);
        } else {
          A.push(S.slice(p, q));
          if (A.length === lim) return A;
          for (var i = 1; i <= z.length - 1; i++) {
            A.push(z[i]);
            if (A.length === lim) return A;
          }
          q = p = e;
        }
      }
      A.push(S.slice(p));
      return A;
    },
  ];
});

// 19.1.3.6 Object.prototype.toString()

var test = {};
test[_wks('toStringTag')] = 'z';
if (test + '' != '[object z]') {
  _redefine(
    Object.prototype,
    'toString',
    function toString() {
      return '[object ' + _classof(this) + ']';
    },
    true
  );
}

var _anInstance = function (it, Constructor, name, forbiddenField) {
  if (
    !(it instanceof Constructor) ||
    (forbiddenField !== undefined && forbiddenField in it)
  ) {
    throw TypeError(name + ': incorrect invocation!');
  }
  return it;
};

// call something on iterator step with safe closing on error

var _iterCall = function (iterator, fn, value, entries) {
  try {
    return entries ? fn(_anObject(value)[0], value[1]) : fn(value);
    // 7.4.6 IteratorClose(iterator, completion)
  } catch (e) {
    var ret = iterator['return'];
    if (ret !== undefined) _anObject(ret.call(iterator));
    throw e;
  }
};

var _iterators = {};

// check on default Array iterator

var ITERATOR$4 = _wks('iterator');
var ArrayProto$1 = Array.prototype;

var _isArrayIter = function (it) {
  return (
    it !== undefined &&
    (_iterators.Array === it || ArrayProto$1[ITERATOR$4] === it)
  );
};

var ITERATOR$3 = _wks('iterator');

var core_getIteratorMethod = (_core.getIteratorMethod = function (it) {
  if (it != undefined)
    return it[ITERATOR$3] || it['@@iterator'] || _iterators[_classof(it)];
});

var _forOf = createCommonjsModule(function (module) {
  var BREAK = {};
  var RETURN = {};
  var exports = (module.exports = function (
    iterable,
    entries,
    fn,
    that,
    ITERATOR
  ) {
    var iterFn = ITERATOR
      ? function () {
          return iterable;
        }
      : core_getIteratorMethod(iterable);
    var f = _ctx(fn, that, entries ? 2 : 1);
    var index = 0;
    var length, step, iterator, result;
    if (typeof iterFn != 'function')
      throw TypeError(iterable + ' is not iterable!');
    // fast case for arrays with default iterator
    if (_isArrayIter(iterFn))
      for (length = _toLength(iterable.length); length > index; index++) {
        result = entries
          ? f(_anObject((step = iterable[index]))[0], step[1])
          : f(iterable[index]);
        if (result === BREAK || result === RETURN) return result;
      }
    else
      for (iterator = iterFn.call(iterable); !(step = iterator.next()).done; ) {
        result = _iterCall(iterator, f, step.value, entries);
        if (result === BREAK || result === RETURN) return result;
      }
  });
  exports.BREAK = BREAK;
  exports.RETURN = RETURN;
});

// fast apply, http://jsperf.lnkit.com/fast-apply/5
var _invoke = function (fn, args, that) {
  var un = that === undefined;
  switch (args.length) {
    case 0:
      return un ? fn() : fn.call(that);
    case 1:
      return un ? fn(args[0]) : fn.call(that, args[0]);
    case 2:
      return un ? fn(args[0], args[1]) : fn.call(that, args[0], args[1]);
    case 3:
      return un
        ? fn(args[0], args[1], args[2])
        : fn.call(that, args[0], args[1], args[2]);
    case 4:
      return un
        ? fn(args[0], args[1], args[2], args[3])
        : fn.call(that, args[0], args[1], args[2], args[3]);
  }
  return fn.apply(that, args);
};

var process$3 = _global.process;
var setTask = _global.setImmediate;
var clearTask = _global.clearImmediate;
var MessageChannel$1 = _global.MessageChannel;
var Dispatch = _global.Dispatch;
var counter = 0;
var queue$1 = {};
var ONREADYSTATECHANGE = 'onreadystatechange';
var defer, channel, port;
var run = function () {
  var id = +this;
  // eslint-disable-next-line no-prototype-builtins
  if (queue$1.hasOwnProperty(id)) {
    var fn = queue$1[id];
    delete queue$1[id];
    fn();
  }
};
var listener = function (event) {
  run.call(event.data);
};
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if (!setTask || !clearTask) {
  setTask = function setImmediate(fn) {
    var args = [];
    var i = 1;
    while (arguments.length > i) args.push(arguments[i++]);
    queue$1[++counter] = function () {
      // eslint-disable-next-line no-new-func
      _invoke(typeof fn == 'function' ? fn : Function(fn), args);
    };
    defer(counter);
    return counter;
  };
  clearTask = function clearImmediate(id) {
    delete queue$1[id];
  };
  // Node.js 0.8-
  if (_cof(process$3) == 'process') {
    defer = function (id) {
      process$3.nextTick(_ctx(run, id, 1));
    };
    // Sphere (JS game engine) Dispatch API
  } else if (Dispatch && Dispatch.now) {
    defer = function (id) {
      Dispatch.now(_ctx(run, id, 1));
    };
    // Browsers with MessageChannel, includes WebWorkers
  } else if (MessageChannel$1) {
    channel = new MessageChannel$1();
    port = channel.port2;
    channel.port1.onmessage = listener;
    defer = _ctx(port.postMessage, port, 1);
    // Browsers with postMessage, skip WebWorkers
    // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if (
    _global.addEventListener &&
    typeof postMessage == 'function' &&
    !_global.importScripts
  ) {
    defer = function (id) {
      _global.postMessage(id + '', '*');
    };
    _global.addEventListener('message', listener, false);
    // IE8-
  } else if (ONREADYSTATECHANGE in _domCreate('script')) {
    defer = function (id) {
      _html.appendChild(_domCreate('script'))[ONREADYSTATECHANGE] =
        function () {
          _html.removeChild(this);
          run.call(id);
        };
    };
    // Rest old browsers
  } else {
    defer = function (id) {
      setTimeout(_ctx(run, id, 1), 0);
    };
  }
}
var _task = {
  set: setTask,
  clear: clearTask,
};

var macrotask = _task.set;
var Observer$1 = _global.MutationObserver || _global.WebKitMutationObserver;
var process$2 = _global.process;
var Promise$1 = _global.Promise;
var isNode$1 = _cof(process$2) == 'process';

var _microtask = function () {
  var head, last, notify;

  var flush = function () {
    var parent, fn;
    if (isNode$1 && (parent = process$2.domain)) parent.exit();
    while (head) {
      fn = head.fn;
      head = head.next;
      try {
        fn();
      } catch (e) {
        if (head) notify();
        else last = undefined;
        throw e;
      }
    }
    last = undefined;
    if (parent) parent.enter();
  };

  // Node.js
  if (isNode$1) {
    notify = function () {
      process$2.nextTick(flush);
    };
    // browsers with MutationObserver, except iOS Safari - https://github.com/zloirock/core-js/issues/339
  } else if (
    Observer$1 &&
    !(_global.navigator && _global.navigator.standalone)
  ) {
    var toggle = true;
    var node = document.createTextNode('');
    new Observer$1(flush).observe(node, { characterData: true }); // eslint-disable-line no-new
    notify = function () {
      node.data = toggle = !toggle;
    };
    // environments with maybe non-completely correct, but existent Promise
  } else if (Promise$1 && Promise$1.resolve) {
    // Promise.resolve without an argument throws an error in LG WebOS 2
    var promise = Promise$1.resolve(undefined);
    notify = function () {
      promise.then(flush);
    };
    // for other environments - macrotask based on:
    // - setImmediate
    // - MessageChannel
    // - window.postMessag
    // - onreadystatechange
    // - setTimeout
  } else {
    notify = function () {
      // strange IE + webpack dev server bug - use .call(global)
      macrotask.call(_global, flush);
    };
  }

  return function (fn) {
    var task = { fn: fn, next: undefined };
    if (last) last.next = task;
    if (!head) {
      head = task;
      notify();
    }
    last = task;
  };
};

// 25.4.1.5 NewPromiseCapability(C)

function PromiseCapability(C) {
  var resolve, reject;
  this.promise = new C(function ($$resolve, $$reject) {
    if (resolve !== undefined || reject !== undefined)
      throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject = $$reject;
  });
  this.resolve = _aFunction(resolve);
  this.reject = _aFunction(reject);
}

var f$2 = function (C) {
  return new PromiseCapability(C);
};

var _newPromiseCapability = {
  f: f$2,
};

var _perform = function (exec) {
  try {
    return { e: false, v: exec() };
  } catch (e) {
    return { e: true, v: e };
  }
};

var navigator = _global.navigator;

var _userAgent = (navigator && navigator.userAgent) || '';

var _promiseResolve = function (C, x) {
  _anObject(C);
  if (_isObject(x) && x.constructor === C) return x;
  var promiseCapability = _newPromiseCapability.f(C);
  var resolve = promiseCapability.resolve;
  resolve(x);
  return promiseCapability.promise;
};

var _redefineAll = function (target, src, safe) {
  for (var key in src) _redefine(target, key, src[key], safe);
  return target;
};

var def$1 = _objectDp.f;

var TAG = _wks('toStringTag');

var _setToStringTag = function (it, tag, stat) {
  if (it && !_has((it = stat ? it : it.prototype), TAG))
    def$1(it, TAG, { configurable: true, value: tag });
};

var SPECIES$1 = _wks('species');

var _setSpecies = function (KEY) {
  var C = _global[KEY];
  if (_descriptors && C && !C[SPECIES$1])
    _objectDp.f(C, SPECIES$1, {
      configurable: true,
      get: function () {
        return this;
      },
    });
};

var ITERATOR$2 = _wks('iterator');
var SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR$2]();
  riter['return'] = function () {
    SAFE_CLOSING = true;
  };
  // eslint-disable-next-line no-throw-literal
  Array.from(riter, function () {
    throw 2;
  });
} catch (e) {
  /* empty */
}

var _iterDetect = function (exec, skipClosing) {
  if (!skipClosing && !SAFE_CLOSING) return false;
  var safe = false;
  try {
    var arr = [7];
    var iter = arr[ITERATOR$2]();
    iter.next = function () {
      return { done: (safe = true) };
    };
    arr[ITERATOR$2] = function () {
      return iter;
    };
    exec(arr);
  } catch (e) {
    /* empty */
  }
  return safe;
};

var task = _task.set;
var microtask = _microtask();

var PROMISE = 'Promise';
var TypeError$1 = _global.TypeError;
var process$1 = _global.process;
var versions = process$1 && process$1.versions;
var v8 = (versions && versions.v8) || '';
var $Promise = _global[PROMISE];
var isNode = _classof(process$1) == 'process';
var empty = function () {
  /* empty */
};
var Internal, newGenericPromiseCapability, OwnPromiseCapability, Wrapper;
var newPromiseCapability = (newGenericPromiseCapability =
  _newPromiseCapability.f);

var USE_NATIVE$1 = !!(function () {
  try {
    // correct subclassing with @@species support
    var promise = $Promise.resolve(1);
    var FakePromise = ((promise.constructor = {})[_wks('species')] = function (
      exec
    ) {
      exec(empty, empty);
    });
    // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
    return (
      (isNode || typeof PromiseRejectionEvent == 'function') &&
      promise.then(empty) instanceof FakePromise &&
      // v8 6.6 (Node 10 and Chrome 66) have a bug with resolving custom thenables
      // https://bugs.chromium.org/p/chromium/issues/detail?id=830565
      // we can't detect it synchronously, so just check versions
      v8.indexOf('6.6') !== 0 &&
      _userAgent.indexOf('Chrome/66') === -1
    );
  } catch (e) {
    /* empty */
  }
})();

// helpers
var isThenable = function (it) {
  var then;
  return _isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};
var notify = function (promise, isReject) {
  if (promise._n) return;
  promise._n = true;
  var chain = promise._c;
  microtask(function () {
    var value = promise._v;
    var ok = promise._s == 1;
    var i = 0;
    var run = function (reaction) {
      var handler = ok ? reaction.ok : reaction.fail;
      var resolve = reaction.resolve;
      var reject = reaction.reject;
      var domain = reaction.domain;
      var result, then, exited;
      try {
        if (handler) {
          if (!ok) {
            if (promise._h == 2) onHandleUnhandled(promise);
            promise._h = 1;
          }
          if (handler === true) result = value;
          else {
            if (domain) domain.enter();
            result = handler(value); // may throw
            if (domain) {
              domain.exit();
              exited = true;
            }
          }
          if (result === reaction.promise) {
            reject(TypeError$1('Promise-chain cycle'));
          } else if ((then = isThenable(result))) {
            then.call(result, resolve, reject);
          } else resolve(result);
        } else reject(value);
      } catch (e) {
        if (domain && !exited) domain.exit();
        reject(e);
      }
    };
    while (chain.length > i) run(chain[i++]); // variable length - can't use forEach
    promise._c = [];
    promise._n = false;
    if (isReject && !promise._h) onUnhandled(promise);
  });
};
var onUnhandled = function (promise) {
  task.call(_global, function () {
    var value = promise._v;
    var unhandled = isUnhandled(promise);
    var result, handler, console;
    if (unhandled) {
      result = _perform(function () {
        if (isNode) {
          process$1.emit('unhandledRejection', value, promise);
        } else if ((handler = _global.onunhandledrejection)) {
          handler({ promise: promise, reason: value });
        } else if ((console = _global.console) && console.error) {
          console.error('Unhandled promise rejection', value);
        }
      });
      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
      promise._h = isNode || isUnhandled(promise) ? 2 : 1;
    }
    promise._a = undefined;
    if (unhandled && result.e) throw result.v;
  });
};
var isUnhandled = function (promise) {
  return promise._h !== 1 && (promise._a || promise._c).length === 0;
};
var onHandleUnhandled = function (promise) {
  task.call(_global, function () {
    var handler;
    if (isNode) {
      process$1.emit('rejectionHandled', promise);
    } else if ((handler = _global.onrejectionhandled)) {
      handler({ promise: promise, reason: promise._v });
    }
  });
};
var $reject = function (value) {
  var promise = this;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  promise._v = value;
  promise._s = 2;
  if (!promise._a) promise._a = promise._c.slice();
  notify(promise, true);
};
var $resolve = function (value) {
  var promise = this;
  var then;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  try {
    if (promise === value)
      throw TypeError$1("Promise can't be resolved itself");
    if ((then = isThenable(value))) {
      microtask(function () {
        var wrapper = { _w: promise, _d: false }; // wrap
        try {
          then.call(
            value,
            _ctx($resolve, wrapper, 1),
            _ctx($reject, wrapper, 1)
          );
        } catch (e) {
          $reject.call(wrapper, e);
        }
      });
    } else {
      promise._v = value;
      promise._s = 1;
      notify(promise, false);
    }
  } catch (e) {
    $reject.call({ _w: promise, _d: false }, e); // wrap
  }
};

// constructor polyfill
if (!USE_NATIVE$1) {
  // 25.4.3.1 Promise(executor)
  $Promise = function Promise(executor) {
    _anInstance(this, $Promise, PROMISE, '_h');
    _aFunction(executor);
    Internal.call(this);
    try {
      executor(_ctx($resolve, this, 1), _ctx($reject, this, 1));
    } catch (err) {
      $reject.call(this, err);
    }
  };
  // eslint-disable-next-line no-unused-vars
  Internal = function Promise(executor) {
    this._c = []; // <- awaiting reactions
    this._a = undefined; // <- checked in isUnhandled reactions
    this._s = 0; // <- state
    this._d = false; // <- done
    this._v = undefined; // <- value
    this._h = 0; // <- rejection state, 0 - default, 1 - handled, 2 - unhandled
    this._n = false; // <- notify
  };
  Internal.prototype = _redefineAll($Promise.prototype, {
    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
    then: function then(onFulfilled, onRejected) {
      var reaction = newPromiseCapability(_speciesConstructor(this, $Promise));
      reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail = typeof onRejected == 'function' && onRejected;
      reaction.domain = isNode ? process$1.domain : undefined;
      this._c.push(reaction);
      if (this._a) this._a.push(reaction);
      if (this._s) notify(this, false);
      return reaction.promise;
    },
    // 25.4.5.1 Promise.prototype.catch(onRejected)
    catch: function (onRejected) {
      return this.then(undefined, onRejected);
    },
  });
  OwnPromiseCapability = function () {
    var promise = new Internal();
    this.promise = promise;
    this.resolve = _ctx($resolve, promise, 1);
    this.reject = _ctx($reject, promise, 1);
  };
  _newPromiseCapability.f = newPromiseCapability = function (C) {
    return C === $Promise || C === Wrapper
      ? new OwnPromiseCapability(C)
      : newGenericPromiseCapability(C);
  };
}

_export(_export.G + _export.W + _export.F * !USE_NATIVE$1, {
  Promise: $Promise,
});
_setToStringTag($Promise, PROMISE);
_setSpecies(PROMISE);
Wrapper = _core[PROMISE];

// statics
_export(_export.S + _export.F * !USE_NATIVE$1, PROMISE, {
  // 25.4.4.5 Promise.reject(r)
  reject: function reject(r) {
    var capability = newPromiseCapability(this);
    var $$reject = capability.reject;
    $$reject(r);
    return capability.promise;
  },
});
_export(_export.S + _export.F * !USE_NATIVE$1, PROMISE, {
  // 25.4.4.6 Promise.resolve(x)
  resolve: function resolve(x) {
    return _promiseResolve(this, x);
  },
});
_export(
  _export.S +
    _export.F *
      !(
        USE_NATIVE$1 &&
        _iterDetect(function (iter) {
          $Promise.all(iter)['catch'](empty);
        })
      ),
  PROMISE,
  {
    // 25.4.4.1 Promise.all(iterable)
    all: function all(iterable) {
      var C = this;
      var capability = newPromiseCapability(C);
      var resolve = capability.resolve;
      var reject = capability.reject;
      var result = _perform(function () {
        var values = [];
        var index = 0;
        var remaining = 1;
        _forOf(iterable, false, function (promise) {
          var $index = index++;
          var alreadyCalled = false;
          values.push(undefined);
          remaining++;
          C.resolve(promise).then(function (value) {
            if (alreadyCalled) return;
            alreadyCalled = true;
            values[$index] = value;
            --remaining || resolve(values);
          }, reject);
        });
        --remaining || resolve(values);
      });
      if (result.e) reject(result.v);
      return capability.promise;
    },
    // 25.4.4.4 Promise.race(iterable)
    race: function race(iterable) {
      var C = this;
      var capability = newPromiseCapability(C);
      var reject = capability.reject;
      var result = _perform(function () {
        _forOf(iterable, false, function (promise) {
          C.resolve(promise).then(capability.resolve, reject);
        });
      });
      if (result.e) reject(result.v);
      return capability.promise;
    },
  }
);

// can we use __proto__?
var hasProto = '__proto__' in {}; // Browser environment sniffing

var inBrowser = typeof window !== 'undefined';
var UA = inBrowser && window.navigator.userAgent.toLowerCase();
UA && /msie|trident/.test(UA);
UA && UA.indexOf('msie 9.0') > 0;
var isEdge = UA && UA.indexOf('edge/') > 0;
UA && UA.indexOf('android') > 0;
UA && /iphone|ipad|ipod|ios/.test(UA);
UA && /chrome\/\d+/.test(UA) && !isEdge;
var nextTick = function nextTick(flushSchedulerQueue) {
  var nextTickHandler = flushSchedulerQueue;
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

function proxy$1(vm, target, key) {
  Object.defineProperty(vm, key, {
    get: function get() {
      return vm[target][key];
    },
    set: function set(newValue) {
      if (newValue === vm[target][key]) return;
      vm[target][key] = newValue;
    },
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
    value: value,
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

var Dep = /*#__PURE__*/ (function () {
  function Dep() {
    _classCallCheck(this, Dep);

    this.id = uid$1++;
    this.subs = [];
  }

  _createClass(Dep, [
    {
      key: 'addSub',
      value: function addSub(sub) {
        this.subs.push(sub);
      },
    },
    {
      key: 'removeSub',
      value: function removeSub(sub) {
        remove(this.subs, sub);
      },
    },
    {
      key: 'depend',
      value: function depend() {
        // 给当前 Watcher push 依赖，为了后续和 dep 的 subs 进行比较，移除掉无用的依赖，
        // 意思就是没用到的属性，在属性变更后就不要通知相对应的 Watcher 了
        if (Dep.target) {
          Dep.target.addDep(this); // Watcher 对象中的 addDep，里面会调用 dep.addSub()
        }
      },
    },
    {
      key: 'notify',
      value: function notify() {
        // stabilize the subscriber list first
        var subs = this.subs.slice(); // 浅拷贝

        for (var i = 0, l = subs.length; i < l; i++) {
          subs[i].update(); // 触发依赖更新函数
        }
      },
    },
  ]);

  return Dep;
})();
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
  var props =
    arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  for (
    var _len = arguments.length,
      children = new Array(_len > 2 ? _len - 2 : 0),
      _key = 2;
    _key < _len;
    _key++
  ) {
    children[_key - 2] = arguments[_key];
  }

  return new VNode(tag, props, children);
}

function createTextVNode(text) {
  return new VNode(undefined, undefined, undefined, text);
}

var originArrMethods = Array.prototype,
  arrayMethods = Object.create(originArrMethods); // 创建一个对象， 并继承 Array.prototype

var ARR_METHODS = [
  'push',
  'pop',
  'shift',
  'unshify',
  'reverse',
  'sort',
  'splice',
];
ARR_METHODS.forEach(function (method) {
  def(arrayMethods, method, function () {
    for (
      var _len = arguments.length, args = new Array(_len), _key = 0;
      _key < _len;
      _key++
    ) {
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

var Observer = /*#__PURE__*/ (function () {
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

  _createClass(Observer, [
    {
      key: 'walk',
      value: function walk(data) {
        var keys = Object.keys(data);
        keys.forEach(function (key) {
          defineReactive(data, key, data[key]);
        });
      },
    },
    {
      key: 'observeArray',
      value: function observeArray(data) {
        data.forEach(function (item) {
          observe(item);
        });
      },
    },
  ]);

  return Observer;
})();

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

      if (newVal === value || (newVal !== newVal && value !== value)) {
        return;
      } // console.log('响应式设置：' + key + ' = ' + newVal);

      if (setter) {
        setter.call(data, newVal);
      } else {
        val = newVal;
      }

      observe(newVal); // 对值内部的属性进行数据劫持，这里源码中会做一个 shallow 判断，是否一开始深层进行依赖

      dep.notify(); // 触发依赖更新函数
    },
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

  if (options.props);

  if (options.methods) {
    initMethods(vm, options.methods);
  }

  if (options.data) {
    initData(vm);
  }

  if (options.computed);

  if (options.watch);
}

function initMethods(vm, methods) {
  for (var key in methods) {
    if (Object.hasOwnProperty.call(methods, key) && methods[key]) {
      vm[key] = bind(methods[key], vm);
    }
  }
}

function initData(vm) {
  var data = vm.$options.data;
  vm._data = data = typeof data === 'function' ? data.call(vm) : data;

  for (var key in data) {
    proxy$1(vm, '_data', key); // 代理数据
  }

  observe(data); // 创建响应式
}

function bind(fn, ctx) {
  function boundFn(argu) {
    var len = arguments.length;
    return len
      ? len > 1
        ? fn.apply(ctx, arguments)
        : fn.call(ctx, argu)
      : fn.call(ctx);
  }

  boundFn._length = fn.length;
  return boundFn;
}

var arrayWithHoles = createCommonjsModule(function (module) {
  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  module.exports = _arrayWithHoles;
  (module.exports['default'] = module.exports),
    (module.exports.__esModule = true);
});

unwrapExports(arrayWithHoles);

var iterableToArrayLimit = createCommonjsModule(function (module) {
  function _iterableToArrayLimit(arr, i) {
    if (typeof Symbol === 'undefined' || !(Symbol.iterator in Object(arr)))
      return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (
        var _i = arr[Symbol.iterator](), _s;
        !(_n = (_s = _i.next()).done);
        _n = true
      ) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i['return'] != null) _i['return']();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  module.exports = _iterableToArrayLimit;
  (module.exports['default'] = module.exports),
    (module.exports.__esModule = true);
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
  (module.exports['default'] = module.exports),
    (module.exports.__esModule = true);
});

unwrapExports(arrayLikeToArray);

var unsupportedIterableToArray = createCommonjsModule(function (module) {
  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === 'string') return arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === 'Object' && o.constructor) n = o.constructor.name;
    if (n === 'Map' || n === 'Set') return Array.from(o);
    if (n === 'Arguments' || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
      return arrayLikeToArray(o, minLen);
  }

  module.exports = _unsupportedIterableToArray;
  (module.exports['default'] = module.exports),
    (module.exports.__esModule = true);
});

unwrapExports(unsupportedIterableToArray);

var nonIterableRest = createCommonjsModule(function (module) {
  function _nonIterableRest() {
    throw new TypeError(
      'Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.'
    );
  }

  module.exports = _nonIterableRest;
  (module.exports['default'] = module.exports),
    (module.exports.__esModule = true);
});

unwrapExports(nonIterableRest);

var slicedToArray = createCommonjsModule(function (module) {
  function _slicedToArray(arr, i) {
    return (
      arrayWithHoles(arr) ||
      iterableToArrayLimit(arr, i) ||
      unsupportedIterableToArray(arr, i) ||
      nonIterableRest()
    );
  }

  module.exports = _slicedToArray;
  (module.exports['default'] = module.exports),
    (module.exports.__esModule = true);
});

var _slicedToArray = unwrapExports(slicedToArray);

// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */

var check = function (O, proto) {
  _anObject(O);
  if (!_isObject(proto) && proto !== null)
    throw TypeError(proto + ": can't set as prototype!");
};
var _setProto = {
  set:
    Object.setPrototypeOf ||
    ('__proto__' in {} // eslint-disable-line
      ? (function (test, buggy, set) {
          try {
            set = _ctx(
              Function.call,
              _objectGopd.f(Object.prototype, '__proto__').set,
              2
            );
            set(test, []);
            buggy = !(test instanceof Array);
          } catch (e) {
            buggy = true;
          }
          return function setPrototypeOf(O, proto) {
            check(O, proto);
            if (buggy) O.__proto__ = proto;
            else set(O, proto);
            return O;
          };
        })({}, false)
      : undefined),
  check: check,
};

var setPrototypeOf = _setProto.set;
var _inheritIfRequired = function (that, target, C) {
  var S = target.constructor;
  var P;
  if (
    S !== C &&
    typeof S == 'function' &&
    (P = S.prototype) !== C.prototype &&
    _isObject(P) &&
    setPrototypeOf
  ) {
    setPrototypeOf(that, P);
  }
  return that;
};

var dP$3 = _objectDp.f;
var gOPN$1 = _objectGopn.f;

var $RegExp = _global.RegExp;
var Base = $RegExp;
var proto$1 = $RegExp.prototype;
var re1 = /a/g;
var re2 = /a/g;
// "new" creates a new object, old webkit buggy here
var CORRECT_NEW = new $RegExp(re1) !== re1;

if (
  _descriptors &&
  (!CORRECT_NEW ||
    _fails(function () {
      re2[_wks('match')] = false;
      // RegExp constructor can alter flags and IsRegExp works correct with @@match
      return (
        $RegExp(re1) != re1 ||
        $RegExp(re2) == re2 ||
        $RegExp(re1, 'i') != '/a/i'
      );
    }))
) {
  $RegExp = function RegExp(p, f) {
    var tiRE = this instanceof $RegExp;
    var piRE = _isRegexp(p);
    var fiU = f === undefined;
    return !tiRE && piRE && p.constructor === $RegExp && fiU
      ? p
      : _inheritIfRequired(
          CORRECT_NEW
            ? new Base(piRE && !fiU ? p.source : p, f)
            : Base(
                (piRE = p instanceof $RegExp) ? p.source : p,
                piRE && fiU ? _flags.call(p) : f
              ),
          tiRE ? this : proto$1,
          $RegExp
        );
  };
  var proxy = function (key) {
    key in $RegExp ||
      dP$3($RegExp, key, {
        configurable: true,
        get: function () {
          return Base[key];
        },
        set: function (it) {
          Base[key] = it;
        },
      });
  };
  for (var keys = gOPN$1(Base), i$1 = 0; keys.length > i$1; )
    proxy(keys[i$1++]);
  proto$1.constructor = $RegExp;
  $RegExp.prototype = proto$1;
  _redefine(_global, 'RegExp', $RegExp);
}

_setSpecies('RegExp');

// @@match logic
_fixReWks('match', 1, function (defined, MATCH, $match, maybeCallNative) {
  return [
    // `String.prototype.match` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.match
    function match(regexp) {
      var O = defined(this);
      var fn = regexp == undefined ? undefined : regexp[MATCH];
      return fn !== undefined
        ? fn.call(regexp, O)
        : new RegExp(regexp)[MATCH](String(O));
    },
    // `RegExp.prototype[@@match]` method
    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@match
    function (regexp) {
      var res = maybeCallNative($match, regexp, this);
      if (res.done) return res.value;
      var rx = _anObject(regexp);
      var S = String(this);
      if (!rx.global) return _regexpExecAbstract(rx, S);
      var fullUnicode = rx.unicode;
      rx.lastIndex = 0;
      var A = [];
      var n = 0;
      var result;
      while ((result = _regexpExecAbstract(rx, S)) !== null) {
        var matchStr = String(result[0]);
        A[n] = matchStr;
        if (matchStr === '')
          rx.lastIndex = _advanceStringIndex(
            S,
            _toLength(rx.lastIndex),
            fullUnicode
          );
        n++;
      }
      return n === 0 ? null : A;
    },
  ];
});

var dP$2 = _objectDp.f;
var FProto = Function.prototype;
var nameRE = /^\s*function ([^ (]*)/;
var NAME$1 = 'name';

// 19.2.4.2 name
NAME$1 in FProto ||
  (_descriptors &&
    dP$2(FProto, NAME$1, {
      configurable: true,
      get: function () {
        try {
          return ('' + this).match(nameRE)[1];
        } catch (e) {
          return '';
        }
      },
    }));

var max = Math.max;
var min = Math.min;
var floor = Math.floor;
var SUBSTITUTION_SYMBOLS = /\$([$&`']|\d\d?|<[^>]*>)/g;
var SUBSTITUTION_SYMBOLS_NO_NAMED = /\$([$&`']|\d\d?)/g;

var maybeToString = function (it) {
  return it === undefined ? it : String(it);
};

// @@replace logic
_fixReWks('replace', 2, function (defined, REPLACE, $replace, maybeCallNative) {
  return [
    // `String.prototype.replace` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.replace
    function replace(searchValue, replaceValue) {
      var O = defined(this);
      var fn = searchValue == undefined ? undefined : searchValue[REPLACE];
      return fn !== undefined
        ? fn.call(searchValue, O, replaceValue)
        : $replace.call(String(O), searchValue, replaceValue);
    },
    // `RegExp.prototype[@@replace]` method
    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@replace
    function (regexp, replaceValue) {
      var res = maybeCallNative($replace, regexp, this, replaceValue);
      if (res.done) return res.value;

      var rx = _anObject(regexp);
      var S = String(this);
      var functionalReplace = typeof replaceValue === 'function';
      if (!functionalReplace) replaceValue = String(replaceValue);
      var global = rx.global;
      if (global) {
        var fullUnicode = rx.unicode;
        rx.lastIndex = 0;
      }
      var results = [];
      while (true) {
        var result = _regexpExecAbstract(rx, S);
        if (result === null) break;
        results.push(result);
        if (!global) break;
        var matchStr = String(result[0]);
        if (matchStr === '')
          rx.lastIndex = _advanceStringIndex(
            S,
            _toLength(rx.lastIndex),
            fullUnicode
          );
      }
      var accumulatedResult = '';
      var nextSourcePosition = 0;
      for (var i = 0; i < results.length; i++) {
        result = results[i];
        var matched = String(result[0]);
        var position = max(min(_toInteger(result.index), S.length), 0);
        var captures = [];
        // NOTE: This is equivalent to
        //   captures = result.slice(1).map(maybeToString)
        // but for some reason `nativeSlice.call(result, 1, result.length)` (called in
        // the slice polyfill when slicing native arrays) "doesn't work" in safari 9 and
        // causes a crash (https://pastebin.com/N21QzeQA) when trying to debug it.
        for (var j = 1; j < result.length; j++)
          captures.push(maybeToString(result[j]));
        var namedCaptures = result.groups;
        if (functionalReplace) {
          var replacerArgs = [matched].concat(captures, position, S);
          if (namedCaptures !== undefined) replacerArgs.push(namedCaptures);
          var replacement = String(replaceValue.apply(undefined, replacerArgs));
        } else {
          replacement = getSubstitution(
            matched,
            S,
            position,
            captures,
            namedCaptures,
            replaceValue
          );
        }
        if (position >= nextSourcePosition) {
          accumulatedResult +=
            S.slice(nextSourcePosition, position) + replacement;
          nextSourcePosition = position + matched.length;
        }
      }
      return accumulatedResult + S.slice(nextSourcePosition);
    },
  ];

  // https://tc39.github.io/ecma262/#sec-getsubstitution
  function getSubstitution(
    matched,
    str,
    position,
    captures,
    namedCaptures,
    replacement
  ) {
    var tailPos = position + matched.length;
    var m = captures.length;
    var symbols = SUBSTITUTION_SYMBOLS_NO_NAMED;
    if (namedCaptures !== undefined) {
      namedCaptures = _toObject(namedCaptures);
      symbols = SUBSTITUTION_SYMBOLS;
    }
    return $replace.call(replacement, symbols, function (match, ch) {
      var capture;
      switch (ch.charAt(0)) {
        case '$':
          return '$';
        case '&':
          return matched;
        case '`':
          return str.slice(0, position);
        case "'":
          return str.slice(tailPos);
        case '<':
          capture = namedCaptures[ch.slice(1, -1)];
          break;
        default:
          // \d\d?
          var n = +ch;
          if (n === 0) return match;
          if (n > m) {
            var f = floor(n / 10);
            if (f === 0) return match;
            if (f <= m)
              return captures[f - 1] === undefined
                ? ch.charAt(1)
                : captures[f - 1] + ch.charAt(1);
            return match;
          }
          capture = captures[n - 1];
      }
      return capture === undefined ? '' : capture;
    });
  }
});

function addAttr(el, name, value, dynamic) {
  el.attrs.push({
    name: name,
    value: value,
    dynamic: dynamic,
  });
}
function addHandler(el, name, value, dynamic) {
  var events;
  events = el.events || (el.events = {});
  var newHandler = {
    value: value.trim(),
    dynamic: dynamic,
  };
  var handlers = events[name]; //尝试获取已经存在的该事件对象

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

var attribute =
  /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
var dynamicArgAttribute =
  /^\s*((?:v-[\w-]+:|@|:|#)\[[^=]+?\][^\s"'<>\/=]*)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; //标签名  <my-header></my-header>

var ncname = '[a-zA-Z_][\\-\\.0-9_a-zA-Z]*'; // <my:header></my:header>

var qnameCapture = '((?:'.concat(ncname, '\\:)?').concat(ncname, ')'); // <div

var startTagOpen = new RegExp('^<'.concat(qnameCapture)); // > />

var startTagClose = /^\s*(\/?)>/; // </div>

var endTag = new RegExp('^<\\/'.concat(qnameCapture, '[^>]*>'));
var dynamicArgRE = /^\[.*\]$/;
var dirRE = /^v-|^@|^:|^#/;
var bindRE = /^:|^v-bind:/;
var onRE = /^@|^v-on:/; // 以上正则是从官方 Vue 源码扣的
// src/compiler/parser/index.js 方法名：parse -> parseHTML

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
      var startTagMatch = parseStartTag(); // 对该标签进行子父层级处理

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
  } // src/compiler/parser/html-parser.js

  function parseStartTag() {
    var start = html.match(startTagOpen);
    var end, attr;

    if (start) {
      // 保存标签名
      var match = {
        tagName: start[1],
        attrs: [],
      }; // 删除匹配项

      advance(start[0].length); // 开始匹配标签属性

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
  } // 节点完结时，处理额外事物

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
    var list = el.attrs;
    el.attrs = [];
    var i, l, name, value, isDynamic;

    for (i = 0, l = list.length; i < l; i++) {
      name = list[i].name;
      value = list[i].value; // vue 指令

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
          (function () {
            var styleAttrs = {};
            value.split(';').forEach(function (subItem) {
              var _subItem$split = subItem.split(':'),
                _subItem$split2 = _slicedToArray(_subItem$split, 2),
                key = _subItem$split2[0],
                value = _subItem$split2[1];

              styleAttrs[key] = value;
            });
            value = styleAttrs;
          })();
        }

        value = JSON.stringify(value);
        addAttr(el, name, value, isDynamic);
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

    closeElement(element);
  }

  function chars(text) {
    text = text.trim();

    if (text.length > 0) {
      currentParent.children.push({
        type: 3,
        text: text,
      });
    }
  } // 组装 AST 标签对象结构

  function createASTElement(tagName, attrs) {
    return {
      tag: tagName,
      type: 1,
      children: [],
      attrs: attrs,
      parent: Window,
    };
  }

  return root;
}

// 7.2.2 IsArray(argument)

var _isArray =
  Array.isArray ||
  function isArray(arg) {
    return _cof(arg) == 'Array';
  };

var SPECIES = _wks('species');

var _arraySpeciesConstructor = function (original) {
  var C;
  if (_isArray(original)) {
    C = original.constructor;
    // cross-realm fallback
    if (typeof C == 'function' && (C === Array || _isArray(C.prototype)))
      C = undefined;
    if (_isObject(C)) {
      C = C[SPECIES];
      if (C === null) C = undefined;
    }
  }
  return C === undefined ? Array : C;
};

// 9.4.2.3 ArraySpeciesCreate(originalArray, length)

var _arraySpeciesCreate = function (original, length) {
  return new (_arraySpeciesConstructor(original))(length);
};

// 0 -> Array#forEach
// 1 -> Array#map
// 2 -> Array#filter
// 3 -> Array#some
// 4 -> Array#every
// 5 -> Array#find
// 6 -> Array#findIndex

var _arrayMethods = function (TYPE, $create) {
  var IS_MAP = TYPE == 1;
  var IS_FILTER = TYPE == 2;
  var IS_SOME = TYPE == 3;
  var IS_EVERY = TYPE == 4;
  var IS_FIND_INDEX = TYPE == 6;
  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
  var create = $create || _arraySpeciesCreate;
  return function ($this, callbackfn, that) {
    var O = _toObject($this);
    var self = _iobject(O);
    var f = _ctx(callbackfn, that, 3);
    var length = _toLength(self.length);
    var index = 0;
    var result = IS_MAP
      ? create($this, length)
      : IS_FILTER
      ? create($this, 0)
      : undefined;
    var val, res;
    for (; length > index; index++)
      if (NO_HOLES || index in self) {
        val = self[index];
        res = f(val, index, O);
        if (TYPE) {
          if (IS_MAP) result[index] = res;
          // map
          else if (res)
            switch (TYPE) {
              case 3:
                return true; // some
              case 5:
                return val; // find
              case 6:
                return index; // findIndex
              case 2:
                result.push(val); // filter
            }
          else if (IS_EVERY) return false; // every
        }
      }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
  };
};

var _strictMethod = function (method, arg) {
  return (
    !!method &&
    _fails(function () {
      // eslint-disable-next-line no-useless-call
      arg
        ? method.call(
            null,
            function () {
              /* empty */
            },
            1
          )
        : method.call(null);
    })
  );
};

var $map = _arrayMethods(1);

_export(_export.P + _export.F * !_strictMethod([].map, true), 'Array', {
  // 22.1.3.15 / 15.4.4.19 Array.prototype.map(callbackfn [, thisArg])
  map: function map(callbackfn /* , thisArg */) {
    return $map(this, callbackfn, arguments[1]);
  },
});

var fnExpRE = /^([\w$_]+|\([^)]*?\))\s*=>|^function(?:\s+[\w$]+)?\s*\(/;
var fnInvokeRE = /\([^)]*?\);*$/;
var simplePathRE =
  /^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['[^']*?']|\["[^"]*?"]|\[\d+]|\[[A-Za-z_$][\w$]*])*$/;

function genHandler(handler) {
  if (!handler) {
    return 'function(){}';
  }

  if (Array.isArray(handler)) {
    return '['.concat(
      handler
        .map(function (handler) {
          return genHandler(handler);
        })
        .join(','),
      ']'
    );
  }

  var isMethodPath = simplePathRE.test(handler.value); //是否为简单的表达式，比如 onShow 等

  var isFunctionExpression = fnExpRE.test(handler.value); //是否为函数表达式(箭头函数或function(){}格式的匿名函数)

  var isFunctionInvocation = simplePathRE.test(
    // 是否需要 return
    handler.value.replace(fnInvokeRE, '')
  ); // 是否有修饰符，比如 @click.sync

  if (!handler.modifiers) {
    if (isMethodPath || isFunctionExpression) {
      return handler.value;
    }

    return 'function($event){'.concat(
      isFunctionInvocation ? 'return '.concat(handler.value) : handler.value,
      '}'
    ); // inline statement
  }
}

function genHandlers(events, isNative) {
  var prefix = isNative ? 'nativeOn:' : 'on:';
  var staticHandlers = '';
  var dynamicHandlers = '';

  for (var name in events) {
    var handlerCode = genHandler(events[name]);

    if (events[name] && events[name].dynamic) {
      dynamicHandlers += ''.concat(name, ',').concat(handlerCode, ',');
    } else {
      staticHandlers += '"'.concat(name, '":').concat(handlerCode, ',');
    }
  }

  staticHandlers = '{'.concat(staticHandlers.slice(0, -1), '}');

  if (dynamicHandlers) {
    return (
      prefix +
      '_d('
        .concat(staticHandlers, ',[')
        .concat(dynamicHandlers.slice(0, -1), '])')
    );
  } else {
    return prefix + staticHandlers;
  }
}

var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; // 位置：vue/src/compiler/codegen/index.js

function genProps(attrs) {
  var attrStr = '';
  var dynamicAttrStr = '';
  var dynamic = false;
  attrs.forEach(function (item) {
    dynamic = item.dynamic;

    if (dynamic) {
      // className, name | "name"
      dynamicAttrStr += ''
        .concat(item.name.slice(1), ', ')
        .concat(item.value, ',');
    } else {
      // "class": app | "app"
      attrStr += ''
        .concat(JSON.stringify(item.name), ': ')
        .concat(item.value, ',');
    }
  });
  attrStr = '{'.concat(attrStr.slice(0, -1), '}');

  if (dynamicAttrStr) {
    return '_d('
      .concat(attrStr, ', [')
      .concat(dynamicAttrStr.slice(0, -1), '])');
  } else {
    return attrStr;
  }
}

function genData(el) {
  var data = '{';

  if (el.attrs) {
    data += 'attrs:'.concat(genProps(el.attrs), ',');
  }

  if (el.events) {
    data += ''.concat(genHandlers(el.events, false), ',');
  }

  data = data.replace(/,$/, '') + '}';
  return data;
}

function generateChild(node) {
  if (node.type === 1) {
    return generate(node);
  } else if (node.type === 3) {
    var text = node.text;

    if (!defaultTagRE.test(text)) {
      // 这里需要 JSON.stringify 在包一下，否者会出现 _v(hello) 解析的时候 hello 不就成了变量了
      return '_v('.concat(JSON.stringify(text), ')');
    }

    var match,
      index,
      // 保存正则成功解析项的开始索引
      // defaultTagRE.lastIndex 会在正则解析的时候，一直处于匹配项末端的索引，下一轮匹配就从 defaultTagRE.lastIndex 开始
      lastIndex = (defaultTagRE.lastIndex = 0),
      textArr = [];

    while ((match = defaultTagRE.exec(text))) {
      index = match.index; // 保存正则成功解析项的开始索引

      if (index > lastIndex) {
        textArr.push(JSON.stringify(text.slice(lastIndex, index)));
      } // 这里不需要 JSON.stringify 原因是，match[1] 指的就是 data 的属性

      textArr.push('_s('.concat(match[1].trim(), ')'));
      lastIndex = index + match[0].length;
    } // 正则匹配不到了，但是还剩下静态文本

    if (lastIndex < text.length) {
      textArr.push(JSON.stringify(text.slice(lastIndex)));
    } // _v('我的姓名是：'+_s(name)+'，请多多关照~')

    return '_v('.concat(textArr.join('+'), ')');
  }
}

function getChildren(el) {
  var children = el.children;

  if (children) {
    return children
      .map(function (c) {
        return generateChild(c);
      })
      .join(',');
  }
}

function generate(el) {
  var children = getChildren(el);
  var code = '_c('
    .concat(JSON.stringify(el.tag), ', ')
    .concat(
      genData(el) // el.attrs.length > 0 ? formatProps(el.attrs) : 'undefined'
    )
    .concat(children ? ', '.concat(children) : '', ')');
  return code;
}

function compileToRenderFunction(html) {
  var ast = parseHtmlToAst(html),
    code = generate(ast),
    render = new Function('\n  with(this){ return '.concat(code, '; }\n  '));
  console.log('AST:', ast);
  console.log('code:', code);
  console.log('render:', render);
  return render;
}

var _objectDps = _descriptors
  ? Object.defineProperties
  : function defineProperties(O, Properties) {
      _anObject(O);
      var keys = _objectKeys(Properties);
      var length = keys.length;
      var i = 0;
      var P;
      while (length > i) _objectDp.f(O, (P = keys[i++]), Properties[P]);
      return O;
    };

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])

var IE_PROTO$1 = _sharedKey('IE_PROTO');
var Empty = function () {
  /* empty */
};
var PROTOTYPE$1 = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = _domCreate('iframe');
  var i = _enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  _html.appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(
    lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt
  );
  iframeDocument.close();
  createDict = iframeDocument.F;
  while (i--) delete createDict[PROTOTYPE$1][_enumBugKeys[i]];
  return createDict();
};

var _objectCreate =
  Object.create ||
  function create(O, Properties) {
    var result;
    if (O !== null) {
      Empty[PROTOTYPE$1] = _anObject(O);
      result = new Empty();
      Empty[PROTOTYPE$1] = null;
      // add "__proto__" for Object.getPrototypeOf polyfill
      result[IE_PROTO$1] = O;
    } else result = createDict();
    return Properties === undefined ? result : _objectDps(result, Properties);
  };

var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
_hide(IteratorPrototype, _wks('iterator'), function () {
  return this;
});

var _iterCreate = function (Constructor, NAME, next) {
  Constructor.prototype = _objectCreate(IteratorPrototype, {
    next: _propertyDesc(1, next),
  });
  _setToStringTag(Constructor, NAME + ' Iterator');
};

// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)

var IE_PROTO = _sharedKey('IE_PROTO');
var ObjectProto$1 = Object.prototype;

var _objectGpo =
  Object.getPrototypeOf ||
  function (O) {
    O = _toObject(O);
    if (_has(O, IE_PROTO)) return O[IE_PROTO];
    if (typeof O.constructor == 'function' && O instanceof O.constructor) {
      return O.constructor.prototype;
    }
    return O instanceof Object ? ObjectProto$1 : null;
  };

var ITERATOR$1 = _wks('iterator');
var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
var FF_ITERATOR = '@@iterator';
var KEYS = 'keys';
var VALUES = 'values';

var returnThis = function () {
  return this;
};

var _iterDefine = function (
  Base,
  NAME,
  Constructor,
  next,
  DEFAULT,
  IS_SET,
  FORCED
) {
  _iterCreate(Constructor, NAME, next);
  var getMethod = function (kind) {
    if (!BUGGY && kind in proto) return proto[kind];
    switch (kind) {
      case KEYS:
        return function keys() {
          return new Constructor(this, kind);
        };
      case VALUES:
        return function values() {
          return new Constructor(this, kind);
        };
    }
    return function entries() {
      return new Constructor(this, kind);
    };
  };
  var TAG = NAME + ' Iterator';
  var DEF_VALUES = DEFAULT == VALUES;
  var VALUES_BUG = false;
  var proto = Base.prototype;
  var $native =
    proto[ITERATOR$1] || proto[FF_ITERATOR] || (DEFAULT && proto[DEFAULT]);
  var $default = $native || getMethod(DEFAULT);
  var $entries = DEFAULT
    ? !DEF_VALUES
      ? $default
      : getMethod('entries')
    : undefined;
  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
  var methods, key, IteratorPrototype;
  // Fix native
  if ($anyNative) {
    IteratorPrototype = _objectGpo($anyNative.call(new Base()));
    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
      // Set @@toStringTag to native iterators
      _setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if (typeof IteratorPrototype[ITERATOR$1] != 'function')
        _hide(IteratorPrototype, ITERATOR$1, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;
    $default = function values() {
      return $native.call(this);
    };
  }
  // Define iterator
  if (BUGGY || VALUES_BUG || !proto[ITERATOR$1]) {
    _hide(proto, ITERATOR$1, $default);
  }
  // Plug for library
  _iterators[NAME] = $default;
  _iterators[TAG] = returnThis;
  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES),
      keys: IS_SET ? $default : getMethod(KEYS),
      entries: $entries,
    };
    if (FORCED)
      for (key in methods) {
        if (!(key in proto)) _redefine(proto, key, methods[key]);
      }
    else _export(_export.P + _export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};

var _iterStep = function (done, value) {
  return { value: value, done: !!done };
};

var _meta = createCommonjsModule(function (module) {
  var META = _uid('meta');

  var setDesc = _objectDp.f;
  var id = 0;
  var isExtensible =
    Object.isExtensible ||
    function () {
      return true;
    };
  var FREEZE = !_fails(function () {
    return isExtensible(Object.preventExtensions({}));
  });
  var setMeta = function (it) {
    setDesc(it, META, {
      value: {
        i: 'O' + ++id, // object ID
        w: {}, // weak collections IDs
      },
    });
  };
  var fastKey = function (it, create) {
    // return primitive with prefix
    if (!_isObject(it))
      return typeof it == 'symbol'
        ? it
        : (typeof it == 'string' ? 'S' : 'P') + it;
    if (!_has(it, META)) {
      // can't set metadata to uncaught frozen object
      if (!isExtensible(it)) return 'F';
      // not necessary to add metadata
      if (!create) return 'E';
      // add missing metadata
      setMeta(it);
      // return object ID
    }
    return it[META].i;
  };
  var getWeak = function (it, create) {
    if (!_has(it, META)) {
      // can't set metadata to uncaught frozen object
      if (!isExtensible(it)) return true;
      // not necessary to add metadata
      if (!create) return false;
      // add missing metadata
      setMeta(it);
      // return hash weak collections IDs
    }
    return it[META].w;
  };
  // add metadata on freeze-family methods calling
  var onFreeze = function (it) {
    if (FREEZE && meta.NEED && isExtensible(it) && !_has(it, META)) setMeta(it);
    return it;
  };
  var meta = (module.exports = {
    KEY: META,
    NEED: false,
    fastKey: fastKey,
    getWeak: getWeak,
    onFreeze: onFreeze,
  });
});
_meta.KEY;
_meta.NEED;
_meta.fastKey;
_meta.getWeak;
_meta.onFreeze;

var _validateCollection = function (it, TYPE) {
  if (!_isObject(it) || it._t !== TYPE)
    throw TypeError('Incompatible receiver, ' + TYPE + ' required!');
  return it;
};

var dP$1 = _objectDp.f;

var fastKey = _meta.fastKey;

var SIZE = _descriptors ? '_s' : 'size';

var getEntry = function (that, key) {
  // fast case
  var index = fastKey(key);
  var entry;
  if (index !== 'F') return that._i[index];
  // frozen object case
  for (entry = that._f; entry; entry = entry.n) {
    if (entry.k == key) return entry;
  }
};

var _collectionStrong = {
  getConstructor: function (wrapper, NAME, IS_MAP, ADDER) {
    var C = wrapper(function (that, iterable) {
      _anInstance(that, C, NAME, '_i');
      that._t = NAME; // collection type
      that._i = _objectCreate(null); // index
      that._f = undefined; // first entry
      that._l = undefined; // last entry
      that[SIZE] = 0; // size
      if (iterable != undefined) _forOf(iterable, IS_MAP, that[ADDER], that);
    });
    _redefineAll(C.prototype, {
      // 23.1.3.1 Map.prototype.clear()
      // 23.2.3.2 Set.prototype.clear()
      clear: function clear() {
        for (
          var that = _validateCollection(this, NAME),
            data = that._i,
            entry = that._f;
          entry;
          entry = entry.n
        ) {
          entry.r = true;
          if (entry.p) entry.p = entry.p.n = undefined;
          delete data[entry.i];
        }
        that._f = that._l = undefined;
        that[SIZE] = 0;
      },
      // 23.1.3.3 Map.prototype.delete(key)
      // 23.2.3.4 Set.prototype.delete(value)
      delete: function (key) {
        var that = _validateCollection(this, NAME);
        var entry = getEntry(that, key);
        if (entry) {
          var next = entry.n;
          var prev = entry.p;
          delete that._i[entry.i];
          entry.r = true;
          if (prev) prev.n = next;
          if (next) next.p = prev;
          if (that._f == entry) that._f = next;
          if (that._l == entry) that._l = prev;
          that[SIZE]--;
        }
        return !!entry;
      },
      // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
      // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
      forEach: function forEach(callbackfn /* , that = undefined */) {
        _validateCollection(this, NAME);
        var f = _ctx(
          callbackfn,
          arguments.length > 1 ? arguments[1] : undefined,
          3
        );
        var entry;
        while ((entry = entry ? entry.n : this._f)) {
          f(entry.v, entry.k, this);
          // revert to the last existing entry
          while (entry && entry.r) entry = entry.p;
        }
      },
      // 23.1.3.7 Map.prototype.has(key)
      // 23.2.3.7 Set.prototype.has(value)
      has: function has(key) {
        return !!getEntry(_validateCollection(this, NAME), key);
      },
    });
    if (_descriptors)
      dP$1(C.prototype, 'size', {
        get: function () {
          return _validateCollection(this, NAME)[SIZE];
        },
      });
    return C;
  },
  def: function (that, key, value) {
    var entry = getEntry(that, key);
    var prev, index;
    // change existing entry
    if (entry) {
      entry.v = value;
      // create new entry
    } else {
      that._l = entry = {
        i: (index = fastKey(key, true)), // <- index
        k: key, // <- key
        v: value, // <- value
        p: (prev = that._l), // <- previous entry
        n: undefined, // <- next entry
        r: false, // <- removed
      };
      if (!that._f) that._f = entry;
      if (prev) prev.n = entry;
      that[SIZE]++;
      // add to index
      if (index !== 'F') that._i[index] = entry;
    }
    return that;
  },
  getEntry: getEntry,
  setStrong: function (C, NAME, IS_MAP) {
    // add .keys, .values, .entries, [@@iterator]
    // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
    _iterDefine(
      C,
      NAME,
      function (iterated, kind) {
        this._t = _validateCollection(iterated, NAME); // target
        this._k = kind; // kind
        this._l = undefined; // previous
      },
      function () {
        var that = this;
        var kind = that._k;
        var entry = that._l;
        // revert to the last existing entry
        while (entry && entry.r) entry = entry.p;
        // get next entry
        if (!that._t || !(that._l = entry = entry ? entry.n : that._t._f)) {
          // or finish the iteration
          that._t = undefined;
          return _iterStep(1);
        }
        // return step by kind
        if (kind == 'keys') return _iterStep(0, entry.k);
        if (kind == 'values') return _iterStep(0, entry.v);
        return _iterStep(0, [entry.k, entry.v]);
      },
      IS_MAP ? 'entries' : 'values',
      !IS_MAP,
      true
    );

    // add [@@species], 23.1.2.2, 23.2.2.2
    _setSpecies(NAME);
  },
};

var _collection = function (NAME, wrapper, methods, common, IS_MAP, IS_WEAK) {
  var Base = _global[NAME];
  var C = Base;
  var ADDER = IS_MAP ? 'set' : 'add';
  var proto = C && C.prototype;
  var O = {};
  var fixMethod = function (KEY) {
    var fn = proto[KEY];
    _redefine(
      proto,
      KEY,
      KEY == 'delete'
        ? function (a) {
            return IS_WEAK && !_isObject(a)
              ? false
              : fn.call(this, a === 0 ? 0 : a);
          }
        : KEY == 'has'
        ? function has(a) {
            return IS_WEAK && !_isObject(a)
              ? false
              : fn.call(this, a === 0 ? 0 : a);
          }
        : KEY == 'get'
        ? function get(a) {
            return IS_WEAK && !_isObject(a)
              ? undefined
              : fn.call(this, a === 0 ? 0 : a);
          }
        : KEY == 'add'
        ? function add(a) {
            fn.call(this, a === 0 ? 0 : a);
            return this;
          }
        : function set(a, b) {
            fn.call(this, a === 0 ? 0 : a, b);
            return this;
          }
    );
  };
  if (
    typeof C != 'function' ||
    !(
      IS_WEAK ||
      (proto.forEach &&
        !_fails(function () {
          new C().entries().next();
        }))
    )
  ) {
    // create collection constructor
    C = common.getConstructor(wrapper, NAME, IS_MAP, ADDER);
    _redefineAll(C.prototype, methods);
    _meta.NEED = true;
  } else {
    var instance = new C();
    // early implementations not supports chaining
    var HASNT_CHAINING = instance[ADDER](IS_WEAK ? {} : -0, 1) != instance;
    // V8 ~  Chromium 40- weak-collections throws on primitives, but should return false
    var THROWS_ON_PRIMITIVES = _fails(function () {
      instance.has(1);
    });
    // most early implementations doesn't supports iterables, most modern - not close it correctly
    var ACCEPT_ITERABLES = _iterDetect(function (iter) {
      new C(iter);
    }); // eslint-disable-line no-new
    // for early implementations -0 and +0 not the same
    var BUGGY_ZERO =
      !IS_WEAK &&
      _fails(function () {
        // V8 ~ Chromium 42- fails only with 5+ elements
        var $instance = new C();
        var index = 5;
        while (index--) $instance[ADDER](index, index);
        return !$instance.has(-0);
      });
    if (!ACCEPT_ITERABLES) {
      C = wrapper(function (target, iterable) {
        _anInstance(target, C, NAME);
        var that = _inheritIfRequired(new Base(), target, C);
        if (iterable != undefined) _forOf(iterable, IS_MAP, that[ADDER], that);
        return that;
      });
      C.prototype = proto;
      proto.constructor = C;
    }
    if (THROWS_ON_PRIMITIVES || BUGGY_ZERO) {
      fixMethod('delete');
      fixMethod('has');
      IS_MAP && fixMethod('get');
    }
    if (BUGGY_ZERO || HASNT_CHAINING) fixMethod(ADDER);
    // weak collections should not contains .clear method
    if (IS_WEAK && proto.clear) delete proto.clear;
  }

  _setToStringTag(C, NAME);

  O[NAME] = C;
  _export(_export.G + _export.W + _export.F * (C != Base), O);

  if (!IS_WEAK) common.setStrong(C, NAME, IS_MAP);

  return C;
};

var SET = 'Set';

// 23.2 Set Objects
_collection(
  SET,
  function (get) {
    return function Set() {
      return get(this, arguments.length > 0 ? arguments[0] : undefined);
    };
  },
  {
    // 23.2.3.1 Set.prototype.add(value)
    add: function add(value) {
      return _collectionStrong.def(
        _validateCollection(this, SET),
        (value = value === 0 ? 0 : value),
        value
      );
    },
  },
  _collectionStrong
);

var $at = _stringAt(true);

// 21.1.3.27 String.prototype[@@iterator]()
_iterDefine(
  String,
  'String',
  function (iterated) {
    this._t = String(iterated); // target
    this._i = 0; // next index
    // 21.1.5.2.1 %StringIteratorPrototype%.next()
  },
  function () {
    var O = this._t;
    var index = this._i;
    var point;
    if (index >= O.length) return { value: undefined, done: true };
    point = $at(O, index);
    this._i += point.length;
    return { value: point, done: false };
  }
);

// 22.1.3.31 Array.prototype[@@unscopables]
var UNSCOPABLES = _wks('unscopables');
var ArrayProto = Array.prototype;
if (ArrayProto[UNSCOPABLES] == undefined) _hide(ArrayProto, UNSCOPABLES, {});
var _addToUnscopables = function (key) {
  ArrayProto[UNSCOPABLES][key] = true;
};

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
var es6_array_iterator = _iterDefine(
  Array,
  'Array',
  function (iterated, kind) {
    this._t = _toIobject(iterated); // target
    this._i = 0; // next index
    this._k = kind; // kind
    // 22.1.5.2.1 %ArrayIteratorPrototype%.next()
  },
  function () {
    var O = this._t;
    var kind = this._k;
    var index = this._i++;
    if (!O || index >= O.length) {
      this._t = undefined;
      return _iterStep(1);
    }
    if (kind == 'keys') return _iterStep(0, index);
    if (kind == 'values') return _iterStep(0, O[index]);
    return _iterStep(0, [index, O[index]]);
  },
  'values'
);

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
_iterators.Arguments = _iterators.Array;

_addToUnscopables('keys');
_addToUnscopables('values');
_addToUnscopables('entries');

var ITERATOR = _wks('iterator');
var TO_STRING_TAG = _wks('toStringTag');
var ArrayValues = _iterators.Array;

var DOMIterables = {
  CSSRuleList: true, // TODO: Not spec compliant, should be false.
  CSSStyleDeclaration: false,
  CSSValueList: false,
  ClientRectList: false,
  DOMRectList: false,
  DOMStringList: false,
  DOMTokenList: true,
  DataTransferItemList: false,
  FileList: false,
  HTMLAllCollection: false,
  HTMLCollection: false,
  HTMLFormElement: false,
  HTMLSelectElement: false,
  MediaList: true, // TODO: Not spec compliant, should be false.
  MimeTypeArray: false,
  NamedNodeMap: false,
  NodeList: true,
  PaintRequestList: false,
  Plugin: false,
  PluginArray: false,
  SVGLengthList: false,
  SVGNumberList: false,
  SVGPathSegList: false,
  SVGPointList: false,
  SVGStringList: false,
  SVGTransformList: false,
  SourceBufferList: false,
  StyleSheetList: true, // TODO: Not spec compliant, should be false.
  TextTrackCueList: false,
  TextTrackList: false,
  TouchList: false,
};

for (
  var collections = _objectKeys(DOMIterables), i = 0;
  i < collections.length;
  i++
) {
  var NAME = collections[i];
  var explicit = DOMIterables[NAME];
  var Collection = _global[NAME];
  var proto = Collection && Collection.prototype;
  var key;
  if (proto) {
    if (!proto[ITERATOR]) _hide(proto, ITERATOR, ArrayValues);
    if (!proto[TO_STRING_TAG]) _hide(proto, TO_STRING_TAG, NAME);
    _iterators[NAME] = ArrayValues;
    if (explicit)
      for (key in es6_array_iterator)
        if (!proto[key]) _redefine(proto, key, es6_array_iterator[key], true);
  }
}

var queue = [];
var has = {};
var waiting = false;
var flushing = false;
var index$1 = 0; // 完成异步任务，将队列清理完毕后，重置

function resetSchedulerState() {
  index$1 = queue.length = 0;
  has = {};
  waiting = flushing = false;
}

function flushSchedulerQueue() {
  var watcher, id;
  queue.sort(function (a, b) {
    return a.id - b.id;
  });

  for (index$1 = 0; index$1 < queue.length; index$1++) {
    watcher = queue[index$1];
    id = watcher.id;
    has[id] = null;
    watcher.run();
  }

  resetSchedulerState();
}

function queueWatcher(watcher) {
  var id = watcher.id; // undefined == null -> true

  if (has[id] == null) {
    has[id] = true; // 判断异步任务是否开始执行，如果未执行直接放到队列后面

    if (!flushing) {
      queue.push(watcher);
    } else {
      // 如果已经开始执行队列任务了,将当前 watcher 放入到队列排序相应位置，加入执行队列中
      var i = queue.length - 1;

      while (i > index$1 && queue[i].id > watcher.id) {
        i--;
      }

      queue.splice(i + 1, 0, watcher);
    } // 初始化、异步队列中已存在 watcher、异步任务执行中且未执行完的状态下，不允许开通下一个异步任务

    if (!waiting) {
      waiting = true;
      nextTick(flushSchedulerQueue);
    }
  }
}

var uid = 0;

var Watcher = /*#__PURE__*/ (function () {
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

        process.env.NODE_ENV !== 'production' &&
          console.warn(
            'Failed watching path: "'.concat(expOrFn, '" ') +
              'Watcher only accepts simple dot-delimited paths. ' +
              'For full control, use a function instead.'
          );
      }
    } // 初次执行

    this.value = this.lazy ? undefined : this.get();
  }

  _createClass(Watcher, [
    {
      key: 'get',
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
      },
    },
    {
      key: 'addDep',
      value: function addDep(dep) {
        var id = dep.id; // 当前 Watcher 的新 depIds 不存在，就加入传进来的 dep

        if (!this.newDepIds.has(id)) {
          this.newDepIds.add(id);
          this.newDeps.push(dep); // Watcher 关联的 dep 保存
          // Watcher 关联的 dep 没有保存过，让 dep 收集当前的 Watcher 依赖
          // Watcher 已保存过了 dep 那就说明，当前 dep 也已经收集了当前 Watcher 了，所有就不需要让 dep 收集依赖了

          if (!this.depIds.has(id)) {
            dep.addSub(this);
          }
        }
      },
      /**
       * Clean up for dependency collection.
       */
    },
    {
      key: 'cleanupDeps',
      value: function cleanupDeps() {
        // 源码有更多
        this.depIds = this.newDepIds;
        this.newDepIds.clear(); // 清除最新记录 depIds 集合

        this.deps = this.newDeps;
        this.newDeps.length = 0; // 清除最新记录 dep 集合
      },
    },
    {
      key: 'update',
      value: function update() {
        // 这里的话，源码中会有更多的判断
        // 一般来说更新的话，会进行异步更新，会涉及到 nextTick 函数
        // 最终会执行 run() 函数
        queueWatcher(this);
      },
    },
    {
      key: 'run',
      value: function run() {
        this.get();
      },
    },
  ]);

  return Watcher;
})();

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
      index: index,
    });
  } else if (oldVnode.text && vnode.text) {
    if (oldVnode.text !== vnode.text) {
      vnPatch.push({
        type: TEXT,
        text: vnode.text,
      });
    }
  } else if (oldVnode.tag === vnode.tag) {
    var attrsPatch = attrsWalk(oldVnode.props, vnode.props);

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
      vnode: vnode,
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

var f$1 = _wks;

var _wksExt = {
  f: f$1,
};

var defineProperty = _objectDp.f;
var _wksDefine = function (name) {
  var $Symbol = _core.Symbol || (_core.Symbol = _global.Symbol || {});
  if (name.charAt(0) != '_' && !(name in $Symbol))
    defineProperty($Symbol, name, { value: _wksExt.f(name) });
};

var f = Object.getOwnPropertySymbols;

var _objectGops = {
  f: f,
};

// all enumerable object keys, includes symbols

var _enumKeys = function (it) {
  var result = _objectKeys(it);
  var getSymbols = _objectGops.f;
  if (getSymbols) {
    var symbols = getSymbols(it);
    var isEnum = _objectPie.f;
    var i = 0;
    var key;
    while (symbols.length > i)
      if (isEnum.call(it, (key = symbols[i++]))) result.push(key);
  }
  return result;
};

// ECMAScript 6 symbols shim

var META = _meta.KEY;

var gOPD = _objectGopd.f;
var dP = _objectDp.f;
var gOPN = _objectGopnExt.f;
var $Symbol = _global.Symbol;
var $JSON = _global.JSON;
var _stringify = $JSON && $JSON.stringify;
var PROTOTYPE = 'prototype';
var HIDDEN = _wks('_hidden');
var TO_PRIMITIVE = _wks('toPrimitive');
var isEnum = {}.propertyIsEnumerable;
var SymbolRegistry = _shared('symbol-registry');
var AllSymbols = _shared('symbols');
var OPSymbols = _shared('op-symbols');
var ObjectProto = Object[PROTOTYPE];
var USE_NATIVE = typeof $Symbol == 'function' && !!_objectGops.f;
var QObject = _global.QObject;
// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDesc =
  _descriptors &&
  _fails(function () {
    return (
      _objectCreate(
        dP({}, 'a', {
          get: function () {
            return dP(this, 'a', { value: 7 }).a;
          },
        })
      ).a != 7
    );
  })
    ? function (it, key, D) {
        var protoDesc = gOPD(ObjectProto, key);
        if (protoDesc) delete ObjectProto[key];
        dP(it, key, D);
        if (protoDesc && it !== ObjectProto) dP(ObjectProto, key, protoDesc);
      }
    : dP;

var wrap = function (tag) {
  var sym = (AllSymbols[tag] = _objectCreate($Symbol[PROTOTYPE]));
  sym._k = tag;
  return sym;
};

var isSymbol =
  USE_NATIVE && typeof $Symbol.iterator == 'symbol'
    ? function (it) {
        return typeof it == 'symbol';
      }
    : function (it) {
        return it instanceof $Symbol;
      };

var $defineProperty = function defineProperty(it, key, D) {
  if (it === ObjectProto) $defineProperty(OPSymbols, key, D);
  _anObject(it);
  key = _toPrimitive(key, true);
  _anObject(D);
  if (_has(AllSymbols, key)) {
    if (!D.enumerable) {
      if (!_has(it, HIDDEN)) dP(it, HIDDEN, _propertyDesc(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if (_has(it, HIDDEN) && it[HIDDEN][key]) it[HIDDEN][key] = false;
      D = _objectCreate(D, { enumerable: _propertyDesc(0, false) });
    }
    return setSymbolDesc(it, key, D);
  }
  return dP(it, key, D);
};
var $defineProperties = function defineProperties(it, P) {
  _anObject(it);
  var keys = _enumKeys((P = _toIobject(P)));
  var i = 0;
  var l = keys.length;
  var key;
  while (l > i) $defineProperty(it, (key = keys[i++]), P[key]);
  return it;
};
var $create = function create(it, P) {
  return P === undefined
    ? _objectCreate(it)
    : $defineProperties(_objectCreate(it), P);
};
var $propertyIsEnumerable = function propertyIsEnumerable(key) {
  var E = isEnum.call(this, (key = _toPrimitive(key, true)));
  if (this === ObjectProto && _has(AllSymbols, key) && !_has(OPSymbols, key))
    return false;
  return E ||
    !_has(this, key) ||
    !_has(AllSymbols, key) ||
    (_has(this, HIDDEN) && this[HIDDEN][key])
    ? E
    : true;
};
var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key) {
  it = _toIobject(it);
  key = _toPrimitive(key, true);
  if (it === ObjectProto && _has(AllSymbols, key) && !_has(OPSymbols, key))
    return;
  var D = gOPD(it, key);
  if (D && _has(AllSymbols, key) && !(_has(it, HIDDEN) && it[HIDDEN][key]))
    D.enumerable = true;
  return D;
};
var $getOwnPropertyNames = function getOwnPropertyNames(it) {
  var names = gOPN(_toIobject(it));
  var result = [];
  var i = 0;
  var key;
  while (names.length > i) {
    if (!_has(AllSymbols, (key = names[i++])) && key != HIDDEN && key != META)
      result.push(key);
  }
  return result;
};
var $getOwnPropertySymbols = function getOwnPropertySymbols(it) {
  var IS_OP = it === ObjectProto;
  var names = gOPN(IS_OP ? OPSymbols : _toIobject(it));
  var result = [];
  var i = 0;
  var key;
  while (names.length > i) {
    if (
      _has(AllSymbols, (key = names[i++])) &&
      (IS_OP ? _has(ObjectProto, key) : true)
    )
      result.push(AllSymbols[key]);
  }
  return result;
};

// 19.4.1.1 Symbol([description])
if (!USE_NATIVE) {
  $Symbol = function Symbol() {
    if (this instanceof $Symbol)
      throw TypeError('Symbol is not a constructor!');
    var tag = _uid(arguments.length > 0 ? arguments[0] : undefined);
    var $set = function (value) {
      if (this === ObjectProto) $set.call(OPSymbols, value);
      if (_has(this, HIDDEN) && _has(this[HIDDEN], tag))
        this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, _propertyDesc(1, value));
    };
    if (_descriptors && setter)
      setSymbolDesc(ObjectProto, tag, { configurable: true, set: $set });
    return wrap(tag);
  };
  _redefine($Symbol[PROTOTYPE], 'toString', function toString() {
    return this._k;
  });

  _objectGopd.f = $getOwnPropertyDescriptor;
  _objectDp.f = $defineProperty;
  _objectGopn.f = _objectGopnExt.f = $getOwnPropertyNames;
  _objectPie.f = $propertyIsEnumerable;
  _objectGops.f = $getOwnPropertySymbols;

  if (_descriptors && !_library) {
    _redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
  }

  _wksExt.f = function (name) {
    return wrap(_wks(name));
  };
}

_export(_export.G + _export.W + _export.F * !USE_NATIVE, { Symbol: $Symbol });

for (
  var es6Symbols =
      // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
      'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'.split(
        ','
      ),
    j = 0;
  es6Symbols.length > j;

)
  _wks(es6Symbols[j++]);

for (
  var wellKnownSymbols = _objectKeys(_wks.store), k = 0;
  wellKnownSymbols.length > k;

)
  _wksDefine(wellKnownSymbols[k++]);

_export(_export.S + _export.F * !USE_NATIVE, 'Symbol', {
  // 19.4.2.1 Symbol.for(key)
  for: function (key) {
    return _has(SymbolRegistry, (key += ''))
      ? SymbolRegistry[key]
      : (SymbolRegistry[key] = $Symbol(key));
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(sym) {
    if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol!');
    for (var key in SymbolRegistry) if (SymbolRegistry[key] === sym) return key;
  },
  useSetter: function () {
    setter = true;
  },
  useSimple: function () {
    setter = false;
  },
});

_export(_export.S + _export.F * !USE_NATIVE, 'Object', {
  // 19.1.2.2 Object.create(O [, Properties])
  create: $create,
  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
  defineProperty: $defineProperty,
  // 19.1.2.3 Object.defineProperties(O, Properties)
  defineProperties: $defineProperties,
  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $getOwnPropertyNames,
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: $getOwnPropertySymbols,
});

// Chrome 38 and 39 `Object.getOwnPropertySymbols` fails on primitives
// https://bugs.chromium.org/p/v8/issues/detail?id=3443
var FAILS_ON_PRIMITIVES = _fails(function () {
  _objectGops.f(1);
});

_export(_export.S + _export.F * FAILS_ON_PRIMITIVES, 'Object', {
  getOwnPropertySymbols: function getOwnPropertySymbols(it) {
    return _objectGops.f(_toObject(it));
  },
});

// 24.3.2 JSON.stringify(value [, replacer [, space]])
$JSON &&
  _export(
    _export.S +
      _export.F *
        (!USE_NATIVE ||
          _fails(function () {
            var S = $Symbol();
            // MS Edge converts symbol values to JSON as {}
            // WebKit converts symbol values to JSON as null
            // V8 throws on boxed symbols
            return (
              _stringify([S]) != '[null]' ||
              _stringify({ a: S }) != '{}' ||
              _stringify(Object(S)) != '{}'
            );
          })),
    'JSON',
    {
      stringify: function stringify(it) {
        var args = [it];
        var i = 1;
        var replacer, $replacer;
        while (arguments.length > i) args.push(arguments[i++]);
        $replacer = replacer = args[1];
        if ((!_isObject(replacer) && it === undefined) || isSymbol(it)) return; // IE8 returns string on undefined
        if (!_isArray(replacer))
          replacer = function (key, value) {
            if (typeof $replacer == 'function')
              value = $replacer.call(this, key, value);
            if (!isSymbol(value)) return value;
          };
        args[1] = replacer;
        return _stringify.apply($JSON, args);
      },
    }
  );

// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
$Symbol[PROTOTYPE][TO_PRIMITIVE] ||
  _hide($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
// 19.4.3.5 Symbol.prototype[@@toStringTag]
_setToStringTag($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
_setToStringTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
_setToStringTag(_global.JSON, 'JSON', true);

var _createProperty = function (object, index, value) {
  if (index in object) _objectDp.f(object, index, _propertyDesc(0, value));
  else object[index] = value;
};

_export(
  _export.S +
    _export.F *
      !_iterDetect(function (iter) {
        Array.from(iter);
      }),
  'Array',
  {
    // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
    from: function from(
      arrayLike /* , mapfn = undefined, thisArg = undefined */
    ) {
      var O = _toObject(arrayLike);
      var C = typeof this == 'function' ? this : Array;
      var aLen = arguments.length;
      var mapfn = aLen > 1 ? arguments[1] : undefined;
      var mapping = mapfn !== undefined;
      var index = 0;
      var iterFn = core_getIteratorMethod(O);
      var length, result, step, iterator;
      if (mapping) mapfn = _ctx(mapfn, aLen > 2 ? arguments[2] : undefined, 2);
      // if object isn't iterable or it's array with default iterator - use simple case
      if (iterFn != undefined && !(C == Array && _isArrayIter(iterFn))) {
        for (
          iterator = iterFn.call(O), result = new C();
          !(step = iterator.next()).done;
          index++
        ) {
          _createProperty(
            result,
            index,
            mapping
              ? _iterCall(iterator, mapfn, [step.value, index], true)
              : step.value
          );
        }
      } else {
        length = _toLength(O.length);
        for (result = new C(length); length > index; index++) {
          _createProperty(
            result,
            index,
            mapping ? mapfn(O[index], index) : O[index]
          );
        }
      }
      result.length = index;
      return result;
    },
  }
);

var arrayWithoutHoles = createCommonjsModule(function (module) {
  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return arrayLikeToArray(arr);
  }

  module.exports = _arrayWithoutHoles;
  (module.exports['default'] = module.exports),
    (module.exports.__esModule = true);
});

unwrapExports(arrayWithoutHoles);

var iterableToArray = createCommonjsModule(function (module) {
  function _iterableToArray(iter) {
    if (typeof Symbol !== 'undefined' && Symbol.iterator in Object(iter))
      return Array.from(iter);
  }

  module.exports = _iterableToArray;
  (module.exports['default'] = module.exports),
    (module.exports.__esModule = true);
});

unwrapExports(iterableToArray);

var nonIterableSpread = createCommonjsModule(function (module) {
  function _nonIterableSpread() {
    throw new TypeError(
      'Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.'
    );
  }

  module.exports = _nonIterableSpread;
  (module.exports['default'] = module.exports),
    (module.exports.__esModule = true);
});

unwrapExports(nonIterableSpread);

var toConsumableArray = createCommonjsModule(function (module) {
  function _toConsumableArray(arr) {
    return (
      arrayWithoutHoles(arr) ||
      iterableToArray(arr) ||
      unsupportedIterableToArray(arr) ||
      nonIterableSpread()
    );
  }

  module.exports = _toConsumableArray;
  (module.exports['default'] = module.exports),
    (module.exports.__esModule = true);
});

var _toConsumableArray = unwrapExports(toConsumableArray);

function _createForOfIteratorHelper$1(o, allowArrayLike) {
  var it;
  if (typeof Symbol === 'undefined' || o[Symbol.iterator] == null) {
    if (
      Array.isArray(o) ||
      (it = _unsupportedIterableToArray$1(o)) ||
      (allowArrayLike && o && typeof o.length === 'number')
    ) {
      if (it) o = it;
      var i = 0;
      var F = function F() {};
      return {
        s: F,
        n: function n() {
          if (i >= o.length) return { done: true };
          return { done: false, value: o[i++] };
        },
        e: function e(_e) {
          throw _e;
        },
        f: F,
      };
    }
    throw new TypeError(
      'Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.'
    );
  }
  var normalCompletion = true,
    didErr = false,
    err;
  return {
    s: function s() {
      it = o[Symbol.iterator]();
    },
    n: function n() {
      var step = it.next();
      normalCompletion = step.done;
      return step;
    },
    e: function e(_e2) {
      didErr = true;
      err = _e2;
    },
    f: function f() {
      try {
        if (!normalCompletion && it.return != null) it.return();
      } finally {
        if (didErr) throw err;
      }
    },
  };
}

function _unsupportedIterableToArray$1(o, minLen) {
  if (!o) return;
  if (typeof o === 'string') return _arrayLikeToArray$1(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === 'Object' && o.constructor) n = o.constructor.name;
  if (n === 'Map' || n === 'Set') return Array.from(o);
  if (n === 'Arguments' || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
    return _arrayLikeToArray$1(o, minLen);
}

function _arrayLikeToArray$1(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }
  return arr2;
}

function createElement(vnode) {
  var tag = vnode.tag,
    children = vnode.children,
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
  handleAttrs(rnode, props.attrs);
  updateDOMListeners(rnode, props.on);
}

function handleAttrs(rnode, attrs) {
  for (var key in attrs) {
    if (Object.hasOwnProperty.call(attrs, key)) {
      if (!attrs[key]) {
        rnode.removeAttribute(key);
      } else if (key === 'style') {
        for (var sKey in attrs[key]) {
          if (Object.hasOwnProperty.call(attrs[key], sKey)) {
            rnode.style[sKey] = attrs[key][sKey];
          }
        }
      } else if (key === 'class') {
        rnode.className = attrs[key];
      } else if (key === 'value') {
        if (rnode.tagName === 'INPUT' || rnode.tagName === 'TEXTAREA') {
          rnode.value = attrs[key];
        } else {
          rnode.setAttribute(key, attrs[key]);
        }
      } else {
        rnode.setAttribute(key, attrs[key]);
      }
    }
  }
}

function updateDOMListeners(rnode, on) {
  function add(event, handler) {
    rnode.addEventListener(event, handler, false);
  }

  for (var name in on) {
    //遍历on,此时name就是对应的事件类型，比如:click
    var cur = on[name];

    if (Array.isArray(cur)) {
      var _iterator = _createForOfIteratorHelper$1(cur),
        _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done; ) {
          var handler = _step.value;
          add(name, handler);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    } else {
      add(name, cur);
    }
  }
}

function removeElement(oldVnode) {
  // 判断 oldVnode 是否是真实节点
  var isRealElement = isDef(oldVnode.nodeType);
  var el = isRealElement ? oldVnode : oldVnode.el;
  var childNodes = el.childNodes;

  var _iterator2 = _createForOfIteratorHelper$1(childNodes),
    _step2;

  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done; ) {
      var childNode = _step2.value;
      removeNode(el, childNode);
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }
}

function removeNode(parent, childNode) {
  parent.removeChild(childNode);
}

function _createForOfIteratorHelper(o, allowArrayLike) {
  var it;
  if (typeof Symbol === 'undefined' || o[Symbol.iterator] == null) {
    if (
      Array.isArray(o) ||
      (it = _unsupportedIterableToArray(o)) ||
      (allowArrayLike && o && typeof o.length === 'number')
    ) {
      if (it) o = it;
      var i = 0;
      var F = function F() {};
      return {
        s: F,
        n: function n() {
          if (i >= o.length) return { done: true };
          return { done: false, value: o[i++] };
        },
        e: function e(_e) {
          throw _e;
        },
        f: F,
      };
    }
    throw new TypeError(
      'Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.'
    );
  }
  var normalCompletion = true,
    didErr = false,
    err;
  return {
    s: function s() {
      it = o[Symbol.iterator]();
    },
    n: function n() {
      var step = it.next();
      normalCompletion = step.done;
      return step;
    },
    e: function e(_e2) {
      didErr = true;
      err = _e2;
    },
    f: function f() {
      try {
        if (!normalCompletion && it.return != null) it.return();
      } finally {
        if (didErr) throw err;
      }
    },
  };
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === 'string') return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === 'Object' && o.constructor) n = o.constructor.name;
  if (n === 'Map' || n === 'Set') return Array.from(o);
  if (n === 'Arguments' || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
    return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }
  return arr2;
}
var index = 0;
var finalPatches = {};

function doPatch(el, patches) {
  index = 0;
  finalPatches = patches;
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
    for (_iterator.s(); !(_step = _iterator.n()).done; ) {
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
    console.log('patches', patches);

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
      if (
        (vm.$options.template && vm.$options.template.charAt(0) !== '#') ||
        vm.$options.el ||
        el
      ) {
        console.warn(
          'You are using the runtime-only build of Vue where the template ' +
            'compiler is not available. Either pre-compile the templates into ' +
            'render functions, or use the compiler-included build.'
        );
      } else {
        console.warn(
          'Failed to mount component: template or render function not defined.'
        );
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

    console.log('VNode', vnode);
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
