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
