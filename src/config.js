/**
 * @author: 卓文理
 * @email : 531840344@qq.com
 * @desc  : Description
 */
'use strict';

/**
 * Example：
 * console.log(navigator.userAgent)
 * "Meiya-dev/3.6.0 (iPhone; iOS 10.0; Scale/2.00; 4G) Mozilla/5.0 (iPhone; CPU iPhone OS 10_0 like Mac OS X) AppleWebKit/602.1.40 (KHTML, like Gecko) Mobile/14A5309d"
 */

module.exports = {
    RegExp: {
        isApp: /(Meiya(?:-dev)?)/,
        isDevApp: /Meiya-dev/,
        appVersion: /Meiya(?:-dev)?\/(\d+\.\d+\.\d+(?:\.\d+)?)\D/
    }
}