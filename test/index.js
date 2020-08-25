(function () {
	'use strict';

	function createCommonjsModule(fn, basedir, module) {
		return module = {
		  path: basedir,
		  exports: {},
		  require: function (path, base) {
	      return commonjsRequire(path, (base === undefined || base === null) ? module.path : base);
	    }
		}, fn(module, module.exports), module.exports;
	}

	function commonjsRequire () {
		throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
	}

	var _global = createCommonjsModule(function (module) {
	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global = module.exports = typeof window != 'undefined' && window.Math == Math
	  ? window : typeof self != 'undefined' && self.Math == Math ? self
	  // eslint-disable-next-line no-new-func
	  : Function('return this')();
	if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef
	});

	var _core = createCommonjsModule(function (module) {
	var core = module.exports = { version: '2.6.11' };
	if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef
	});

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
	  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
	});

	var document$1 = _global.document;
	// typeof document.createElement is 'object' in old IE
	var is = _isObject(document$1) && _isObject(document$1.createElement);
	var _domCreate = function (it) {
	  return is ? document$1.createElement(it) : {};
	};

	var _ie8DomDefine = !_descriptors && !_fails(function () {
	  return Object.defineProperty(_domCreate('div'), 'a', { get: function () { return 7; } }).a != 7;
	});

	// 7.1.1 ToPrimitive(input [, PreferredType])

	// instead of the ES6 spec version, we didn't implement @@toPrimitive case
	// and the second argument - flag - preferred type is a string
	var _toPrimitive = function (it, S) {
	  if (!_isObject(it)) return it;
	  var fn, val;
	  if (S && typeof (fn = it.toString) == 'function' && !_isObject(val = fn.call(it))) return val;
	  if (typeof (fn = it.valueOf) == 'function' && !_isObject(val = fn.call(it))) return val;
	  if (!S && typeof (fn = it.toString) == 'function' && !_isObject(val = fn.call(it))) return val;
	  throw TypeError("Can't convert object to primitive value");
	};

	var dP = Object.defineProperty;

	var f = _descriptors ? Object.defineProperty : function defineProperty(O, P, Attributes) {
	  _anObject(O);
	  P = _toPrimitive(P, true);
	  _anObject(Attributes);
	  if (_ie8DomDefine) try {
	    return dP(O, P, Attributes);
	  } catch (e) { /* empty */ }
	  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
	  if ('value' in Attributes) O[P] = Attributes.value;
	  return O;
	};

	var _objectDp = {
		f: f
	};

	var _propertyDesc = function (bitmap, value) {
	  return {
	    enumerable: !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable: !(bitmap & 4),
	    value: value
	  };
	};

	var _hide = _descriptors ? function (object, key, value) {
	  return _objectDp.f(object, key, _propertyDesc(1, value));
	} : function (object, key, value) {
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
	  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
	};

	var _shared = createCommonjsModule(function (module) {
	var SHARED = '__core-js_shared__';
	var store = _global[SHARED] || (_global[SHARED] = {});

	(module.exports = function (key, value) {
	  return store[key] || (store[key] = value !== undefined ? value : {});
	})('versions', []).push({
	  version: _core.version,
	  mode:  'global',
	  copyright: '© 2019 Denis Pushkarev (zloirock.ru)'
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
	  if (isFunction) _has(val, SRC) || _hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
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
	  return typeof this == 'function' && this[SRC] || _functionToString.call(this);
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
	    case 1: return function (a) {
	      return fn.call(that, a);
	    };
	    case 2: return function (a, b) {
	      return fn.call(that, a, b);
	    };
	    case 3: return function (a, b, c) {
	      return fn.call(that, a, b, c);
	    };
	  }
	  return function (/* ...args */) {
	    return fn.apply(that, arguments);
	  };
	};

	var PROTOTYPE = 'prototype';

	var $export = function (type, name, source) {
	  var IS_FORCED = type & $export.F;
	  var IS_GLOBAL = type & $export.G;
	  var IS_STATIC = type & $export.S;
	  var IS_PROTO = type & $export.P;
	  var IS_BIND = type & $export.B;
	  var target = IS_GLOBAL ? _global : IS_STATIC ? _global[name] || (_global[name] = {}) : (_global[name] || {})[PROTOTYPE];
	  var exports = IS_GLOBAL ? _core : _core[name] || (_core[name] = {});
	  var expProto = exports[PROTOTYPE] || (exports[PROTOTYPE] = {});
	  var key, own, out, exp;
	  if (IS_GLOBAL) source = name;
	  for (key in source) {
	    // contains in native
	    own = !IS_FORCED && target && target[key] !== undefined;
	    // export native or passed
	    out = (own ? target : source)[key];
	    // bind timers to global for call from export context
	    exp = IS_BIND && own ? _ctx(out, _global) : IS_PROTO && typeof out == 'function' ? _ctx(Function.call, out) : out;
	    // extend global
	    if (target) _redefine(target, key, out, type & $export.U);
	    // export
	    if (exports[key] != out) _hide(exports, key, exp);
	    if (IS_PROTO && expProto[key] != out) expProto[key] = out;
	  }
	};
	_global.core = _core;
	// type bitmap
	$export.F = 1;   // forced
	$export.G = 2;   // global
	$export.S = 4;   // static
	$export.P = 8;   // proto
	$export.B = 16;  // bind
	$export.W = 32;  // wrap
	$export.U = 64;  // safe
	$export.R = 128; // real proto method for `library`
	var _export = $export;

	var navigator$1 = _global.navigator;

	var _userAgent = navigator$1 && navigator$1.userAgent || '';

	// ie9- setTimeout & setInterval additional parameters fix



	var slice = [].slice;
	var MSIE = /MSIE .\./.test(_userAgent); // <- dirty ie9- check
	var wrap = function (set) {
	  return function (fn, time /* , ...args */) {
	    var boundArgs = arguments.length > 2;
	    var args = boundArgs ? slice.call(arguments, 2) : false;
	    return set(boundArgs ? function () {
	      // eslint-disable-next-line no-new-func
	      (typeof fn == 'function' ? fn : Function(fn)).apply(this, args);
	    } : fn, time);
	  };
	};
	_export(_export.G + _export.B + _export.F * MSIE, {
	  setTimeout: wrap(_global.setTimeout),
	  setInterval: wrap(_global.setInterval)
	});

	function _typeof(obj) {
	  "@babel/helpers - typeof";

	  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
	    _typeof = function (obj) {
	      return typeof obj;
	    };
	  } else {
	    _typeof = function (obj) {
	      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
	    };
	  }

	  return _typeof(obj);
	}

	function _classCallCheck(instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	}

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

	function _defineProperty(obj, key, value) {
	  if (key in obj) {
	    Object.defineProperty(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	  } else {
	    obj[key] = value;
	  }

	  return obj;
	}

	function ownKeys(object, enumerableOnly) {
	  var keys = Object.keys(object);

	  if (Object.getOwnPropertySymbols) {
	    var symbols = Object.getOwnPropertySymbols(object);
	    if (enumerableOnly) symbols = symbols.filter(function (sym) {
	      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
	    });
	    keys.push.apply(keys, symbols);
	  }

	  return keys;
	}

	function _objectSpread2(target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i] != null ? arguments[i] : {};

	    if (i % 2) {
	      ownKeys(Object(source), true).forEach(function (key) {
	        _defineProperty(target, key, source[key]);
	      });
	    } else if (Object.getOwnPropertyDescriptors) {
	      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
	    } else {
	      ownKeys(Object(source)).forEach(function (key) {
	        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
	      });
	    }
	  }

	  return target;
	}

	function _inherits(subClass, superClass) {
	  if (typeof superClass !== "function" && superClass !== null) {
	    throw new TypeError("Super expression must either be null or a function");
	  }

	  subClass.prototype = Object.create(superClass && superClass.prototype, {
	    constructor: {
	      value: subClass,
	      writable: true,
	      configurable: true
	    }
	  });
	  if (superClass) _setPrototypeOf(subClass, superClass);
	}

	function _getPrototypeOf(o) {
	  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
	    return o.__proto__ || Object.getPrototypeOf(o);
	  };
	  return _getPrototypeOf(o);
	}

	function _setPrototypeOf(o, p) {
	  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
	    o.__proto__ = p;
	    return o;
	  };

	  return _setPrototypeOf(o, p);
	}

	function _isNativeReflectConstruct() {
	  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
	  if (Reflect.construct.sham) return false;
	  if (typeof Proxy === "function") return true;

	  try {
	    Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
	    return true;
	  } catch (e) {
	    return false;
	  }
	}

	function _assertThisInitialized(self) {
	  if (self === void 0) {
	    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	  }

	  return self;
	}

	function _possibleConstructorReturn(self, call) {
	  if (call && (typeof call === "object" || typeof call === "function")) {
	    return call;
	  }

	  return _assertThisInitialized(self);
	}

	function _createSuper(Derived) {
	  var hasNativeReflectConstruct = _isNativeReflectConstruct();

	  return function _createSuperInternal() {
	    var Super = _getPrototypeOf(Derived),
	        result;

	    if (hasNativeReflectConstruct) {
	      var NewTarget = _getPrototypeOf(this).constructor;

	      result = Reflect.construct(Super, arguments, NewTarget);
	    } else {
	      result = Super.apply(this, arguments);
	    }

	    return _possibleConstructorReturn(this, result);
	  };
	}

	function _toConsumableArray(arr) {
	  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
	}

	function _arrayWithoutHoles(arr) {
	  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
	}

	function _iterableToArray(iter) {
	  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
	}

	function _unsupportedIterableToArray(o, minLen) {
	  if (!o) return;
	  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
	  var n = Object.prototype.toString.call(o).slice(8, -1);
	  if (n === "Object" && o.constructor) n = o.constructor.name;
	  if (n === "Map" || n === "Set") return Array.from(o);
	  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
	}

	function _arrayLikeToArray(arr, len) {
	  if (len == null || len > arr.length) len = arr.length;

	  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

	  return arr2;
	}

	function _nonIterableSpread() {
	  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
	}

	var performance = window.performance;
	/**
	 * 参数格式化, 符合url方式
	 * @params {Object} {a: '123', age: '18'}
	 * @return {String} 'a=123&age=18'
	 */

	var stringifyParams = function stringifyParams(params, cb) {
	  var name;
	  var value;
	  var str = '';

	  for (name in params) {
	    value = params[name];
	    str += name + '=' + (typeof cb === 'function' ? cb(value, name) : value && _typeof(value) === 'object' && !Object.getPrototypeOf(value).slice ? JSON.stringify(value) : value) + '&';
	  }

	  return str.slice(0, -1);
	}; //获取元素的tagName, 兼容极低版本的问题

	var getTagName = function getTagName(el) {
	  if (!el) return '';
	  if (el === document) return 'html';
	  if (el.tagName) return el.tagName;
	  return el.outerHTML.match(/<([^>\s]+)/)[1];
	}; // 获取ua环境信息

	var uaInfo = function () {
	  var uaInfo = navigator.userAgent.match(/[^(\s]+(\s\([^)]+\))?/g);
	  return uaInfo;
	}(); // 测网速,返回单位为KB/sec的数值

	var tryCatchFunc = function tryCatchFunc(fn) {
	  return function () {
	    try {
	      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
	        args[_key] = arguments[_key];
	      }

	      return fn.apply(this, args);
	    } catch (error) {
	      console.warn('edith 内部报错', error);
	    }
	  };
	}; // 通用事件监听方法

	var edithAddEventListener = function edithAddEventListener(name, fn, useCapture) {
	  if (addEventListener) {
	    // 所有主流浏览器，除了 IE 8 及更早版本
	    addEventListener(name, tryCatchFunc(fn), useCapture);
	  } else if (attachEvent) {
	    // IE 8 及更早版本
	    attachEvent("on".concat(name), tryCatchFunc(fn));
	  }
	}; // 生成随机ID

	var getRandomID = function getRandomID() {
	  return ('' + getCurrentTime() * Math.random()).slice(0, 8);
	}; // 获取Dom的xpath

	var getXPath = function getXPath(element) {
	  var parentNode = element.parentNode;
	  if (parentNode === document) return "/html";
	  var tagName = getTagName(element).toLowerCase();
	  if (element === document.body) return "/html/".concat(tagName);
	  var ix = 0;
	  var siblings = parentNode.childNodes;

	  for (var i = 0; i < siblings.length; i++) {
	    var sibling = siblings[i];
	    if (sibling === element) return "".concat(getXPath(parentNode), "/").concat(tagName, "[").concat(ix + 1, "]");
	    if (sibling.nodeType === 1 && sibling.tagName === tagName) ix++;
	  }
	};
	var isIE8 = function () {
	  var ua = navigator.userAgent.toLowerCase();
	  var isIE = ua.indexOf('msie') > -1;
	  var safariVersion = isIE ? ua.match(/msie ([\d.]+)/)[1] : 100;
	  return safariVersion <= 8;
	}(); // 执行环境监测以及性能

	var getPerform = function getPerform() {
	  // const getEntriesByType = 'getEntriesByType'
	  return {
	    timing: performance.timing // chromeLoadingTiming: chrome && chrome.loadTimes(),
	    // entriesTiming: {
	    //   navigation: per[getEntriesByType]('navigation'),
	    //   paint: per[getEntriesByType]('paint'),
	    //   resource: per[getEntriesByType]('resource').filter(item => !item.name.match(/hm\.baidu\.com\/hm\.gif/)),
	    // },

	  };
	}; // Dom的outerHTML，超过200字符，中间用省略号代替

	var getOuterHTML = function getOuterHTML(errorTarget) {
	  var outerHTML = errorTarget.outerHTML; // 如果点击的内容过长，就截取上传

	  if (outerHTML.length > 200) outerHTML = outerHTML.substr(0, 100) + '... ...' + outerHTML.substr(-99);
	  return outerHTML;
	}; // 获取当前时间戳

	var getCurrentTime = function getCurrentTime() {
	  return new Date().getTime();
	}; // 判断是否是成功的请求状态码,不包含跨域，超时等请求

	var isSuccess = function isSuccess(status) {
	  return status >= 200 && status < 300;
	}; // 转换成字符串，除了函数

	var transToString = function transToString(p) {
	  return p && _typeof(p) === 'object' ? JSON.stringify(p) : p + '';
	};

	var loadCdnScript = function loadCdnScript(url, name) {
	  return new Promise(function (resolve, reject) {
	    edithAddEventListener('load', function () {
	      var script = document.createElement('script');
	      script.src = url;

	      script.onload = function () {
	        return resolve({
	          "default": window.Edith[name]
	        });
	      };

	      script.onerror = reject;
	      document.body.appendChild(script);
	    });
	  });
	};

	var removeHttpAndQuery = function removeHttpAndQuery(url) {
	  return url.replace(/^https?/, '').split('?')[0];
	}; // 判断是不是在白名单


	var isWhite = function isWhite(list, url) {
	  return list.find(function (i) {
	    return removeHttpAndQuery(i) === removeHttpAndQuery(url);
	  });
	}; // 避免map方法进入reject

	var getPromiseResult = function getPromiseResult(promises) {
	  var handlePromise = Promise.all(promises.map(function (fn) {
	    return fn["catch"] ? fn["catch"](function (err) {
	      return 0;
	    }) : fn;
	  }).filter(Boolean));
	  return handlePromise;
	}; // 页面打开的时间

	var startTiming = function startTiming() {
	  return performance.timing && performance.timing.navigationStart || getCurrentTime();
	}; // 获取当前相对于页面打开时的时间戳

	var getTimeStamp = function getTimeStamp() {
	  return getCurrentTime() - startTiming();
	};
	var isFunction = function isFunction(fn) {
	  return typeof fn === 'function';
	};

	var xmlhttp = null;
	var root = '/';

	var getPromise = function getPromise(xmlhttp, callback) {
	  return new Promise(function (resolve, reject) {
	    xmlhttp.onreadystatechange = function () {
	      if (xmlhttp.readyState !== 4) return;

	      if (xmlhttp.status === 200) {
	        // console.log(xmlhttp.responseText)
	        var res = {};

	        try {
	          res = JSON.parse(xmlhttp.responseText);
	        } catch (e) {
	          res = xmlhttp.responseText;
	        }

	        resolve(res);
	      } else if (xmlhttp.status > 399) {
	        reject(xmlhttp.responseText);
	      }
	    };

	    callback();
	  });
	};

	var request = {
	  setRoot: function setRoot(host) {
	    root = host;
	  },
	  get: function get(url) {
	    return function () {
	      var parmas = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	      xmlhttp = new XMLHttpRequest();
	      return getPromise(xmlhttp, function () {
	        xmlhttp.open('GET', "".concat(root).concat(url, "?").concat(stringifyParams(parmas)), true); // xmlhttp.withCredentials = true;

	        xmlhttp.send();
	      });
	    };
	  },
	  post: function post(url) {
	    return function () {
	      var parmas = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	      xmlhttp = new XMLHttpRequest();

	      var fn = function fn() {
	        xmlhttp.open('POST', "".concat(root).concat(url), true);
	        xmlhttp.setRequestHeader('Content-type', 'application/json;charset=utf-8'); // xmlhttp.withCredentials = true;

	        xmlhttp.send(JSON.stringify(parmas));
	      };

	      {
	        return getPromise(xmlhttp, fn);
	      }
	    };
	  }
	};

	var serviceRoot =  'https://event-edith.op-center.cn' ; // 存储用户行为的本地数据key

	var PROMISE_TIMEOUT = 500; // 默认请求白名单，不记录不报错

	var ajaxWhiteList = ["".concat(serviceRoot, "/v1/monitor/add"), "".concat(serviceRoot, "/v1/upload/test-img")]; // 状态

	var EDITH_STATUS = {
	  INIT: 'INIT',
	  // init阶段
	  WILL_MOUNT: 'WILL_MOUNT',
	  // 即将mount阶段 （自检，安装插件）
	  DID_MOUNT: 'DID_MOUNT',
	  // mounted阶段
	  CHECK_SELF: 'CHECK_SELF',
	  // 自检
	  INSTALL_PLUGIN: 'INSTALL_PLUGIN',
	  // 安装插件
	  LISTENING: 'LISTENING',
	  // 错误监听中
	  COLLECTING: 'COLLECTING',
	  // 错误收集中
	  SLEEP: 'SLEEP' // 不监听事件和上传

	}; // 内置插件
	var cdnHost =  location.origin ; // 内置插件的cdn地址

	var innerPluginsCdn = {
	  breadcrumbs: {
	    link: "".concat(cdnHost, "/plugins/BreadcrumbsPlugin.js"),
	    name: 'BreadcrumbsPlugin'
	  },
	  network: {
	    link: "".concat(cdnHost, "/plugins/NetworkCheckPlugin.js"),
	    name: 'NetworkCheckPlugin'
	  },
	  redo: {
	    link: "".concat(cdnHost, "/plugins/RecordPlugin.js"),
	    name: 'RecordPlugin'
	  }
	};
	var remixProps = {
	  ajaxWhiteList: ajaxWhiteList,
	  linkWhiteList: Object.values(innerPluginsCdn).map(function (item) {
	    return item.link;
	  })
	};

	// 接口文档： http://apidoc.csinke.cn/project/lmiSmNmmge.html
	request.setRoot(serviceRoot);
	var reportDebug = request.post('/v1/monitor/add'); //上报

	var measureBWSimple = request.get('/v1/upload/test-img'); //测试网速

	{
	  var postEnv = request.post('/v1/apikey-env/update'); //上报

	  window.postEnv = function () {
	    postEnv({
	      apiKey: 'YXBpS2V5MTU5Mzc3Mzg1Ng',
	      env: 'test',
	      url: 'etdith',
	      id: '19'
	    }).then(function (res) {// console.log(res)
	    })["catch"](function (e) {});
	  };
	}

	var remix = ['linkWhiteList', 'ajaxWhiteList'];

	var _Edith = /*#__PURE__*/function () {
	  function _Edith(props) {
	    _classCallCheck(this, _Edith);

	    this.state = {};
	    this.life = '';
	  }

	  _createClass(_Edith, [{
	    key: "$life",
	    value: function $life(status) {
	      this.life = status;
	    } // change life

	  }, {
	    key: "init",
	    value: function init(nextState) {
	      var _this = this;

	      if (this.life) return console.warn('只需要初始化一次');

	      var _ref = nextState || {},
	          apiKey = _ref.apiKey,
	          silentDev = _ref.silentDev,
	          plugins = _ref.plugins;

	      if (!nextState || !apiKey) {
	        return console.warn('请传入项目的apiKey');
	      }

	      this.$life(EDITH_STATUS.INIT);
	      if (silentDev && location.host.match(/^localhost|^\d+\.\d+\./)) return this._sleep();

	      this._willMount(nextState);

	      this.plugins = plugins instanceof Array ? plugins.filter(Boolean) : [];
	      remix.forEach(function (key) {
	        _this[key] = [].concat(_toConsumableArray(remixProps[key]), _toConsumableArray(nextState[key] || []));
	      }); // will
	      // set config

	      var preState = this.state;
	      this.state = this.initSate = _objectSpread2(_objectSpread2({}, preState), {}, {
	        apiKey: apiKey
	      }); // did

	      this._didMount(this.state); // check


	      this._checkSelf().then(function () {
	        _this.$life(EDITH_STATUS.INSTALL_PLUGIN); // install plugns


	        _this._installPlugins().then(function () {
	          // star
	          _this._collecting(); // 加载插件立即初始化一次


	          if (isFunction(_this.pluginInstalled)) {
	            _this.pluginInstalled();
	          }

	          _this.$life(EDITH_STATUS.LISTENING);
	        });
	      })["catch"](function () {
	        return _this._sleep();
	      });
	    }
	  }, {
	    key: "setState",
	    value: function setState(nextState, byPlugins) {
	      if (this.life === EDITH_STATUS.COLLECTING && !byPlugins) return; // 收集错误信息阶段，只允许收集插件的相关信息

	      var preState = this.state;
	      this.state = _objectSpread2(_objectSpread2({}, preState), nextState);
	    }
	  }, {
	    key: "_willMount",
	    value: function _willMount() {
	      this.$life(EDITH_STATUS.WILL_MOUNT);

	      if (isFunction(this.willMount === 'function')) {
	        this.willMount();
	      }
	    }
	  }, {
	    key: "_didMount",
	    value: function _didMount() {
	      this.$life(EDITH_STATUS.DID_MOUNT);

	      if (isFunction(this.didMount)) {
	        this.didMount();
	      }
	    }
	  }, {
	    key: "_checkSelf",
	    value: function _checkSelf() {
	      var _this2 = this;

	      this.$life(EDITH_STATUS.CHECK_SELF);
	      return new Promise(function (resolve, reject) {
	        if (isFunction(_this2.checkSelf)) {
	          try {
	            _this2.checkSelf();
	          } catch (e) {
	            console.log('edith自检发生错误', e);
	            reject(e);
	          }
	        } else {
	          console.log('no check self parts');
	        }

	        resolve();
	      });
	    }
	  }, {
	    key: "_installPlugins",
	    value: function _installPlugins() {
	      var _this3 = this;

	      // 安装加载插件
	      return new Promise(function (resolve, reject) {
	        // console.log(this.plugins)
	        var promiseList = [];

	        _this3.plugins.forEach(function (plugin) {
	          if (typeof plugin === 'string') {
	            {
	              // 如果打包成cdn链接
	              var inner = innerPluginsCdn[plugin];

	              if (inner) {
	                promiseList.push(loadCdnScript(inner.link, inner.name));
	              }
	            }
	          } else promiseList.push(plugin);
	        });

	        getPromiseResult(promiseList).then(function (pluginList) {
	          pluginList = pluginList.map(function (item) {
	            return isFunction(item["default"]) ? new item["default"]() : item;
	          }); // 得到对应插件

	          pluginList.forEach(function (plugin) {
	            remix.forEach(function (key) {
	              // 混入插件内部定义的链接白名单和http白名单
	              _this3[key] = [].concat(_toConsumableArray(_this3[key]), _toConsumableArray(plugin[key] || []));
	            });
	          });
	          _this3.plugins = pluginList;
	          resolve();
	        });
	      });
	    }
	  }, {
	    key: "compilerCallback",
	    value: function compilerCallback(pluginName, subInfo) {
	      this.setState(_defineProperty({}, pluginName, subInfo), true);
	    }
	  }, {
	    key: "compiler",
	    value: function compiler(pluginName, fn) {
	      var compilerCallback = this.compilerCallback;
	      var that = this;
	      fn(this, function (subInfo) {
	        compilerCallback.call(that, pluginName, subInfo);
	      });
	    }
	  }, {
	    key: "_collecting",
	    value: function _collecting() {
	      var _this4 = this;

	      // 收集插件的数据,或用于插件数据初始化
	      this.plugins.forEach(function (plugin) {
	        if (!plugin.apply) return console.warn("Edith\u63D2\u4EF6[".concat(plugin.constructor.name, "]\u5FC5\u987B\u5B9E\u73B0apply\u65B9\u6CD5"));

	        try {
	          plugin.apply(_this4.compiler.bind(_this4));
	        } catch (e) {
	          console.log(e);
	        }
	      });
	    }
	  }, {
	    key: "_sleep",
	    value: function _sleep() {
	      this.$life(EDITH_STATUS.SLEEP); // 不上报，不检测

	      this.$life = function () {};

	      if (isFunction(this.sleep)) {
	        this.sleep();
	      }

	      this.$handleCollect = function () {}; // 停止上传

	    } // 上报

	  }, {
	    key: "$handleCollect",
	    value: function $handleCollect() {
	      var _this5 = this;

	      if (this.life !== EDITH_STATUS.LISTENING) return; // 收集错误信息过程中不上报

	      this.$life(EDITH_STATUS.COLLECTING);
	      setTimeout(function () {
	        // 在所有队列后执行错误，避免点击立即出发的报错，没有记录点击事件
	        _this5._collecting();

	        var parmas = _objectSpread2({}, _this5.state);

	        reportDebug(parmas);
	        _this5.state = _this5.initSate; //上报完成去掉

	        _this5.$life(EDITH_STATUS.LISTENING);
	      }, 0);
	    }
	  }]);

	  return _Edith;
	}();

	var eventTrigger = function eventTrigger(event) {
	  window.dispatchEvent(new CustomEvent(event, {
	    detail: this
	  }));
	}; // 组合 参数

	var getErrorInfo = function getErrorInfo(err) {
	  return {
	    type: err._type || err.type,
	    // 错误的类型，如httpError
	    name: (err.name || err.message && err.message.split(':')[0] || err.type).replace(/^Uncaught\s/, ''),
	    // 错误信息的名称
	    message: err.message || err.description || '',
	    // 错误信息的内容
	    extraInfo: err.extraInfo || null,
	    stacktrace: err.error && err.error.stack,
	    // 错误的执行栈
	    target: err._target,
	    timeStamp: err.timeStamp,
	    title: document.title,
	    // 报错页面的标题
	    referrer: document.referrer,
	    // 从哪个页面跳转过来
	    url: location.href,
	    userAgent: navigator.userAgent,
	    columnNumber: err.colno,
	    lineNumber: err.lineno,
	    performance: getPerform() // locale: navigator.browserLanguage || navigator.language,
	    // severity: err.severity,
	    // appVersion: navigator.appVersion, // js版本号
	    // notifierVersion: '1.0.0', // 通知的版本号
	    // revideoVersion: '', // 回放插件的版本号 
	    // releaseStage: '', // 错误发生的环境，production| development
	    // time: +new Date(), // 错误发生的时间戳

	  };
	};

	var customEventPolyfill = function customEventPolyfill() {
	  if (isFunction(CustomEvent)) return false;

	  function CustomEvent(event, params) {
	    params = params || {
	      bubbles: false,
	      cancelable: false,
	      detail: undefined
	    };
	    var evt = document.createEvent('CustomEvent');
	    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
	    return evt;
	  }

	  CustomEvent.prototype = Event.prototype;
	  window.CustomEvent = CustomEvent;
	}; // 封装XMLHttpRequest，为捕获ajax请求增加自定义事件, 以及内部方法封装，以拿到更多参数
	// xhr.getAllResponseHeaders()  响应头信息
	// xhr.requestHeader            请求头信息
	// xhr.responseURL              请求的地址
	// xhr.responseText             响应内容
	// xhr.originUrl                请求的原始参数地址
	// xhr.body                     post参数，（get参数在url上面）


	var xhrProxy = function xhrProxy() {
	  var ajaxEvents = {
	    abort: 'ajaxAbort',
	    // 请求中止
	    error: 'ajaxError',
	    // 请求错误
	    // load: 'ajaxLoad', // 请求加载
	    // loadstart: 'ajaxLoadStart', // 请求加载开始
	    progress: 'ajaxProgress',
	    // 请求中
	    timeout: 'ajaxTimeout',
	    // 请求超时事件
	    loadend: 'ajaxLoadEnd' // 请求加载结束
	    // readystatechange: 'ajaxReadyStateChange', // 请求状态变化

	  }; // const uploadEvents = { // 上传事件
	  //   loadstart: 'uploadStart', // 请求加载开始
	  //   progress: 'uploadProgress', // 请求中
	  //   load: 'upload', // 请求加载
	  //   loadend: 'uploadEnd', // 请求加载结束
	  // }

	  var XHR = window.XMLHttpRequest;
	  var spelEvents = ['error', 'timeout', 'abort'];

	  function XMLHttpRequest() {
	    var realXHR = new XHR();
	    var isException = false;
	    Object.keys(ajaxEvents).forEach(function (eventName) {
	      realXHR.addEventListener(eventName, function (e) {
	        eventTrigger.call(this, ajaxEvents[eventName]);

	        if (eventName === 'loadend') {
	          if (!isSuccess(this.status) && !isException) {
	            // 判断状态码,是否是成功的请求,而且不是已经报错了的请求
	            eventTrigger.call(this, ajaxEvents['error']);
	          }
	        }

	        isException || (isException = spelEvents.indexOf(eventName) >= 0);
	      }, false);
	    }); // Object.keys(uploadEvents).forEach(eventName => {
	    //   realXHR.upload.addEventListener(eventName,
	    //     function () {
	    //       eventTrigger.call(this, uploadEvents[eventName]);
	    //     }, false);
	    // })
	    // 封装send方法

	    var send = realXHR.send;

	    realXHR.send = function () {
	      for (var _len = arguments.length, arg = new Array(_len), _key = 0; _key < _len; _key++) {
	        arg[_key] = arguments[_key];
	      }

	      send.apply(realXHR, arg);
	      realXHR.body = arg[0];
	    }; // 封装open方法


	    var open = realXHR.open;

	    realXHR.open = function () {
	      for (var _len2 = arguments.length, arg = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
	        arg[_key2] = arguments[_key2];
	      }

	      open.apply(realXHR, arg);
	      realXHR.method = arg[0];
	      realXHR.originUrl = arg[1];
	      realXHR.async = arg[2];
	      realXHR.startTime = getCurrentTime();
	      realXHR.endTime = getCurrentTime();
	      eventTrigger.call(realXHR, 'ajaxOpen');
	    }; // 封装setRequestHeader方法


	    var fn = 'setRequestHeader';
	    var setRequestHeader = realXHR[fn];
	    realXHR.requestHeader = {};

	    realXHR[fn] = function (name, value) {
	      realXHR.requestHeader[name] = value;
	      setRequestHeader.call(realXHR, name, value);
	    };

	    return realXHR;
	  }

	  window.XMLHttpRequest = XMLHttpRequest;
	}; // 封装fetch


	var fetchProxy = function fetchProxy() {
	  //拦截原始的fetch方法
	  var oldFetchfn = window.fetch;
	  if (!oldFetchfn) return;

	  window.fetch = function () {
	    var now = getCurrentTime();

	    for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
	      args[_key3] = arguments[_key3];
	    }

	    var options = _objectSpread2({
	      url: args[0],
	      method: 'GET',
	      body: null,
	      headers: {},
	      status: 0,
	      statusText: '',
	      startTime: now,
	      endTime: now,
	      timeStamp: now,
	      originUrl: args[0],
	      _eid: getRandomID(),
	      getAllResponseHeaders: function getAllResponseHeaders() {
	        return {};
	      }
	    }, args[1]);

	    eventTrigger.call({
	      options: options
	    }, 'fetchStart');
	    return oldFetchfn.apply(this, args).then(function (res) {
	      res.options = options;

	      if (!isSuccess(res.status)) {
	        // 判断状态码。是否是成功的请求
	        eventTrigger.call({
	          options: options
	        }, 'fetchError');
	      }

	      eventTrigger.call({
	        options: options
	      }, 'fetchEnd');
	      return res;
	    }, function (err) {
	      err.options = options;
	      eventTrigger.call({
	        options: options
	      }, 'fetchError');
	    });
	  };
	};

	function registBaseEvent () {
	  customEventPolyfill();
	  xhrProxy(); // 给XHR注册事件

	  fetchProxy(); // 给fetch注册事件
	}
	/**
	 * 
	//封装WebSocket
	;(function() {
	  const oldWs = WebSocket; 
	  if(!oldWs) return
	  const wsEvents = {
	    open: 'webSocketOpen',
	    error: 'webSocketError',
	    close: 'webSocketClose',
	  }
	  WebSocket = function (url, protocol) {
	    const ws = new oldWs(url, protocol);
	    const options = {
	      url,
	      protocol: protocol || ''
	    }
	    eventTrigger.call({ target: ws }, 'webSocketStart', { options })
	    
	    Object.keys(wsEvents).forEach(eventName => {
	      ws.addEventListener(eventName,
	        function (event) {
	          eventTrigger.call(event, wsEvents[eventName]);
	        }, false);
	    })
	    return ws
	  }
	})()

	 */

	var EdithClass = /*#__PURE__*/function (_Edith2) {
	  _inherits(EdithClass, _Edith2);

	  var _super = _createSuper(EdithClass);

	  function EdithClass() {
	    var _this;

	    _classCallCheck(this, EdithClass);

	    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }

	    _this = _super.call.apply(_super, [this].concat(args));
	    _this.errorHandleFunc = {
	      resourceError: function resourceError(errorEvent) {
	        var errorTarget = errorEvent.target; // 元素错误，比如引用资源报错，只是普通事件，不是ErrorEvent；html标签的资源报错，暂时不知道发生在哪一行。

	        var tagName = getTagName(errorTarget).toLowerCase();
	        var sourceUrl = '';

	        if (tagName === 'link') {
	          sourceUrl = errorTarget.href;
	        } else sourceUrl = errorTarget.src;

	        if (isWhite(_this.linkWhiteList, sourceUrl)) return; // 白名单不做上报

	        errorEvent.message = sourceUrl;
	        errorEvent.name = errorEvent._type = 'resourceError';
	        errorEvent._target = {
	          tagName: tagName,
	          className: errorTarget.className,
	          id: errorTarget.id,
	          outerHTML: getOuterHTML(errorTarget),
	          xPath: getXPath(errorTarget)
	        };
	        return errorEvent;
	      },
	      ajaxError: function ajaxError(errorEvent) {
	        errorEvent._type = 'httpError';
	        errorEvent.name = 'ajaxError';
	        var xhr = errorEvent.detail;
	        var method = xhr.method,
	            body = xhr.body,
	            originUrl = xhr.originUrl,
	            startTime = xhr.startTime,
	            endTime = xhr.endTime,
	            responseText = xhr.responseText,
	            statusText = xhr.statusText,
	            status = xhr.status,
	            requestHeader = xhr.requestHeader;
	        if (isWhite(_this.ajaxWhiteList, originUrl)) return; //白名单接口不记录

	        errorEvent.extraInfo = {
	          elapsedTime: endTime - startTime,
	          requestHeader: requestHeader,
	          responseHeader: xhr.getAllResponseHeaders() || {},
	          responseText: responseText,
	          status: status,
	          statusText: statusText,
	          method: method,
	          body: body,
	          url: originUrl
	        };
	        return errorEvent;
	      },
	      fetchError: function fetchError(errorEvent) {
	        var options = errorEvent.detail.options;
	        if (isWhite(_this.ajaxWhiteList, options.url)) return; //白名单接口不记录

	        errorEvent._type = 'httpError';
	        errorEvent.name = errorEvent.message = 'fetchError';
	        errorEvent.error = errorEvent.detail;
	        errorEvent.extraInfo = _objectSpread2({
	          elapsedTime: options.endTime - options.startTime
	        }, options);
	        return errorEvent;
	      },
	      error: function error(errorEvent) {
	        var errorTarget = errorEvent.target;

	        if (errorTarget !== window) {
	          // 资源加载错误
	          return _this.errorHandleFunc['resourceError'](errorEvent);
	        }

	        return errorEvent;
	      }
	    };
	    return _this;
	  }

	  _createClass(EdithClass, [{
	    key: "didMount",
	    value: function didMount() {
	      registBaseEvent(); // 注册基础事件
	    }
	  }, {
	    key: "checkSelf",
	    value: function checkSelf() {
	      // 自定义自检方法
	      this.handleError({
	        type: 'error',
	        target: window
	      });
	      this.handleError({
	        type: 'error',
	        target: {
	          src: '',
	          tagName: 'a',
	          outerHTML: '',
	          parentNode: document
	        }
	      });
	      this.handleError({
	        type: 'ajaxError',
	        detail: {
	          originUrl: '',
	          getAllResponseHeaders: function getAllResponseHeaders() {}
	        }
	      });
	      this.handleError({
	        type: 'fetchError',
	        detail: {
	          options: {
	            url: ''
	          }
	        }
	      });
	    }
	  }, {
	    key: "pluginInstalled",
	    value: function pluginInstalled() {
	      // 全局error监听，js报错，包括资源加载报错
	      edithAddEventListener('error', this.handleError.bind(this), true); // 全局promise no catch error监听，捕获未处理的promise异常
	      // 支持性不太好,IE不支持,低版本浏览器也不支持

	      edithAddEventListener('unhandledrejection', this.handlePromise.bind(this)); // 网络请求的err

	      edithAddEventListener('ajaxError', this.handleError.bind(this));
	      edithAddEventListener('ajaxTimeout', this.handleError.bind(this));
	      edithAddEventListener('fetchError', this.handleError.bind(this));
	    } //  捕获到错误时的回调函数

	  }, {
	    key: "handleError",
	    value: function handleError(errorEvent) {
	      errorEvent = this.errorHandleFunc[errorEvent.type](errorEvent);
	      var event = getErrorInfo(errorEvent);
	      if (this.life !== EDITH_STATUS.LISTENING) return;
	      this.setState(_objectSpread2(_objectSpread2({}, this.state), event));
	      this.$handleCollect();
	    } // 处理primise报错，设置了一个修复机制

	  }, {
	    key: "handlePromise",
	    value: function handlePromise(e, pro) {
	      var _this2 = this;

	      var promiseTimer = setTimeout(tryCatchFunc(function () {
	        var reason = e.reason;
	        e.message = transToString(reason);
	        e.name = 'unhandledrejection';
	        e._type = 'error';
	        var event = getErrorInfo(e);

	        _this2.setState(_objectSpread2(_objectSpread2({}, _this2.state), event));

	        _this2.$handleCollect();
	      }), PROMISE_TIMEOUT);
	      edithAddEventListener('rejectionhandled', tryCatchFunc(function (event, promise) {
	        if (pro === promise) {
	          if (promiseTimer) clearTimeout(promiseTimer);
	          promiseTimer = null;
	        }
	      }));
	    }
	  }, {
	    key: "debug",
	    value: function debug(name, message) {
	      this.setState(_objectSpread2(_objectSpread2({}, this.state), getErrorInfo({
	        name: name,
	        message: message,
	        timeStamp: getTimeStamp(),
	        type: 'customError'
	      })));
	      this.$handleCollect();
	    }
	  }]);

	  return EdithClass;
	}(_Edith);

	var Edith = new EdithClass();
	window.Edith = Edith;

	return Edith;

}());
