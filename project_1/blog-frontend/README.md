
### 选址前端框架说明
    涉及技术
        --- vue
        --- vuex
        --- vue-router
        --- vue-resource
        --- element-ui
        --- es6
        --- node
    质量检测体系
        --- eslint 4.15.0
    代码管理工具
        --- git
        --- svn
    打包工具
        --- webpack 3.3.0
            --- html-webpack-plugin
            --- extract-text-webpack-plugin
            --- copy-webpack-plugin
            --- webpack-dev-server
            --- webpack-merge
	编译工具
		--- babel-loader
		--- sass-loader

### 目录说明！！！！！
    fc-platform                项目名称
	|
    |------- dist               webpack压缩打包后代码文件
	|
    |------- src                开发目录(开发人员主要基于src目录)
	|		|
    |       |---- api            地址配置
	|		|
    |       |---- asserts        静态资源
	|		|
    |       |---- components     组件
    |       |   	|----            下面根据业务模块放置
    |       |---- css            公共css文件
	|		|
    |       |---- images         图片(根据业务模块放置)
	|		|
    |       |---- routers        路由配置(可根据业务模块配置，合入主配置文件)
    |       |    	|----index.js    主路由配置文件
    |       |---- store          vuex配置文件
	|		|		|----index.js  vuex基础配置
    |       |---- view           模板页
	|		|		|---index.html 模板文件
	|		|
	|		|---- index.js       入口js文件
	|
	|------ .editorconfig        配置编辑器配置(统一代码风格)
	|
	|------ .eslintignore  		 eslint忽略文件
	|
	|------ .eslintrc.js         eslint自定义规则文件
	|
	|------ package.json		 项目配置信息
	|
	|------ README.md			 项目说明文件
	|
	|------ webpack.common.js    webpack公共配置
	|
	|------ webpack.dev.js       webpack本地运行配置
    |
    |------ webpack.sit.js       测试环境配置
	|
	|------ webpack.prd.js		 生产环境配置

### 推荐编辑器
    VSCode

    推荐插件（VSCode）
    ESLint
    Vetur

    工作区间配置
    {
        "eslint.autoFixOnSave": true,   保存自动修复
        "vetur.validation.template": false,   关闭template校验
        "eslint.validate": [
            "javascript",
            "javascriptreact",
            {                             
                "language": "html",      对.html文件自动修复
                "autoFix": true
            },
            {
                "language": "vue",      对.vue文件自动修复
                "autoFix": true
            }
        ]
    }


### Development Setup
```bash
# install devDependencies
npm install
# if install failed, try `cnpm install` (requires global cnpm)

# serve at localhost:8006
npm run start

# build sit dist files
npm run build_sit

# build production dist files
npm run build_prd

# 检测eslint规则
npm run lint

```


选址平台
