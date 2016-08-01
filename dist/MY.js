(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/define-property"), __esModule: true };
},{"core-js/library/fn/object/define-property":4}],2:[function(require,module,exports){
"use strict";

exports.__esModule = true;

exports.default = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};
},{}],3:[function(require,module,exports){
"use strict";

exports.__esModule = true;

var _defineProperty = require("../core-js/object/define-property");

var _defineProperty2 = _interopRequireDefault(_defineProperty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      (0, _defineProperty2.default)(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();
},{"../core-js/object/define-property":1}],4:[function(require,module,exports){
require('../../modules/es6.object.define-property');
var $Object = require('../../modules/_core').Object;
module.exports = function defineProperty(it, key, desc){
  return $Object.defineProperty(it, key, desc);
};
},{"../../modules/_core":7,"../../modules/es6.object.define-property":20}],5:[function(require,module,exports){
module.exports = function(it){
  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
  return it;
};
},{}],6:[function(require,module,exports){
var isObject = require('./_is-object');
module.exports = function(it){
  if(!isObject(it))throw TypeError(it + ' is not an object!');
  return it;
};
},{"./_is-object":16}],7:[function(require,module,exports){
var core = module.exports = {version: '2.4.0'};
if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef
},{}],8:[function(require,module,exports){
// optional / simple context binding
var aFunction = require('./_a-function');
module.exports = function(fn, that, length){
  aFunction(fn);
  if(that === undefined)return fn;
  switch(length){
    case 1: return function(a){
      return fn.call(that, a);
    };
    case 2: return function(a, b){
      return fn.call(that, a, b);
    };
    case 3: return function(a, b, c){
      return fn.call(that, a, b, c);
    };
  }
  return function(/* ...args */){
    return fn.apply(that, arguments);
  };
};
},{"./_a-function":5}],9:[function(require,module,exports){
// Thank's IE8 for his funny defineProperty
module.exports = !require('./_fails')(function(){
  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
});
},{"./_fails":12}],10:[function(require,module,exports){
var isObject = require('./_is-object')
  , document = require('./_global').document
  // in old IE typeof document.createElement is 'object'
  , is = isObject(document) && isObject(document.createElement);
module.exports = function(it){
  return is ? document.createElement(it) : {};
};
},{"./_global":13,"./_is-object":16}],11:[function(require,module,exports){
var global    = require('./_global')
  , core      = require('./_core')
  , ctx       = require('./_ctx')
  , hide      = require('./_hide')
  , PROTOTYPE = 'prototype';

var $export = function(type, name, source){
  var IS_FORCED = type & $export.F
    , IS_GLOBAL = type & $export.G
    , IS_STATIC = type & $export.S
    , IS_PROTO  = type & $export.P
    , IS_BIND   = type & $export.B
    , IS_WRAP   = type & $export.W
    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
    , expProto  = exports[PROTOTYPE]
    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE]
    , key, own, out;
  if(IS_GLOBAL)source = name;
  for(key in source){
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if(own && key in exports)continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? ctx(out, global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function(C){
      var F = function(a, b, c){
        if(this instanceof C){
          switch(arguments.length){
            case 0: return new C;
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if(IS_PROTO){
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if(type & $export.R && expProto && !expProto[key])hide(expProto, key, out);
    }
  }
};
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library` 
module.exports = $export;
},{"./_core":7,"./_ctx":8,"./_global":13,"./_hide":14}],12:[function(require,module,exports){
module.exports = function(exec){
  try {
    return !!exec();
  } catch(e){
    return true;
  }
};
},{}],13:[function(require,module,exports){
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef
},{}],14:[function(require,module,exports){
var dP         = require('./_object-dp')
  , createDesc = require('./_property-desc');
module.exports = require('./_descriptors') ? function(object, key, value){
  return dP.f(object, key, createDesc(1, value));
} : function(object, key, value){
  object[key] = value;
  return object;
};
},{"./_descriptors":9,"./_object-dp":17,"./_property-desc":18}],15:[function(require,module,exports){
module.exports = !require('./_descriptors') && !require('./_fails')(function(){
  return Object.defineProperty(require('./_dom-create')('div'), 'a', {get: function(){ return 7; }}).a != 7;
});
},{"./_descriptors":9,"./_dom-create":10,"./_fails":12}],16:[function(require,module,exports){
module.exports = function(it){
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};
},{}],17:[function(require,module,exports){
var anObject       = require('./_an-object')
  , IE8_DOM_DEFINE = require('./_ie8-dom-define')
  , toPrimitive    = require('./_to-primitive')
  , dP             = Object.defineProperty;

exports.f = require('./_descriptors') ? Object.defineProperty : function defineProperty(O, P, Attributes){
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if(IE8_DOM_DEFINE)try {
    return dP(O, P, Attributes);
  } catch(e){ /* empty */ }
  if('get' in Attributes || 'set' in Attributes)throw TypeError('Accessors not supported!');
  if('value' in Attributes)O[P] = Attributes.value;
  return O;
};
},{"./_an-object":6,"./_descriptors":9,"./_ie8-dom-define":15,"./_to-primitive":19}],18:[function(require,module,exports){
module.exports = function(bitmap, value){
  return {
    enumerable  : !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable    : !(bitmap & 4),
    value       : value
  };
};
},{}],19:[function(require,module,exports){
// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = require('./_is-object');
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function(it, S){
  if(!isObject(it))return it;
  var fn, val;
  if(S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
  if(typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it)))return val;
  if(!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
  throw TypeError("Can't convert object to primitive value");
};
},{"./_is-object":16}],20:[function(require,module,exports){
var $export = require('./_export');
// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
$export($export.S + $export.F * !require('./_descriptors'), 'Object', {defineProperty: require('./_object-dp').f});
},{"./_descriptors":9,"./_export":11,"./_object-dp":17}],21:[function(require,module,exports){

'use strict';

var _config = require('./config.js');

var _config2 = _interopRequireDefault(_config);

var _version = require('./utils/version.js');

var _version2 = _interopRequireDefault(_version);

var _ua = require('./utils/ua.js');

var _ua2 = _interopRequireDefault(_ua);

var _appBridge = require('./utils/app-bridge.js');

var _appBridge2 = _interopRequireDefault(_appBridge);

var _Error = require('./utils/Error.js');

var _Error2 = _interopRequireDefault(_Error);

var _dateFormat = require('./utils/date-format.js');

var _dateFormat2 = _interopRequireDefault(_dateFormat);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MY = window.MY = window.MY || {};

MY.ua = _ua2.default;
MY.Version = _version2.default;
MY.appBridge = _appBridge2.default;
MY.Error = _Error2.default;
MY.dateFormat = _dateFormat2.default;

MY.isApp = _ua2.default.app;
MY.isDevApp = _ua2.default.app && _ua2.default.app.isDev;
MY.isAndroid = _ua2.default.system.Android;
MY.isiPhone = _ua2.default.system.iPhone;

var locationOrigin = location.origin;
var locationHost = location.host;

if (MY.isApp) {
    MY.version = _ua2.default.app.ver;
}

MY.locationOrigin = locationOrigin;
MY.locationHost = locationHost;

document.addEventListener('error', function (err) {
    if (err.target.tagName === 'IMG' || err.target.tagName === 'SCRIPT' || err.target.tagName === 'VIDEO' || err.target.tagName === 'AUDIO' || err.target.tagName === 'SOURCE' || err.target.tagName === 'LINK') {
        _Error2.default.onerror.call(err.target, err);
    }
}, true);

},{"./config.js":22,"./utils/Error.js":23,"./utils/app-bridge.js":24,"./utils/date-format.js":25,"./utils/ua.js":26,"./utils/version.js":27}],22:[function(require,module,exports){

'use strict';

module.exports = {
  RegExp: {
    isApp: /(Meiya(?:-dev)?)/,
    isDevApp: /Meiya-dev/,
    appVersion: /Meiya(?:-dev)?\/(\d+\.\d+\.\d+(?:\.\d+)?)\D/
  },
  ip: '104.236.190.8' };

},{}],23:[function(require,module,exports){

'use strict';

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _appBridge = require('./app-bridge');

var _appBridge2 = _interopRequireDefault(_appBridge);

var _config = require('../config.js');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Error = function () {
    function Error() {
        (0, _classCallCheck3.default)(this, Error);

        return this;
    }

    (0, _createClass3.default)(Error, [{
        key: 'onError',
        value: function onError(err) {
            var href = err.target.href;
            var src = err.target.src;

            src = src || href;

            if (!this.dataset.ip) {
                Error.queryIP(src).done(function (ip, host) {
                    this.dataset.ip = ip;

                    if (err.target.tagName === 'LINK') {
                        this.src = this.src.replace(host, ip);
                    } else {
                        this.href = this.href.replace(host, ip);
                    }
                }.bind(this));
            }
        }
    }, {
        key: 'queryIP',
        value: function queryIP(url) {
            var def = $.Deferred();
            var hostReg = /^https?:\/\/([^:\/\?#]+)/;
            var urlMatch = url.match(hostReg);

            if (urlMatch && urlMatch.length) {
                (function () {
                    var host = urlMatch[1];

                    _appBridge2.default.callHandler('query_ip', {
                        host: host
                    }, function (ret) {
                        def.resolve(ret.ip, host);
                    });
                })();
            }

            return def.promise();
        }
    }]);
    return Error;
}();

module.exports = new Error();

},{"../config.js":22,"./app-bridge":24,"babel-runtime/helpers/classCallCheck":2,"babel-runtime/helpers/createClass":3}],24:[function(require,module,exports){

'use strict';

var _ua = require('./ua.js');

var _ua2 = _interopRequireDefault(_ua);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function connectWebViewJavascriptBridge(callback) {
    if (window.WebViewJavascriptBridge) {
        callback(WebViewJavascriptBridge);
    } else {
        document.addEventListener('WebViewJavascriptBridgeReady', function () {
            callback(WebViewJavascriptBridge);
        }, false);
    }
}

function compat(action, data, callback) {
    switch (action) {
        case 'get_query_string':

            if (typeof callback === 'function') {
                var search = location.search.replace(/^\?/, ''),
                    hash = location.hash.replace(/^\#/, ''),
                    query = search + (search ? '#' : '') + hash;

                if (!_ua2.default.app) {
                    callback({ query_string: query });
                }
            }

            break;
    }
}

var api = {
    defaultHandler: function defaultHandler(message, responseCallback) {
        responseCallback('got');
    },

    send: function send(data, callback) {
        connectWebViewJavascriptBridge(function (bridge) {
            bridge.send(data, function (ret) {
                typeof callback === 'function' && callback(ret);
            });
        });
    },

    callHandler: function callHandler(action, data, callback) {
        if (typeof data === 'function') {
            callback = data;
            data = null;
        }

        compat.call(null, action, data, callback);

        connectWebViewJavascriptBridge(function (bridge) {
            bridge.callHandler(action, data, function (ret) {
                typeof callback === 'function' && callback(ret);
            });
        });
    },

    registerHandler: function registerHandler(action, callback) {
        connectWebViewJavascriptBridge(function (bridge) {
            bridge.registerHandler(action, function (ret) {
                typeof callback === 'function' && callback(ret);
            });
        });
    }
};

connectWebViewJavascriptBridge(function (bridge) {
    if (bridge.init) bridge.init && bridge.init(api.defaultHandler);
});

api.connectWebViewJavascriptBridge = connectWebViewJavascriptBridge;

module.exports = api;

},{"./ua.js":26}],25:[function(require,module,exports){

'use strict';

module.exports = function (date, format) {
    date = new Date(date);

    var map = {
        "M": date.getMonth() + 1,
        "d": date.getDate(),
        "h": date.getHours(),
        "m": date.getMinutes(),
        "s": date.getSeconds(),
        "q": Math.floor((date.getMonth() + 3) / 3),
        "S": date.getMilliseconds() };

    format = format.replace(/([yMdhmsqS])+/g, function (all, t) {
        var v = map[t];
        if (v !== undefined) {
            if (all.length > 1) {
                v = '0' + v;
                v = v.substr(v.length - 2);
            }
            return v;
        } else if (t === 'y') {
            return (date.getFullYear() + '').substr(4 - all.length);
        }
        return all;
    });

    return format;
};

},{}],26:[function(require,module,exports){

'use strict';

var _config = require('../config.js');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var engine = {
    ie: 0,
    gecko: 0,
    webkit: 0,
    khtml: 0,
    opera: 0,

    ver: ''
};
var browser = {
    ie: 0,
    firefox: 0,
    safari: 0,
    konq: 0,
    opera: 0,
    chrome: 0,

    ver: ''
};
var system = {
    win: false,
    mac: false,
    x11: false,
    iPhone: false,
    iPad: false,
    iOS: false,
    Android: false,
    winPhone: false
};

var app = false;

var ua = navigator.userAgent,
    platform = navigator.platform;

if (_config2.default.RegExp.isApp.test(ua)) {
    var name = RegExp.$1;
    app = {
        name: name,
        ver: _config2.default.RegExp.appVersion.exec(ua)[1],
        isDev: _config2.default.RegExp.isDevApp.test(name)
    };
}

system.win = platform.indexOf('Win') == 0;
system.mac = platform.indexOf('Mac') == 0;
system.x11 = platform.indexOf('X11') == 0 || platform.indexOf('Linux') == 0;

if (system.win) {
    if (/Win(?:dows )?([^do]{2})\s?(\d+\.\d+)?/.test(ua)) {
        if (RegExp['$1'] == 'NT') {
            switch (RegExp['$2']) {
                case '5.0':
                    system.win = '2000';
                    break;
                case '5.1':
                    system.win = 'XP';
                    break;
                case '6.0':
                    system.win = 'Vista';
                    break;
                case '6.1':
                    system.win = '7';
                    break;
                default:
                    system.win = 'NT';
                    break;
            }
        } else if (RegExp['$1'] == '9x') {
            system.win = 'ME';
        } else {
            system.win = RegExp['$1'];
        }
    }
}

system.iPhone = ua.indexOf('iPhone') > -1;
system.iPad = ua.indexOf('iPad') > -1;

if (system.mac && ua.indexOf('Mobile') > -1) {
    if (/CPU (?:iPhone )?OS (\d+_\d+)/.test(ua)) {
        system.iOS = parseFloat(RegExp.$1.replace('_', '.'));
    } else {
        system.iOS = 2;
    }
}

if (/Android (\d+\.\d+)/.test(ua)) {
    system.Android = parseFloat(RegExp.$1);
}

if (system.win == 'CE') {
    system.winPhone = system.win;
} else if (system.win == 'Ph') {
    if (/Windows Phone OS (\d+\.\d+)/.test(ua)) {
        system.win = 'Phone';
        system.winPhone = parseFloat(RegExp['$1']);
    }
}

if (window.opera) {
    engine.ver = browser.ver = window.opera.version();
    engine.opera = browser.opera = parseFloat(engine.ver);
} else if (/AppleWebKit\/(\S+)/.test(ua)) {
    engine.ver = RegExp['$1'];
    engine.webkit = parseFloat(engine.ver);

    if (/Chrome\/(\S+)/.test(ua)) {
        browser.ver = RegExp['$1'];
        browser.chrome = parseFloat(browser.ver);
    } else if (/Version\/(\S+)/.test(ua)) {
        browser.ver = RegExp['$1'];
        browser.safari = parseFloat(browser.ver);
    } else {
        var safariVersion = 1;
        if (engine.webkit < 100) {
            safariVersion = 1;
        } else if (engine.webkit < 312) {
            safariVersion = 1.2;
        } else if (engine.webkit < 412) {
            safariVersion = 1.3;
        } else {
            safariVersion = 2;
        }

        browser.safari = browser.ver = safariVersion;
    }
} else if (/KHTML\/(\S+)/.test(ua) || /Konqueror\/([^;]+)/.test(ua)) {
    engine.ver = browser.ver = RegExp['$1'];
    engine.khtml = browser.konq = parseFloat(engine.ver);
} else if (/rv:([^\)]+)\) Gecko\/\d{8}/.test(ua)) {
    engine.ver = RegExp['$1'];
    engine.gecko = parseFloat(engine.ver);

    if (/Firefox\/(\S+)/.test(ua)) {
        browser.ver = RegExp['$1'];
        browser.firefox = parseFloat(browser.ver);
    }
} else if (/MISE ([^;]+)/.test(ua)) {
    engine.ver = browser.ver = RegExp['$1'];
    engine.ie = browser.ie = parseFloat(engine.ver);
}

module.exports = {
    engine: engine,
    browser: browser,
    system: system,
    app: app
};

},{"../config.js":22}],27:[function(require,module,exports){

'use strict';

var Version = function Version(v1, v2) {
    if (!v1) {
        return -1;
    }

    v1 = String(v1);
    v2 = String(v2);

    if (v1 === v2) {
        return 0;
    }

    var v1s = v1.split('.'),
        v2s = v2.split('.'),
        len = Math.max(v1s.length, v2s.length);

    for (var i = 0; i < len; i++) {
        v1s[i] = "undefined" === typeof v1s[i] ? 0 : parseInt(v1s[i], 10);
        v2s[i] = "undefined" === typeof v2s[i] ? 0 : parseInt(v2s[i], 10);
        if (v1s[i] > v2s[i]) return 1;
        if (v1s[i] < v2s[i]) return -1;
    }
    return 0;
};

module.exports = Version;

},{}]},{},[21]);
