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

const MY = window.MY = window.MY || {};

MY.ua = ua;
MY.Version = Version;
MY.appBridge = appBridge;

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