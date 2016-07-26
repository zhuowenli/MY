/**
 * @author: 卓文理
 * @email : 531840344@qq.com
 * @desc  : 当资源请求失败时，向客户端接口获取服务器的ip地址，直接通过ip请求服务器资源
 */
'use strict';

var appBridge = require('./app-bridge');

class srcError {
    constructor() {
        return this;
    }
    onError(err) {
        var src = err.target.src;
        if (!this.dataset.ip) {
            srcError.queryIP(src).done(function (ip, host) {
                this.dataset.ip = ip;
                this.src = this.src.replace(host, ip);
            }.bind(this))
        }
    }
    queryIP(url) {
        var def = $.Deferred();
        var hostReg = /^https?:\/\/([^:\/\?#]+)/;
        var urlMatch = url.match(hostReg);
        if (urlMatch && urlMatch.length) {
            var host = urlMatch[1];

            appBridge.callHandler('query_ip', {
                host: host
            }, function (ret) {
                def.resolve(ret.ip, host);
            });
        }
        return def.promise();
    }
}

module.exports = new srcError();