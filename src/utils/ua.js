/**
 * @author: 卓文理
 * @email : 531840344@qq.com
 * @desc  : Description
 */
'use strict';

import config from '../config.js';

const engine = {
    ie: 0,
    gecko: 0,
    webkit: 0,
    khtml: 0,
    opera: 0,

    //具体版本号
    ver: ''
};
const browser = {
    ie: 0,
    firefox: 0,
    safari: 0,
    konq: 0,
    opera: 0,
    chrome: 0,

    //具体版本号
    ver: ''
};
const system = {
    win: false,
    mac: false,
    x11: false,
    iPhone: false,
    iPad: false,
    iOS: false,
    Android: false,
    winPhone: false
};

let app = false;

const ua = navigator.userAgent,
    platform = navigator.platform;

if (config.RegExp.isApp.test(ua)) {
    const name = RegExp.$1;
    app = {
        name: name,
        ver: config.RegExp.appVersion.exec(ua)[1],
        isDev: config.RegExp.isDevApp.test(name)
    };
}

system.win = platform.indexOf('Win') == 0;
system.mac = platform.indexOf('Mac') == 0;
system.x11 = (platform.indexOf('X11') == 0 || platform.indexOf('Linux') == 0);

if (system.win) {
    if (/Win(?:dows )?([^do]{2})\s?(\d+\.\d+)?/.test(ua)) {
        if (RegExp['$1'] == 'NT') {
            switch(RegExp['$2']) {
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

    //chrome or safari
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
}