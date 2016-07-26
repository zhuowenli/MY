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

/**
 * Bridge接口兼容
 * @param  {String}   action   接口名
 * @param  {Object}   data     接口数据
 * @param  {Function} callback 回调函数
 */
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
    /**
     * 直接向客户端推送一条消息，客户端不会产生回调。
     * @param  {string}   message          消息
     * @param  {Function} responseCallback 成功后的回调
     */
    defaultHandler: function(message, responseCallback) {
        responseCallback('got');
    },

    /**
     * 通过send直接向客户端发送数据
     * @param  {Object}   data     接口数据
     * @param  {Function} callback 回调函数
     */
    send: function(data, callback) {
        connectWebViewJavascriptBridge(function(bridge) {
            bridge.send(data, function(ret) {
                typeof callback === 'function' && callback(ret);
            });
        });
    },

    /**
     * 请求Bridge接口
     * @param  {String}   action   接口名
     * @param  {Object}   data     接口数据
     * @param  {Function} callback 回调函数
     */
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

    /**
     * 监听Bridge接口
     * @param  {String}   action   接口名
     * @param  {Function} callback 回调函数
     */
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