/**
 * @author: 卓文理
 * @email : 531840344@qq.com
 * @desc  : 当资源请求失败时，向客户端接口获取服务器的ip地址，直接通过ip请求服务器资源
 */
'use strict';

import appBridge from './app-bridge';
import config from '../config.js';

class Error {
    constructor() {
        return this;
    }
    onError(err) {
        const href = err.target.href;
        let src = err.target.src;

        src = src || href;

        if (!this.dataset.ip) {
            Error.queryIP(src).done(function(ip, host) {
                this.dataset.ip = ip;

                if (err.target.tagName === 'LINK') {
                    this.src = this.src.replace(host, ip);
                } else {
                    this.href = this.href.replace(host, ip);
                }
            }.bind(this));
        }
    }
    queryIP(url) {
        const def = $.Deferred();
        const hostReg = /^https?:\/\/([^:\/\?#]+)/;
        const urlMatch = url.match(hostReg);

        if (urlMatch && urlMatch.length) {
            const host = urlMatch[1];

            appBridge.callHandler('query_ip', {
                host: host
            }, (ret) => {
                def.resolve(ret.ip, host);
            });
        }

        return def.promise();
    }
}

module.exports = new Error();