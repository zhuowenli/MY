/**
 * @author: 卓文理
 * @email : 531840344@qq.com
 * @desc  : Description
 */
'use strict';

var appBridge = require('./app-bridge');

var Images = function () {
    return this;
};

Images.prototype = {
    constructor: Images,
    onerror: function (err) {
        var src = err.target.src;
        if (!this.dataset.ip) {
            Images.queryIP(src)
            .done(function (ip, host) {
                this.dataset.ip = ip;
                this.src = this.src.replace(host, ip);
            }.bind(this))
        }
    }
};

Images.queryIP = function (url) {
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
};

module.exports = new Images();