# Quasar App (api-doc)

## Composition API

只能在 setup 函数内使用

> https://vue-composition-api-rfc.netlify.com/

> https://github.com/vuejs/composition-api

> https://typescript.nuxtjs.org/cookbook/components/#composition-api

## Composition API 模板 Refs

注意在 vue template 中 单个元素的 ref 属性是字符串，没有 v-bind : 指令

> https://composition-api.vuejs.org/zh/api.html#%E6%A8%A1%E6%9D%BF-refs

## Composition API And JSX

> https://github.com/vuejs/jsx

## watch

watch 第一个参数 sources ， 用计算值，可以规避掉 watch 了不是 reactive object 的问题，不是 reactive object 运行时会报错

## 依赖管理

各页面依赖的模块都必须使用异步加载模式或者 CDN 方式引入

示例代码

`const dayjsModule: any = await import(/* webpackChunkName: "dayjs" */ "dayjs");`

```javascript
meta: {
  script: {
    jsSdk: {
      src: "https://res.wx.qq.com/open/js/jweixin-1.6.0.js";
    }
  }
}
```

## 布局组件

## 路由

## Axios

setup 方法中 通过 SetupContext context.root.\$axios 调用

vuex 通过 this.\$axios 调用

不要直接 import node_modules axios 使用，会造成 交叉请求状态污染 (cross-request state pollution)

## Vuex Typescript

> https://typescript.nuxtjs.org/cookbook/store.html#vanilla

注意在 Vuex API 方法内获得 state 一定要通过方法的 state 参数 ，不要直接使用 state 变量

## ui 组件库

quasar ui

> https://quasar.dev/

> http://www.quasarchs.com/

## 其他

所有需要在主进程执行的功能代码，都可以放到 src-electron/main-process/module 目录下，会自动执行，代码分离解耦

quasar.conf
```js
config.plugin("monaco-editor-webpack").use(MonacoWebpackPlugin, [
  {
    languages: ["json", "markdown"],
  },
]);
```

src/pages 里面只放页面组件，页面用到的局部组件放到 src/components 里， 如果只是单个页面使用，则放在 src/components/页面名 目录下 , 如果是多个页面使用，则放在 src/components/common

setup 方法的 props 参数，不能析构，internalInstance 的 \$route 不能析构，会丢失反应

不要使用 Vue Mixins , 译文：Vue3 Composition API 是如何取代 Vue Mixins

> http://caibaojian.com/vue3-composition-api.html

webpack chain

> https://github.com/Yatoo2018/webpack-chain/tree/zh-cmn-Hans

## IDE

### WebStorm

搜索 ESLint , 勾选 Automatic ESLint 和 Run eslint -- fix on save

安装 prettier 插件，搜索 File Watchers，点击 + ，选择 Prettier，File Type 选择 Any

Languages and Frameworks | JavaScript ，选择 JSX

每次安装了新版本 node，需要搜索 Node.js ， Node interpreter 选择最新版本 node ， 勾选 Coding assistance for Node.js ， Package manager 选择 npm

### VSCode

配置 jsconfig.json 文件，实现智能跳转和提示

安装 eslint , prettier, vetur 插件 (https://quasar.dev/start/vs-code-configuration#Prettier-ES-Lint-rules)

配置

```

    "vetur.validation.template": false,
    "editor.codeActionsOnSave": {
        "source.fixAll": true
    },

```

## 环境

- Ubuntu 系统第一次需要执行 `sudo apt-get install -y build-essential`

- 重置前端依赖环境，cd 到项目目录，删除前端依赖相关文件

  ```bash
  rm -rf node_modules package-lock.json yarn.lock && npm cache clean --force
  ```

- 初始化前端环境 ** 如果需要把老版本的全局模块安装到新版本 node，请把 nvm install --lts 替换为 nvm install --lts --reinstall-packages-from=node, 有些系统 nvm 命令需要手动添加到 bash，所以下面命令会找不到 nvm 报错中断，请查看 nvm 安装文档 **
  ```bash
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh | bash && export NVM_NODEJS_ORG_MIRROR=https://npm.taobao.org/mirrors/node && nvm install --lts && nvm use --lts && npm i -g mirror-config-china --registry=https://registry.npm.taobao.org && npm config list && npm install -g npm pm2 @vue/cli @quasar/cli
  ```
  - nvm install --lts --reinstall-packages-from=node
    ```bash
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh | bash && export NVM_NODEJS_ORG_MIRROR=https://npm.taobao.org/mirrors/node && nvm install --lts --reinstall-packages-from=node && nvm use --lts && npm i -g mirror-config-china --registry=https://registry.npm.taobao.org && npm config list && npm install -g npm pm2 @vue/cli @quasar/cli
    ```
- 安装项目依赖包

  `npm i`

## Build Setup

```bash
# install dependencies
$ npm install

# serve with hot reload
$ npm run dev

# build for production and launch server
$ npm run build

```
