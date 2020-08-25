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

	var document = _global.document;
	// typeof document.createElement is 'object' in old IE
	var is = _isObject(document) && _isObject(document.createElement);
	var _domCreate = function (it) {
	  return is ? document.createElement(it) : {};
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

	var uaInfo = function () {
	  var uaInfo = navigator.userAgent.match(/[^(\s]+(\s\([^)]+\))?/g);
	  return uaInfo;
	}(); // 测网速,返回单位为KB/sec的数值
	// https://juejin.im/post/5b4de6b7e51d45190d55340b

	var testNetworkSpeed = function testNetworkSpeed() {
	  var n = navigator;
	  var c = 'connection';
	  var d = 'downlink';

	  if (n[c] && n[c][d]) {
	    // 在 Chrome65+ 的版本中，有原生的方法
	    return n[c][d] * 1024 / 8; //单位为KB/sec
	  }
	}; // 获取网络类型
	// https://juejin.im/post/5b4de6b7e51d45190d55340b

	var getNetworkType = function getNetworkType() {
	  var n = navigator;
	  var c = 'connection';
	  var e = 'effectiveType';

	  if (n[c] && n[c][e]) {
	    // 在 Chrome65+ 的版本中，有原生的方法
	    return n[c][e]; //单位为KB/sec
	  }

	  return '';
	}; // 通过发起http请求，测试网络速度, 定时调用回调，参数为单位为KB/sec的数值

	var measureBW = function measureBW(fn, time) {
	  var test = function test(n) {
	    var startTime = getCurrentTime();
	    measureBWSimple({
	      t: Math.random()
	    }).then(function (res) {
	      var fileSize = res.length;
	      var endTime = getCurrentTime();
	      var speed = fileSize / ((endTime - startTime) / 1000) / 1024;
	      fn && n && fn(Math.floor(speed));
	      if (n >= time) return;
	      test(++n);
	    })["catch"](function (e) {});
	  };

	  test(0);
	}; // 事件阻止

	var eventPresent = function eventPresent(e) {
	  if (!e) return;
	  var func = ['preventDefault', 'stopPropagation'];
	  func.forEach(function (item) {
	    return e[item] && e[item]();
	  });
	  e.cancelBubble = true;
	}; // 获取延迟,通过js加载一张1x1的极小图片，来测试图片加载的所用的时长

	var measureDelay = function measureDelay(fn, count) {
	  count = count || 1;
	  var n = 0,
	      timeid;

	  var ld = function ld() {
	    var t = getCurrentTime(),
	        img = new Image();

	    img.onload = function () {
	      var tcp = getCurrentTime() - t;
	      n++;
	      fn(tcp); // 存储延迟回调

	      if (n < count) timeid = setTimeout(ld, 1000);
	    };

	    img.src = '//hm.baidu.com/hm.gif?' + Math.random();
	    img.onerror = tryCatchFunc(eventPresent);
	  };

	  var img_start = new Image();
	  img_start.onerror = tryCatchFunc(eventPresent);
	  img_start.onload = ld;
	  img_start.src = '//hm.baidu.com/hm.gif?' + Math.random();
	};

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
	var isIE8 = function () {
	  var ua = navigator.userAgent.toLowerCase();
	  var isIE = ua.indexOf('msie') > -1;
	  var safariVersion = isIE ? ua.match(/msie ([\d.]+)/)[1] : 100;
	  return safariVersion <= 8;
	}(); // 执行环境监测以及性能

	var getCurrentTime = function getCurrentTime() {
	  return new Date().getTime();
	}; // 判断是否是成功的请求状态码,不包含跨域，超时等请求
	var getAarege = function getAarege(arr) {
	  var total = arr.reduce(function (total, item) {
	    return total + item;
	  }, 0);
	  return arr.length === 0 ? -1 : total / arr.length;
	}; // 异步加载插件的scripts标签，封装成promise

	var NetworkCheckPlugin = /*#__PURE__*/function () {
	  function NetworkCheckPlugin() {
	    _classCallCheck(this, NetworkCheckPlugin);

	    this.name = 'network';
	    this.state = {
	      speed: -1,
	      delays: -1,
	      netWorkType: getNetworkType()
	    };
	    this.speeds = [];
	    this.delays = [];
	  } // 网络速度


	  _createClass(NetworkCheckPlugin, [{
	    key: "checkNetSpeed",
	    value: function checkNetSpeed() {
	      var _this = this;

	      var speed = testNetworkSpeed();
	      if (speed) return this.speeds.push(speed);
	      measureBW(function (speed) {
	        return _this.speeds.push(speed);
	      }, 3);
	    }
	  }, {
	    key: "checkDelay",
	    value: function checkDelay() {
	      var _this2 = this;

	      measureDelay(function (tcp) {
	        return _this2.delays.push(tcp);
	      }, 5);
	    }
	  }, {
	    key: "startCheck",
	    value: function startCheck() {
	      var rIC = window.requestIdleCallback;

	      if (!rIC) {
	        setTimeout(this.checkDelay.bind(this), Math.random() * 6000 + 500); // 随机延后执行

	        return setTimeout(this.checkNetSpeed.bind(this), Math.random() * 7000 + 500);
	      } // 任务队列


	      var tasks = [this.checkDelay.bind(this), // 检测延迟
	      this.checkNetSpeed.bind(this) // 检测网速
	      ];

	      function myNonEssentialWork(deadline) {
	        // 如果帧内有富余的时间，或者超时
	        while ((deadline.timeRemaining() > 0 || deadline.didTimeout) && tasks.length > 0) {
	          tasks.shift()();
	        }

	        tasks.length > 0 && rIC(myNonEssentialWork);
	      }

	      rIC(myNonEssentialWork, {
	        timeout: 2000
	      });
	    }
	  }, {
	    key: "apply",
	    value: function apply(compiler) {
	      var that = this;
	      compiler(that.name, function (_ref, callback) {
	        var state = _ref.state;

	        if (!state[that.name]) {
	          that.startCheck.apply(that);
	        }

	        var netWorkType = that.state.netWorkType;
	        callback({
	          speed: getAarege(that.speeds),
	          delay: getAarege(that.delays),
	          netWorkType: netWorkType
	        });
	      });
	    }
	  }]);

	  return NetworkCheckPlugin;
	}();

	if (!window.Edith) window.Edith = {};
	window.Edith.NetworkCheckPlugin = NetworkCheckPlugin;

	return NetworkCheckPlugin;

}());
