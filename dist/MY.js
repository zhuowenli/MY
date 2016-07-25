(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

'use strict';

var _config = require('./config.js');

var _config2 = _interopRequireDefault(_config);

var _version = require('./utils/version.js');

var _version2 = _interopRequireDefault(_version);

var _ua = require('./utils/ua.js');

var _ua2 = _interopRequireDefault(_ua);

var _appBridge = require('./utils/app-bridge.js');

var _appBridge2 = _interopRequireDefault(_appBridge);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MY = window.MY = window.MY || {};

MY.ua = _ua2.default;
MY.Version = _version2.default;
MY.appBridge = _appBridge2.default;

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

},{"./config.js":2,"./utils/app-bridge.js":3,"./utils/ua.js":4,"./utils/version.js":5}],2:[function(require,module,exports){

'use strict';

module.exports = {
  RegExp: {
    isApp: /(Meiya(?:-dev)?)/,
    isDevApp: /Meiya-dev/,
    appVersion: /Meiya(?:-dev)?\/(\d+\.\d+\.\d+(?:\.\d+)?)\D/
  }
};

},{}],3:[function(require,module,exports){

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

},{"./ua.js":4}],4:[function(require,module,exports){

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

},{"../config.js":2}],5:[function(require,module,exports){

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

},{}]},{},[1]);
