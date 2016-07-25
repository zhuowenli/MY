/**
 * @author: 卓文理
 * @email : 531840344@qq.com
 * @desc  : AppBridge
 */
'use strict';

import ua from './ua.js';

function connectWebViewJavascriptBridge(callback) {
    if(window.WebViewJavascriptBridge) {
        callback(WebViewJavascriptBridge);
    }
    else {
        document.addEventListener('WebViewJavascriptBridgeReady', function() {
            callback(WebViewJavascriptBridge);
        }, false);
    }
}

//bridge接口兼容
function compat(action, data, callback) {
    switch (action) {
        case 'get_query_string':

        if (typeof callback === 'function') {
            var search = location.search.replace(/^\?/, ''),
                hash   = location.hash.replace(/^\#/, ''),
                query  = search + (search ? '#' : '') + hash;

            if (!ua.app) {
                callback({query_string: query});
            }
        }

        break;
    }
}

const api = {
    defaultHandler: function(message, responseCallback) {
        responseCallback('got');
    },
    send: function(data, callback) {
        connectWebViewJavascriptBridge(function(bridge) {
            bridge.send(data, function(ret) {
                typeof callback === 'function' && callback(ret);
            });
        });
    },
    callHandler: function(action, data, callback) {
        if(typeof data === 'function') {
            callback = data;
            data = null;
        }

        compat.call(null, action, data, callback);

        connectWebViewJavascriptBridge(function(bridge) {
            bridge.callHandler(action, data, function(ret) {
                typeof callback === 'function' && callback(ret);
            });
        });
    },
    registerHandler: function(action, callback) {
        connectWebViewJavascriptBridge(function(bridge) {
            bridge.registerHandler(action, function(ret) {
                typeof callback === 'function' && callback(ret);
            });
        });
    }
};

// init
connectWebViewJavascriptBridge(function(bridge) {
    if(bridge.init) bridge.init && bridge.init(api.defaultHandler);
});

api.connectWebViewJavascriptBridge = connectWebViewJavascriptBridge;

module.exports = api;