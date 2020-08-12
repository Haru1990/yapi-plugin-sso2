# yapi-plugin-sso2

`yapi-plugin-sso2` 是为 yapi 开发的单点登录插件。

## 插件说明

yapi 提供第三方登录的hook：third_login，将我们开发的单点登录逻辑绑定到该hook即可。

### `index.js` 入口文件

该插件涉及到客户端和服务端的开发，因此入口文件中的 `client` 和 `server` 都是 `true`。
```
module.exports = {
  client: true, // 代表该插件对客户端（前端代码）有修改，需要重新编译
  server: true, // 代表该插件对服务端（后端代码）有修改，需要重新编译
};
```

### `client.js` 客户端文件

该插件会在 `yapi` 页面中增加一个第三方登录按钮，点击进行单点登录验证。这些逻辑都写在 `client.js` 中。

登录的具体逻辑：

首先需要校验用户是否已经登录UUAP。

我们开发了一个 `yapi` 的接口 `/api/user/login_by_castgc`，在接口的处理中，请求UUAP接口 `https://uuap2.sftcwl.com/uuap/v2/loginStatusByCASTGC`，得到用户的登录结果，作为 `yapi` 的接口返回。

如果已经登录，就直接跳转到yapi内的页面；如果没有登录，就跳转到UUAP登录页 `https://uuap2.sftcwl.com/` 进行登录，登录成功之后再返回到yapi。

最后将我们的登录按钮绑定到我们的hook就可以了：`this.bindHook('third_login', UuapComponent);`

### `server.js` 服务端文件

服务端处理第三方登录hook被触发后，需要获取到当前登录的用户信息，用于 `yapi` 中判断是注册新用户还是旧用户登录。

## 插件使用

- 1、在 `yapi` 的 `vendors` 目录下安装插件：`npm install yapi-plugin-sso2`
- 2、在 `yapi` 的 `config.json` 中添加以下代码：
```
"plugins": [
  {
      "name": "sso2",
      "options": {
        "type": "sso",
        "loginUrl": "https://uuap2.sftcwl.com/uuap/v2/userInfoByCASTGC",
        "emailPostfix": "@sfmail.sf-express.com",
        "AUTH_SERVER": "https://uuap2.sftcwl.com"
      }
  }
]
```
- 3、在 `vendors` 目录下面使用 ykit 工具重新打包前端代码：`ykit pack -m`
- 4、重新启动 yapi 服务即可。