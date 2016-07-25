/**
 * @author: 卓文理
 * @email : 531840344@qq.com
 * @desc  : 版本比对
 */
'use strict';

/**
 * 语义化的版本号比对
 * 语义化版本号相关信息：https://docs.npmjs.com/misc/semver
 * @param {string} v1 版本号1
 * @param {string} v2 版本号2
 * 例如: Version('1.9.1', '2.1.0')
 */
const Version = function (v1, v2) {
    if(!v1){return -1;}

    v1 = String(v1);
    v2 = String(v2);

    if(v1 === v2){return 0;}

    const v1s = v1.split('.'),
        v2s = v2.split('.'),
        len = Math.max(v1s.length, v2s.length);

    for(let i = 0; i < len; i++){
        v1s[i] = ("undefined" === typeof v1s[i] ? 0 : parseInt(v1s[i], 10));
        v2s[i] = ("undefined" === typeof v2s[i] ? 0 : parseInt(v2s[i], 10));
        if(v1s[i] > v2s[i]) return 1;
        if(v1s[i] < v2s[i]) return -1;
    }
    return 0;
};

module.exports = Version;