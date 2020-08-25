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

	var ajaxWhiteList = ["".concat(serviceRoot, "/v1/monitor/add"), "".concat(serviceRoot, "/v1/upload/test-img")]; // 状态
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

	var getOuterHTML = function getOuterHTML(errorTarget) {
	  var outerHTML = errorTarget.outerHTML; // 如果点击的内容过长，就截取上传

	  if (outerHTML.length > 200) outerHTML = outerHTML.substr(0, 100) + '... ...' + outerHTML.substr(-99);
	  return outerHTML;
	}; // 获取当前时间戳

	var getCurrentTime = function getCurrentTime() {
	  return new Date().getTime();
	}; // 判断是否是成功的请求状态码,不包含跨域，超时等请求

	var startTiming = function startTiming() {
	  return performance.timing && performance.timing.navigationStart || getCurrentTime();
	}; // 获取当前相对于页面打开时的时间戳

	var getTimeStamp = function getTimeStamp() {
	  return getCurrentTime() - startTiming();
	};

	var eventTrigger = function eventTrigger(event) {
	  window.dispatchEvent(new CustomEvent(event, {
	    detail: this
	  }));
	}; // 组合 参数

	var RECORD_COUNT = 20;
	var ajaxWhiteList$1 = [];

	var navigationProxy = function navigationProxy() {
	  if (!history.replaceState && history.pushState) return;

	  function proxyState(prop, fn) {
	    return function () {
	      for (var _len = arguments.length, arg = new Array(_len), _key = 0; _key < _len; _key++) {
	        arg[_key] = arguments[_key];
	      }

	      arg[2] && fn && eventTrigger.call({
	        oldURL: location.href,
	        newURL: arg[2],
	        method: prop
	      }, 'navigationChange');
	      return fn.apply(this, arg);
	    };
	  } // 封装history.pushState


	  history.pushState = proxyState('pushState', history['pushState']); // 封装history.replaceState

	  history.replaceState = proxyState('replaceState', history['replaceState']);
	};

	var breadcrumbs = []; // 自定义add方法来添加数据，并且超过数量限制后自动会移除最早的记录,同时支持根据唯一id，选择覆盖还是添加操作

	breadcrumbs.add = function (data) {
	  var index = breadcrumbs.findIndex(function (i) {
	    return data.eid && i.eid === data.eid;
	  }); // 如果有相同的eid，代表只需要修改

	  if (index >= 0) return breadcrumbs.splice(index, 1, _objectSpread2(_objectSpread2({}, breadcrumbs[index]), data));
	  if (breadcrumbs.length >= RECORD_COUNT) breadcrumbs.shift();
	  breadcrumbs.push(_objectSpread2({
	    eid: getRandomID()
	  }, data));
	};
	/**
	 * 用户交互行为记录监控
	 */


	var addActionRecord = function addActionRecord(type) {
	  return function (event) {
	    // 记录用户点击元素的行为数据
	    var errorTarget = event.target; // target支持性好

	    var tagName = getTagName(errorTarget).toLowerCase();
	    var className = errorTarget.className;
	    var id = errorTarget.id;
	    var outerHTML = getOuterHTML(errorTarget);
	    var record = {
	      type: type,
	      time: getCurrentTime(),
	      timeStamp: event.timeStamp,
	      page: {
	        url: location.href,
	        title: document.title
	      },
	      detail: {
	        className: className,
	        id: id,
	        outerHTML: outerHTML,
	        tagName: tagName,
	        xPath: getXPath(errorTarget)
	      }
	    };
	    breadcrumbs.add(record);
	  };
	};

	var addUrlRecord = function addUrlRecord(method) {
	  return function (event) {
	    var record = {
	      type: 'navigation',
	      time: getCurrentTime(),
	      method: method || event.detail.method,
	      timeStamp: event.timeStamp,
	      detail: {
	        from: {
	          url: event.oldURL || event.detail.oldURL,
	          title: document.title
	        },
	        to: {
	          url: event.newURL || event.detail.newURL
	        }
	      }
	    };
	    breadcrumbs.add(record);
	  };
	};
	/**
	 * 添加http请求记录监控，包括fetch
	 */


	var addHttpRecord = function addHttpRecord(xhr) {
	  var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'XMLHttpRequest';
	  var method = xhr.method,
	      status = xhr.status,
	      statusText = xhr.statusText,
	      responseURL = xhr.responseURL,
	      originUrl = xhr.originUrl,
	      _xhr$body = xhr.body,
	      body = _xhr$body === void 0 ? null : _xhr$body,
	      requestHeader = xhr.requestHeader,
	      startTime = xhr.startTime,
	      endTime = xhr.endTime,
	      _eid = xhr._eid,
	      timeStamp = xhr.timeStamp;
	  var elapsedTime = endTime - startTime; // 请求耗时

	  if (ajaxWhiteList$1.indexOf(originUrl && originUrl.split('?')[0]) >= 0) return; //白名单接口不记录

	  var record = {
	    eid: _eid,
	    type: type,
	    time: getCurrentTime(),
	    timeStamp: timeStamp,
	    page: {
	      url: location.href,
	      title: document.title
	    },
	    elapsedTime: elapsedTime,
	    detail: {
	      method: method,
	      // 请求方法
	      status: status,
	      // 状态码
	      body: body,
	      // post请求的body
	      requestHeader: requestHeader,
	      responseHeader: xhr.getAllResponseHeaders() || {},
	      // 这个方法不能解构出来赋值
	      statusText: statusText,
	      // 状态
	      responseURL: responseURL,
	      // 接口响应地址
	      originUrl: originUrl // 请求的原始参数地址

	    }
	  };
	  if (!timeStamp) delete record.timeStamp;
	  breadcrumbs.add(record);
	}; // 记录ajax请求


	var recordAjax = function recordAjax() {
	  edithAddEventListener('ajaxOpen', function (e) {
	    var xhr = e.detail;
	    xhr._eid = getRandomID();
	    xhr.timeStamp = e.timeStamp;
	    addHttpRecord(xhr);
	  });
	  edithAddEventListener('ajaxProgress', function (e) {
	    var xhr = e.detail; // console.log(xhr)

	    xhr.endTime = getCurrentTime(); // 不断更新状态

	    xhr.timeStamp = 0;
	    addHttpRecord(xhr);
	  }); // 当XHR发生 abort / timeout / error 时事件触，loadend是最后触发的

	  edithAddEventListener('ajaxLoadEnd', function (e) {
	    var xhr = e.detail;
	    xhr.endTime = getCurrentTime();
	    xhr.timeStamp = 0;
	    addHttpRecord(xhr);
	  });
	}; // getAllResponseHeaders没有


	var recordFetch = function recordFetch() {
	  edithAddEventListener('fetchStart', function (e) {
	    var options = e.detail.options;

	    var xhr = _objectSpread2(_objectSpread2({}, options), {}, {
	      timeStamp: e.timeStamp,
	      requestHeader: options.headers
	    }); // console.log(xhr)


	    addHttpRecord(xhr, 'fetchRequest');
	  });
	  edithAddEventListener('fetchEnd', function (e) {
	    var _e$detail = e.detail,
	        options = _e$detail.options,
	        url = _e$detail.url;

	    var xhr = _objectSpread2(_objectSpread2({}, options), {}, {
	      responseURL: url,
	      requestHeader: options.headers,
	      endTime: getCurrentTime(),
	      timeStamp: 0
	    }, e.detail); // console.log('fetchEnd=>', xhr.status, e.detail)


	    addHttpRecord(xhr, 'fetchRequest');
	  });
	};

	var behaviorRecord = function behaviorRecord() {
	  edithAddEventListener('click', addActionRecord('click'), true);
	  recordAjax();
	  recordFetch(); // recordWebSocket() // 监听webSocket

	  if (isIE8) {
	    var url = location.href;
	    setInterval(function () {
	      if (url != location.href) {
	        addUrlRecord('intervalCheck')({
	          oldURL: url,
	          newURL: location.href,
	          timeStamp: getTimeStamp() // 模拟时间戳

	        });
	        url = location.href;
	      }
	    }, 250);
	  } else {
	    edithAddEventListener('hashchange', addUrlRecord('hashchange'));
	    edithAddEventListener('navigationChange', addUrlRecord());
	  }
	};

	var BreadcrumbsPlugin = /*#__PURE__*/function () {
	  function BreadcrumbsPlugin() {

	    _classCallCheck(this, BreadcrumbsPlugin);

	    this.name = 'breadcrumbs';
	    this.state = {};
	  }

	  _createClass(BreadcrumbsPlugin, [{
	    key: "apply",
	    value: function apply(compiler) {
	      var that = this;
	      compiler(this.name, function (_ref, callback) {
	        var state = _ref.state,
	            _ajaxWhiteList = _ref.ajaxWhiteList;

	        if (!state[that.name]) {
	          ajaxWhiteList$1 = _ajaxWhiteList;
	          navigationProxy(); // 自定义路由跳转事件

	          behaviorRecord();
	        }

	        callback(breadcrumbs);
	      });
	    }
	  }]);

	  return BreadcrumbsPlugin;
	}();

	if (!window.Edith) window.Edith = {};
	window.Edith.BreadcrumbsPlugin = BreadcrumbsPlugin;

	return BreadcrumbsPlugin;

}());
