# Quasar App (git-log-extract)

在 quasar 升级到 webpack5 之前，node 只能使用 v12 即 lts/erbium

**monaco-editor 不要把编辑器的实例变成响应数据和挂载到模板数据上，会卡死**

## ui 组件库

quasar ui

> https://quasar.dev/

> http://www.quasarchs.com/

## 其他

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

[构建加速](https://help.aliyun.com/document_detail/202442.html)

- Ubuntu 系统第一次需要执行 `sudo apt-get install -y build-essential`

- 重置前端依赖环境，cd 到项目目录，删除前端依赖相关文件

  ```bash
  rm -rf node_modules package-lock.json yarn.lock && npm cache clean --force
  ```

- 初始化前端环境 ** 有些系统 nvm 命令需要手动添加到 bash，所以下面命令会找不到 nvm 报错中断，请查看 nvm 安装文档 **
  ```bash
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh | bash && export NVM_NODEJS_ORG_MIRROR=https://npm.taobao.org/mirrors/node && nvm install --lts=erbium && nvm use --lts=erbium && npm i -g yarn npm pm2 @vue/cli @quasar/cli
  ```
    - nvm install --lts=erbium --reinstall-packages-from=node
      ```bash
      curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh | bash && export NVM_NODEJS_ORG_MIRROR=https://npm.taobao.org/mirrors/node && nvm install --lts=erbium --reinstall-packages-from=node && nvm use --lts=erbium && npm i -g yarn npm pm2 @vue/cli @quasar/cli
      ```

## Build Setup

```bash
# install dependencies
$ yarn install

# serve with hot reload
$ yarn run dev

# build for production and launch server
$ yarn run build

```
