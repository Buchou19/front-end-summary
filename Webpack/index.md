## 1. 什么是 webpack ?

前端进入了工程化（模块化）开发阶段，但 js 本身并不支持模块化开发，那 webpack 就是一个支持本地模块化开发的**打包**（构建）工具。总而言之：**打包工具**。

## 2. webpack 打包原理

假如现在有 index.js 模块如下：

```js
var add = require('add.js').default;
console.log(add(2, 4));
```

index.js 依赖的 add.js 模块如下：

```js
exports.default = function add (a, b) {
    return a + b;
}
```

那现在，如果你实现一个 webpack 把所有依赖打包到一个 bundle 文件中，你会怎么做？

我首先想到直接合并到一起：

```js
// add.js
exports.default = function add (a, b) {
    return a + b;
}
// index.js
var add = require('add.js').default;
console.log(add(2, 4));
```

这样显然不行，因为浏览器不认识 exports、require 变量，那我就自动的给他添加上这两个变量，然后让源代码在 **eval** 函数里面执行，试试先解决 exports：

```js
// exports 其实就是一个对象
var exports = {};
// 那eval执行add.js源代码就不会报错了
eval(`exports.default = function add (a, b) { return a + b;}`);
// 相当于给exports对象增加了一个属性default，它的值是add函数
```

以上通过自动增加了一个 exports 对象就可以直接 eval 执行不需要改变任何源代码，Nice！

但是问题又出现了！如果 add.js 本身又声明了很多变量怎么办？这些变量会污染全局吗？显然会！

而 node 中模块化开发的概念只是暴露出 module.exports 变量，其他的所有变量具有模块化作用域，而要通过原生的 js 解决这一问题马上想到自调用函数中的函数作用域，如下：

```js
var exports = {};
(function (exports, code) {
    eval(code);
})(exports, `var inner = 'inner';exports.default = function add (a, b) {return a + b;}`);
// 第一个参数 exports，第二个参数源代码code字符串
```

外部 exports 被操作赋值，内部变量不会影响外部，完美解决！

下面来看 require ，require 肯定是一个函数，传入一个参数文件名字符串，返回的结果就是exports变量，我们来手动构建出这个函数就可以了，同时考虑到一点，以上的 export 变量应该是在 require 函数内部定义的，因为我只有 require 一个文件的时候，才需要去执行这个文件的源代码，如下：

```js
// index.js
// var add = require('add.js').default;
// console.log(add(2, 4));

function require(filename) {
    var exports = {};
    (function (exports, code) {
        eval(code);
    })(exports, `var inner = 'inner';exports.default = function add (a, b) {return a + b;}`);
    return exports;
}
```

以上这个函数实现了吗？实现了，但是还有问题，内部 eval 函数执行的应该是 filename 文件对应的源代码，而上面是写死的，所以我们需要再构建一个自调用函数包含参数 file ，这是个对象，包含了所有 filename 到 源代码 code 字符串的映射，如下：

```js
(function (file) {
    function require(filename) {
        var exports = {};
        (function (exports, code) {
            eval(code);
        })(exports, file[filename]);
        return exports;
    }
    // 入口
    require('index.js');
})({
    'index.js': `var add = require('add.js').default;console.log(add(2, 4));`,
    'add.js': `var inner = 'inner';exports.default = function add (a, b) {return a + b;}`
});
```

**完美！**

其实这个时候 webpack 的基本原理就已经实现了，这就是一份打包好的 bundle.js 文件，引入后在浏览器中可以直接运行显示结果 6 ；

我们在来从头回顾下它执行的过程：

```js
require('index.js');
// 1. 这一句从用户自定义的入口文件 index.js 开始执行，调用并执行了 require 函数
// 2. 中间执行到 eval(code) 的时候，实际执行 eval(file[filename]), 也就是 eval(`var add = require('add.js').default;console.log(add(2, 4));`)
// 3. 执行这一句中间有一句 require('add.js')，从而又递归执行 require
// 4. 然后 eval(`var inner = 'inner';exports.default = function add (a, b) {return a + b;}`)
// 5. 如果 add.js 里面又引入依赖，然后会递归执行下去直到最后...
```

以上！实现了 webpack 打包文件的基本原理，朴实无华！

下面剩下这个问题，如何构造这个 **file** 文件代码映射对象？源代码 code 中有 es6 语法怎么办？比如 **import**？

```js
{
    'index.js': `var add = require('add.js').default;console.log(add(2, 4));`,
    'add.js': `var inner = 'inner';exports.default = function add (a, b) {return a + b;}`
}
```

查看 webapck 打包后的源代码，你会发现它都会构造这样一个 file 对象，包含了从入口开始需要用到的所有依赖文件名到源代码的映射，而且这份源代码是经过转化的，比如 ex6 import 转化，因为基于以上我们手写的 webpack 原理，我们只帮助构造了 exports 和 reuqire，而eval中不能识别 import。下面我们实现这个过程：

```js
const fs = require('fs');
const path = require('path');
// ast
const parser = require('@babel/parser');
// 节点遍历
const traverse = require('@babel/traverse').default;
// es6 -> es5
const babel = require('@babel/core');

/**
 * 分析依赖
 * @param {*} file 
 */
function getModuleInfo(file) {
  const body = fs.readFileSync(file, 'utf-8');
  
  // 转换ast语法树
  const ast = parser.parse(body, {
    sourceType: 'module'
  });

  // 依赖收集 import xxx
  const deps = {};
  traverse(ast, { 
    // 其实就是一个遍历所有节点的遍历器
    // 找到所有的 ImportDeclaration 语句然后进行操作
    ImportDeclaration({ node }) {
      const dirname = path.dirname(file);
      const abspath = './' + path.join(dirname, node.source.value);
      deps[node.source.value] = abspath;
    }
  });
  
  // es6 -> es5
  const { code } = babel.transformFromAst(ast, null, {
    // 预设
    presets: ["@babel/preset-env"]
  });

  const info = {
    file,
    deps,
    code
  };
  return info;
}

/**
 * 模块解析
 * @param {*} file 
 */
function parseModules(file) {
  const entry = getModuleInfo(file);
  const temp = [entry];
  const depsGraph = {};

  getDeps(temp, entry);
  temp.forEach(info => {
    depsGraph[info.file] = {
      deps: info.deps,
      code: info.code
    }
  });
  return depsGraph;
}

/**
 * 递归获取依赖
 * @param {*} temp 
 * @param {*} param1 
 */
function getDeps(temp, { deps }) {
  Object.keys(deps).forEach(key => {
    const child = getModuleInfo(deps[key]);
    temp.push(child);
    getDeps(temp, child);
  });
}

/**
 * 最终的打包构建代码
 * @param {*} file 
 */
function bundle(file) {
  const depsGraph = JSON.stringify(parseModules(file));
  return `
    (function (file) {
      function require(filename) {
          var exports = {};
          (function (exports, code) {
              eval(code);
          })(exports, file[filename].code);
          return exports;
      }
      // 入口
      require('${file}');
    })(${depsGraph});
  `;
}

// 写入文件
const content = bundle('./index.js');
!fs.existsSync('./dist') && fs.mkdirSync('./dist');
fs.writeFileSync('./dist/bundle.js', content);
```

除了生成名为 depsGraph 的 file 对象，中间还进行了 ES6 到 ES5 的语法转化，主要过程如下：

1. 从入口文件进入分析，这个过程包括：
   1. 读取文件得到字符串
   2. 将字符串转化为 ast 抽象语法树
   3. 遍历这个 ast 抽象语法树中每个节点
   4. 找到依赖（ImportDeclaration）语句声明，把当前文件依赖的所有文件添加到 deps 对象中
   5. 并且转化文件源代码字符串为 es5 语法存起来
   6. 在生成完每个文件的 deps 的过程中，在递归遍历 deps 中所有文件的相关依赖
   7. 直到生成最后的 depsGraph
2. 利用以上分析的 webpack 原理，直接返回打包代码片段，并把参数 depsGraph 字符串传入
3. 生成可最终打包的字符串并写入输出文件中

**以上！**

