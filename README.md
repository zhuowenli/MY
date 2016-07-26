# MY.js

一个 Hybrid App 的通用基础库

## MY.Version

常用的语义化的客户端版本号比对工具，使用方法如下。

    MY.Version('1.9.1', '2.1.0')

更多语义化版本号相关信息：[https://docs.npmjs.com/misc/semver](https://docs.npmjs.com/misc/semver)

## MY.ua

浏览器、以及App、Webview的相关信息。

## MY.appBridge

封装了WebViewJavascriptBridge的常用方法，以及容错机制。

- `MY.appBridge.defaultHandler` : 直接向客户端推送一条消息，客户端不会产生回调。
- `MY.appBridge.send`           : 通过send，直接向客户端发送数据，客户端接收后会触发回调函数。
- `MY.appBridge.callHandler`    : 请求Bridge接口（需带上指定的接口名），**客户端监听到请求**后，会触发回调函数。
- `MY.appBridge.registerHandler`: 监听Bridge接口（需带上指定的接口名），**监听到客户端发起的请求**后，会触发回调函数。

## 客户端接口

一些开发过程中常用的基础接口。

### 请求接口

api                 | 描述
:-------------------|:--------------
query_ip            | 查询服务器ip
get_query_string    | 获取网页访问参数（通过webview打开本地网页时，`window.location.href`可能会失效）
get_version         | 获取当前应用版本
navi_page_action    | App页面跳转
navi_webview_action | Web页面跳转
close_webview_action| 关闭当前webview
set_webview_title   | 设置网页标题
get_network_state   | 获取网络信息 `{"network_state" : [网络状态: "WiFi", "4G", "GPRS", "2.5G", "3G", ""(空字符串,表示无网络)]}`

### 监听接口

api                 | 描述
:-------------------|:--------------
webview_will_appear | webview即将显示
webview_will_close  | webview即将显示