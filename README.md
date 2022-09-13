

## ui 组件库

quasar ui

> https://quasar.dev/

vant ui

> https://youzan.github.io/vant/v3/#/zh-CN

## 其他

src/pages 里面只放页面组件，页面用到的局部组件放到 src/components 里， 如果只是单个页面使用，则放在 src/components/页面名 目录下 , 如果是多个页面使用，则放在 src/components/common

setup 方法的 props 参数，不能析构，internalInstance 的 \$route 不能析构，会丢失反应


webpack chain

> https://github.com/Yatoo2018/webpack-chain/tree/zh-cmn-Hans
> node_modules/@quasar/app/lib/webpack/create-chain.js

## IDE

配置 jsconfig.json , tsconfig.json 文件，实现 js 和 ts 代码的智能跳转和提示

### WebStorm

搜索 ESLint , 勾选 Automatic ESLint 和 Run eslint -- fix on save

Languages & Frameworks | JavaScript | prettier `{**/*,*}.{js,jsx,ts,tsx,html,vue,css,less,md,json}`

Languages & Frameworks | Stylelint Sheets | Stylelint `{**/*,*}.{css,less,html,vue}`

### VSCode

安装 eslint , prettier, volar 插件

## 环境

[构建加速](https://help.aliyun.com/document_detail/202442.html)

- 重置前端依赖环境，cd 到项目目录，删除前端依赖相关文件

  ```shell
  rm -rf node_modules .eslintcache package-lock.json yarn.lock pnpm-lock.yaml
  ```

- 初始化前端环境

  安装 pnpm *Mac建议使用 `brew install pnpm`*
  ```shell
  curl -fsSL https://get.pnpm.io/install.sh | sh -
  ```
  安装 node
  ```shell
  pnpm env use --global lts && pnpm install -g pnpm npm yarn npm-check-updates pm2
  ```

  ```
  /Users/panhezeng/Library/pnpm/nodejs/16.14.2/pnpm-global/5/node_modules/yarn
  ```

- 安装项目依赖包

  `yarn install`

- 升级项目依赖包

  `ncu -u --target minor && yarn install`

## Build Setup

```shell
# install dependencies
yarn install

# serve with hot reload
yarn dev

# build for production and launch server
yarn build

```

部署

服务端运行时(node index.js)，依赖 node_modules 文件夹的模块，部署时至少需要 dist 和 node_modules 文件夹

```shell
unzip -o ./dist.zip && cd ./dist/ssr && yarn install && pm2 start "yarn start" --name moocnd-mobile -i 0
```



匹配此 url 前缀的访问，代理到 127.0.0.1:13465
`www.learning.mil.cn/mobile`
