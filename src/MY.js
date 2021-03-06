/**
 * @author: 卓文理
 * @email : 531840344@qq.com
 * @desc  : MY
 */
'use strict';

import config from './config.js';
import Version from './utils/version.js';
import ua from './utils/ua.js';
import appBridge from './utils/app-bridge.js';
import Error from "./utils/Error.js";
import dateFormat from "./utils/date-format.js";

const MY = window.MY = window.MY || {};

MY.ua = ua;
MY.Version = Version;
MY.appBridge = appBridge;
MY.Error = Error;
MY.dateFormat = dateFormat;

MY.isApp = ua.app;
MY.isDevApp = ua.app && ua.app.isDev;
MY.isAndroid = ua.system.Android;
MY.isiPhone = ua.system.iPhone;

const locationOrigin = location.origin;
const locationHost = location.host;

if (MY.isApp) {
    MY.version = ua.app.ver;
}

MY.locationOrigin = locationOrigin;
MY.locationHost = locationHost;

/**
 * 链接资源加载失败时，直接访问服务器ip地址
 * js无法直接获取服务器ip，可以通过客户端的appBridge接口来获取：
 * appBridge.callHandler('query_ip', {host: host}, function(res) {
 *     // get res.ip
 * });
 */
document.addEventListener('error', function (err) {
    if (err.target.tagName === 'IMG' ||
        err.target.tagName === 'SCRIPT' ||
        err.target.tagName === 'VIDEO' ||
        err.target.tagName === 'AUDIO' ||
        err.target.tagName === 'SOURCE' ||
        err.target.tagName === 'LINK') {
        Error.onerror.call(err.target, err);
    }
}, true);


