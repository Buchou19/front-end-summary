## 1. 输出结果？原因？

```javascript
if ([]) {console.log(1);} 
if ([].length) {console.log(2);} 
if ({} === {}) {console.log(3);} 
if ('' == 0) {console.log(4);}

// 下面是自己增加
if ([] == 0) {console.log(5);} // 5输出
if ({} == 0) {console.log(6);} // 6不输出
```

首先，if（条件）中的条件会先被执行（我认为）Boolean（条件），所以：

1. [] 是一个 Array 引用类型的实例对象，就是一个Object，根据Boolean（）转化规则：除了 null 空引用，任何对象都会被转化为 true，所以 1 被输出；
2. [].length === 0，Boolean（0）=== false，所以 2 不被输出；
3. {} 创建了一个对象，后面的{}又创建了一个对象，两个是不同的对象，在全等的判断规则中，如果不指向同一个对象，则不全等，所以为 false，3 不被输出；
4. == 判断中，根据规则：一个String，一个Number，String '' 会先被转化为Number 0，然后0 == 0为 true，所以4 被输出。

以上。

------

ECMAScript中有5种基本数据类型：**Undefined、Null、Boolean、String、Number**，和1种复杂数据类型：**Object**，所有值都将是上述6种数据类型之一。

#### **typeof** 

是一个运算符，可以用来检测数据类型，注意：

- **typeof null 返回的是object** ，因为特殊值null被认为是一个空的对象引用
- **typeof 函数名 返回的是function**，从技术角度讲，函数在ECMAScript中也是对象，然而函数也确实有一些特殊的属性，因此通过typeof来区分函数和其他对象是有必要的
- typeof 一个未初始化的变量以及未声明的变量 都会返回Undefined
- typeof 是一个操作符而不是一个函数，所以后面可以用括号括起来

```js
// typeof一般返回6种类型：
1.Undefined 2.Boolean 3.String 4.Number 5.Object 6.Function
// 注意：少了null！多了function！
// 原因是null被识别为空对象，所以是object，function本质也是object，但是为了加以区分增加了
```

#### instanceof

是一个运算符，用来判断**一个对象（参数A）的原型链中是否存在一个构造函数（参数B）的 prototype 属性**

```js
A instanceof B
```

我的理解：其实就是检测这个对象是不是这个构造函数的实例

#### isPrototypeOf()

```js
A.isPrototypeOf(B)
```

检测一个对象 A 是否存在于另一个对象 B 的原型链中，A、B都是对象类型

#### **Boolean**类型

的字面值只有true和false两个，但ECMAScript中所有类型的值都有与这两个Boolean值等价的值，可以通过Boolean（）函数来转换，如Boolean（“ hello world！”），任何数据类型的值都可以调用Boolean（）函数，如下是转换规则：

| Boolean   | true       | false          |
| --------- | ---------- | -------------- |
| String    | 非空字符串 | ""（空字符串） |
| Number    | 非0数值    | 0 和 NaN       |
| Object    | 任何对象   | null           |
| Undefined | 不适用     | undefined      |

#### **Number**

浮点数的最高精度是17位，0.1 + 0.2 不等于0.3，而是等于0.30000000000000004，原因是：

原因在于在JS中采用的IEEE 754的双精度标准，计算机内部存储数据的编码的时候，0.1在计算机内部根本就不是精确的0.1，而是一个有舍入误差的0.1。当代码被编译或解释后，0.1已经被四舍五入成一个与之很接近的计算机内部数字，以至于计算还没开始，一个很小的舍入错误就已经产生了。这也就是 0.1 + 0.2 不等于0.3 的原因。

另外要注意，不是所有浮点数都有舍入误差。**二进制能精确地表示位数有限且分母是2的倍数的小数**，比如0.5，0.5在计算机内部就没有舍入误差。所以0.5 + 0.5 === 1。

所以**永远不要比较浮点数值！**

ECMAScript能保存的最小的值保存在 Number.MIN_VALUE 中，最大值保存在 Number.MAX_VALUE 中，如果得到的数值超过此最大最小的范围，则被保存为 **Infinity** 值。

#### **NaN**

是一个Number类型特殊的值，用来表示一个本来要返回数值的操作数未返回数值的情况（比如任何数除以0都会返回NaN，以及Number("Hello world")也会返回NaN，实际上只有0/0返回NaN，其他数除以0返回Infinity）这样做不会报错，不影响其他代码的运行；它有如下两个特点：

- 如何NaN参与的运算都返回NaN，如（NaN/10），这在多步运算中可能会出错
- NaN与任何值都不相等，包括它自己，NaN == NaN 返回 false
- Boolean（NaN）是 false

可以通过 isNaN（）函数判断是否是NaN：其本质是是否可以转化为数字

```js
alert(isNaN( NaN )); // true
alert(isNaN( 10 )); // false(本身就是10)
alert(isNaN( "10" )); // false(可以被转化为10)
alert(isNaN( "blue" )); // true(不可以被转化为数字)
alert(isNaN( true )); // false(可以被转化为1)
```

#### **数值转化**：**Number()**

1. 如果是Boolean值，true和false值将分别被转换为1和0。

2. 如果是数字值，只是简单的传入和返回。

3. 如果是null值，返回0。

4. 如果是undefined，返回NaN。

5. 如果是字符串：

   　a.  如果字符串中只包含数字时，将其转换为十进制数值，忽略前导0

      　b. **如果字符串中包含有效浮点格式，如“1.1”，将其转换为对应的浮点数字**，忽略前导0（不能有其他字符）

      　c. 如果字符串中包含有效的十六进制格式，如“0xf”，将其转换为相同大小的十进制数值（不能有其他字符）

      　d. 如果字符串为空，将其转换为0

      　e. **如果字符串中包含除上述格式之外的字符，则将其转换为NaN**

6. 如果是对象，则调用对象的valueOf（）方法，然后依照前面的规则转换返回的值。如果转换的结果是NaN，则调用对象的toString（）方法，然后再依照前面的规则转换返回的字符串值。

```js
    var num1 = Number("Hello world"); // NaN
    var num2 = Number("999world"); // NaN
    var num3 = Number(""); // 0
    var num4 = Number("0000011"); // 11
```

#### **parseInt()**

　　处理整数的时候parseInt()更常用。parseInt()函数在转换字符串时，会忽略字符串前面的空格，直到找到**第一个非空格字符**。

　　如果**第一个字符不是数字或者负号**，**parseInt() 就会返回NaN**，同样的，**用parseInt() 转换空字符串也会返回NaN**。

　　如果第一个字符是数字字符，parseInt() 会继续解析第二个字符，直到解析完所有后续字符串或者遇到了一个非数字字符。

　　**parseInt()方法还有基模式，可以把二进制、八进制、十六进制或其他任何进制的字符串转换成整数。**

　　基是由parseInt()方法的第二个参数指定的，所以要解析十六进制的值，当然，对二进制、八进制，甚至十进制（默认模式），都可以这样调用parseInt()方法。

```js
　　　　var num1 = parseInt("AF",16);　　　　　　 　　　　// 175
	   var num2 = parseInt("AF");　　　　　　　　　　　　// NaN
	   var num3 = parseInt("10",2);　　　　　　　 　　　// 2　　(按照二进制解析)
　　　　var num4 = parseInt("sdasdad");　　　　　　　　　// NaN
```

#### **parseFloat()**

　　与parseInt() 函数类似，parseFloat() 也是从第一个字符（位置0）开始解析每一个字符。也是一直解析到字符串末尾，或者解析到遇见一个无效的浮点数字字符为止。

　　也就是说，字符串中第一个小数点是有效的，而第二个小数点就是无效的了，它后面的字符串将被忽略。

　　parseFloat() 只解析十进制，因此它没有第二个参数指定基数的用法

　　如果字符串中包含的是一个可解析为正数的数（没有小数点，或者小数点后都是零），parseFloat() 会返回整数。

　　**例：**

```js
	   var num1 = parseFloat("123AF");　　　　　　 　　　　//123
	   var num2 = parseFloat("0xA");　　　　　　　　　　　　//0
	   var num3 = parseFloat("22.5");　　　　　　　 　　　 //22.5
　　　　var num4 = parseFloat("22.3.56");　　　　　　　　　//22.3
　　　　var num5 = parseFloat("0908.5");　　　　　　　　　 //908.5
```

**parseInt() 和parseFloat() 的区别在于：**

1. parseFloat() 所解析的字符串中第一个小数点是有效的，而parseInt() 遇到小数点会停止解析，因为小数点并不是有效的数字字符。
2. parseFloat() 始终会忽略前导的零，十六进制格式的字符串始终会被转换成0，而parseInt() 第二个参数可以设置基数，按照这个基数的进制来转换。

#### **相等和全等的区别**

**== vs ===**

*相等和不相等：先转换再比较*

*全等和不全等：直接比较*

相等之前的转换规则如下：

- 有Boolean类型的直接转换为数值1或0
- 有一个String和一个Number，把String转化为Number，即调用Number（）
- 如果一个是Object，而另一个不是，则调用其valueOf（）方法，得到的基本数据类型再按规则比较
- **null 和 undefined 是相等的**
- 但是！**null 和 undefined 不做任何类型转换**，意思就是null和undefined和其他任何数据类型都不相等
- 如果有一个为NaN，记住它和任何都不相等，包括它自己
- 如果两个都是Object，则判断是否是同一个对象，如果都指向同一个对象，则相等

全等就是直接比较，只要数据类型不同，就直接不全等，包括 null 和 undefined 也是不全等的！

#### 小数取整的方法

**parseInt**(5 / 2) = 2

丢弃小数部分，直接保留整数

**Math.ceil**(5 / 2) = 3

向上取整，有小数就整数加1

**Math.floor**(5 / 2) = 2

向下取整，丢弃小数部分

**Math.round**(5 / 2) = 3

四舍五入

------

## 2. 闭包

```js
for (var a = 0; a < 200; a++) { 
    setTimeout(() => console.log(a), 1000) 
}
```

- 使用立即执行函数解决闭包
- 使用promise解决闭包

我的理解：为什么要解决闭包？因为闭包带来了麻烦——

原题中，代码的本意是1000ms后逐次打印0，1，...，199 但是由于发生了闭包，每一个小函数都可以访问到大函数中的变量 a，由于变量a只有一个而且最后的值变成了200，所以可能打印了200次200，这就是由于闭包带来的麻烦。那么如何解决闭包，这也是题目的问题，其实就是让闭包消失：

1. 使用立即执行函数解决闭包

```js
for (var a = 0; a < 200; a++) { 
    // 这时候变量a只是作为一个值传给了小函数
    // 而在小函数内部没有访问a变量，所以闭包消失了
	;(function(aa){
        setTimeout(() => console.log(aa), 1000)     
    })(a)
}
```

2. 使用promise解决闭包

```javascript
for (let a = 0; a < 200; a++) {
    new Promise(function(resolve,reject){
        // 在这里a传递进去的是一个参数
        // 说明在resolve中赋值给了另一个变量（就假如是res变量吧）
        // 而且这个时候resolve函数还没有真正的调用，就已经把a的值保存下来了
        // 等到resolve函数真正调用的时候，再把res中存的a的值传给then方法中定义的函数参数aa
        setTimeout(resolve, 1000, a)
    }).then( aa => {
        console.log(aa)
    })
}
```



------

#### 什么是闭包？

![preview](https://pic4.zhimg.com/v2-2d16967becf2df18358d62a84d0595e7_r.jpg)

上面三行代码在一个立即执行函数中：

三行代码中，有一个局部变量 local，有一个函数 foo，foo 里面可以访问到 local 变量。

好了这就是一个闭包：

**「函数」和「函数内部能访问到的变量」（也叫环境）的总和，就是一个闭包。**

我的理解：

在一个局部作用域内，也就是一个**大函数**的内部，有**局部变量**，也有**小函数**，局部变量和小函数都是在大函数的内部的，这个小函数可以访问到这个局部变量，此时就已经构成了**闭包**，在这里也是原文作者的意思，只要有这个局部变量以及小函数他们俩就构成了闭包，而诸如小函数被return了，那么在大函数的外部，就可以通过return的小函数间接的访问到大函数的内部变量，只是可以利用闭包做的事，或者说使用这个闭包，以上——这是一种思考

另一种思考是：他们俩没有构成闭包，只有小函数在外部被调用从而访问到大函数内部的局部变量时，才发生了闭包，两种都可以思考方便理解，具体什么是闭包就不重要了，重要的是理解这个过程。

#### 什么是立即执行函数？

1. 声明一个匿名函数
2. 马上调用这个匿名函数

![img](https://img-blog.csdnimg.cn/20181222082706168)

#### 立即执行函数有什么用？

只有一个作用：创建一个独立的作用域。

这个作用域里面的变量，外面访问不到（即避免「变量污染」）。

以一个著名面试题为例：

```js
var liList = ul.getElementsByTagName('li')
for(var i=0; i<6; i++){
  liList[i].onclick = function(){
    alert(i) // 为什么 alert 出来的总是 6，而不是 0、1、2、3、4、5
  }
}
```

为什么 alert 的总是 6 呢，因为 i 是贯穿整个作用域的，而不是给每个 li 分配了一个 i，如下：

 

![img](https://img-blog.csdnimg.cn/20181222082706187)

那么怎么解决这个问题呢？用立即执行函数给每个 li 创造一个独立作用域即可（当然还有其他办法）：

```js
var liList = ul.getElementsByTagName('li')
for(var i=0; i<6; i++){
  !function(ii){
    liList[ii].onclick = function(){
      alert(ii) // 0、1、2、3、4、5
    }
  }(i)
}
```

在立即执行函数执行的时候，i 的值被赋值给 ii，此后 ii 的值一直不变。i 的值从 0 变化到 5，对应 6 个立即执行函数，这 6 个立即执行函数里面的 ii 「分别」是 0、1、2、3、4、5。

补充：在ES6中直接把 var 改为 let 就直接解决了这个问题

```js
var liList = ul.getElementsByTagName('li')
for(let i = 0; i<6; i++){
    liList[i].onclick = function(){
      alert(i) // 0、1、2、3、4、5
    }
}
```

**为什么？**

因为——显然，var 没有块级作用域的概念，只有全局作用域和局部作用域（即函数作用域）的概念，所以 for 循环后，即使分成了 6 个块级作用域执行，其实内部访问的还是全局变量 i ，到最后都变成了 6；而 let 有块级作用域的概念，所以大胆推测：在 6 个块级作用域内，每个作用域都定义了一个变量 i ，他们的值分别作用在块级作用域内部（为什么这么推测？因为如果 for 循环内 let 定义的 i 在6个块级作用域之上的话，那么最后访问的 i 还都是共同的6）。

#### ES6——Promise对象

[参考链接](http://caibaojian.com/es6/promise.html)

有了`Promise`对象，就可以**将异步操作以同步操作的流程表达出来，避免了层层嵌套的回调函数**。

`Promise`对象代表一个异步操作，有三种状态：`Pending`（进行中）、`Resolved`（已完成，又称Fulfilled）和`Rejected`（已失败）。

`resolve`函数的作用是，将Promise对象的状态从“未完成”变为“成功”（即从Pending变为Resolved），在异步操作成功时调用，并将异步操作的结果，作为参数传递出去；`reject`函数的作用是，将Promise对象的状态从“未完成”变为“失败”（即从Pending变为Rejected），在异步操作失败时调用，并将异步操作报出的错误，作为参数传递出去。

Promise新建后就会立即执行。

```javascript
let promise = new Promise(function(resolve, reject) {
  console.log('Promise');
  resolve();
});

promise.then(function() {
  console.log('Resolved.');
});

console.log('Hi!');

// Promise
// Hi!
// Resolved
```

上面代码中，Promise新建后立即执行，所以首先输出的是“Promise”。然后，`then`方法指定的回调函数，将在当前脚本所有同步任务执行完才会执行，所以“Resolved”最后输出。

下面这个例子很怪，可以看一下：

如果调用`resolve`函数和`reject`函数时带有参数，那么它们的参数会被传递给回调函数。`reject`函数的参数通常是Error对象的实例，表示抛出的错误；`resolve`函数的参数除了正常的值以外，还可能是另一个Promise实例，表示异步操作的结果有可能是一个值，也有可能是另一个异步操作，比如像下面这样。

```javascript
var p1 = new Promise(function (resolve, reject) {
  // ...
});

var p2 = new Promise(function (resolve, reject) {
  // ...
  resolve(p1);
})
```

上面代码中，`p1`和`p2`都是Promise的实例，但是`p2`的`resolve`方法将`p1`作为参数，即一个异步操作的结果是返回另一个异步操作。

注意，这时`p1`的状态就会传递给`p2`，也就是说，`p1`的状态决定了`p2`的状态。如果`p1`的状态是`Pending`，那么`p2`的回调函数就会等待`p1`的状态改变；如果`p1`的状态已经是`Resolved`或者`Rejected`，那么`p2`的回调函数将会立刻执行。

```javascript
var p1 = new Promise(function (resolve, reject) {
  setTimeout(() => reject(new Error('fail')), 3000)
})

var p2 = new Promise(function (resolve, reject) {
  setTimeout(() => resolve(p1), 1000)
})

p2
  .then(result => console.log(result))
  .catch(error => console.log(error))
// Error: fail
```

上面代码中，`p1`是一个Promise，3秒之后变为`rejected`。`p2`的状态在1秒之后改变，`resolve`方法返回的是`p1`。此时，由于`p2`返回的是另一个Promise，所以后面的`then`语句都变成针对后者（`p1`）。又过了2秒，`p1`变为`rejected`，导致触发`catch`方法指定的回调函数。

**Promise.prototype.then()**

Promise实例具有`then`方法，也就是说，`then`方法是定义在原型对象Promise.prototype上的。它的作用是为Promise实例添加状态改变时的回调函数。前面说过，`then`方法的第一个参数是Resolved状态的回调函数，第二个参数（可选）是Rejected状态的回调函数。

`then`方法返回的是一个新的Promise实例（注意，不是原来那个Promise实例）。因此可以采用链式写法，即`then`方法后面再调用另一个`then`方法。

------

## 3. 事件代理（事件委托）是什么？有什么用？主要用于哪些场景？

因为事件有冒泡机制，所有子节点的事件都会顺着父级节点跑回去（比如子节点触发了click事件，那么父节点也会触发click事件），所以我们可以通过监听父级节点来实现监听子节点的功能，这就是事件代理。

为什么要使用：

1. 绑定事件太多，浏览器占用内存变大，严重影响性能
2. Ajax出现，局部刷新盛行，每次加载完，都要重新绑定事件
3. 部分浏览器移除元素时，绑定的事件没有被及时移除，导致内存泄漏，严重影响性能
4. Ajax中重复绑定，导致代码耦合性过大，影响后期维护

什么时候使用：

1. 只在必须的时候，比如Ajax局部刷新区域
2. 绑定层级比较低的时候，不在body上绑定
3. 绑定次数较少的时候，把多个事件绑定合并到一次事件委托中，由这个事件委托的回调，来进行分发

提高事件委托性能

1. 降低绑定层级
2. 减少绑定次数

使用场景：很多商品放在一个ul下面的li标签里面，点击添加或删除商品，就可以绑定商品的父元素ul标签，通过事件代理去找到要点击的商品，完成添加删除事件。

------

#### 事件触发过程

当一个事件发生时（比如点击），会有一个事件发射出去，事件的触发过程主要包括3个阶段：

- 捕获阶段
- 目标阶段
- 冒泡阶段

捕获阶段：从window到目标节点寻找事件传递路径，并建立这个路径

目标阶段：在目标节点触发这个事件

冒泡阶段：事件到达目标节点后，就会沿着原来的事件传递路径返回，类似于底部浮到顶部，称为冒泡

#### 标准的事件监听函数addEventListener

```js
element.addEventListener(<event-name>, <callback>, <use-capture>);
```

<event-name>是事件名，<callback>是事件发生时的回调函数，<use-capture>为true表示在“捕获阶段”监听、为false表示在“冒泡阶段”监听。

<use-capture>默认设置为true，因为 IE 浏览器不支持在捕获阶段监听事件，为了统一而设置的。

#### 利用事件代理提升性能

因为事件有冒泡机制，所有子节点的事件都会顺着父级节点跑回去（比如子节点触发了click事件，那么父节点也会触发click事件），所以我们可以通过监听父级节点来实现监听子节点的功能，这就是事件代理。

使用事件代理主要有两个优势：

1. 减少事件绑定，提升性能。之前你需要绑定一堆子节点，而现在你只需要绑定一个父节点即可。减少了绑定事件监听函数的数量。
2. 动态变化的 DOM 结构，仍然可以监听。当一个 DOM 动态创建之后，不会带有任何事件监听，除非你重新执行事件监听函数，而使用事件代理无须担忧这个问题。

------

## 4. js如何继承?

注意一点：对于obj这个对象，无法通过`obj.属性名`的方式改变共有属性，只能改变或添加私有属性！其实只要想想this.a = a 就能理解！

**方案1：原型继承**

```js
CHILD.prototype = new PARENT();
CHILD.prototype.constructor = CHILD;
```

将子类构造函数CHILD的prototype设置为父类实例对象new PARENT()，并添加constructor属性为子类构造函数CHILD。

思考：中间的一个 小问题，就是new出来的实例作为prototype，那么父类私有的属性和方法，就不是子类私有的了，而变成了公开的。

 **方案2：CALL继承**

```js
function PARENT (name) {
	this.name = name
}
function CHILD (age) {
	PARENT.call(this, 'liu')
	this.age = age
}
```

CHILD方法中把PARENT构造函数当作普通函数来执行，让PARENT中的this指向CHILD的实例，相当于给CHILD的实例设置了PARENT的私有属性和方法，但是：

1. 只能继承父类私有的属性或方法（因为是把PARENT当作普通函数来执行，和其原型上的属性和方法没有关系）
2. 父类私有的变为子类私有的 （解决了原型继承中的问题）

**方案3：寄生组合继承**

```js
function PARENT (name) {
	this.name = name
}
function CHILD (age) {
	PARENT.call(this, 'liu')
	this.age = age
}
// 以上利用CALL实现了私有属性和方法的继承
// Object.create(OBJ):创建一个空对象，并让它的__proto__指向OBJ
// 这里因为不允许直接操作__proto__属性，所以利用这个函数
CHILD.prototype = Object.create(PARENT.prototype)
CHILD.prototype.constructor = CHILD
CHILD.prototype.getAge = function () {
    return this.age
}
// 以上实现了公有属性和方法的继承
```

这种寄生组合的继承方式实现了共有、私有的分开继承，是ES6之前最常用的继承方式。

**方案4：ES6继承**

```js
class PARENT {
    constructor (x) {
        this.x = x
    }
    getX () {
        return this.x
    }
}
// 相当于寄生组合的继承方式
class CHILD extends PARENT { // 实现了共有属性和方法的继承
    constructor (y) {
        super(100) // 实现了私有属性和方法的继承
        this.y = y
    }
    getY () {
        rerurn this.y
    }
}
```

子类只要继承父类，可以不写constructor，但是一旦写了constructor，其中的第一句话必须是super()

不写constructor，浏览器会默认创建constructor（ ...args ）{ super（ ...args ） }

------

#### ES6——class

[参考链接](http://caibaojian.com/es6/class.html)

ES6引入了class的概念，class关键字可以定义一个类，但基本上ES6中的class可以看作是一个**语法糖**，它的绝大部分功能，ES5都可以做到，引入class的写法只是让对象原型更加清晰、更像面向对象编程的语言而已。注意一下几条：

1. class定义的类和ES5的构造函数没有区别，可以直接new，但是ES6中class定义的类A**不可以直接当作函数调用**，比如A（），但是在ES5中是可以的（CALL继承的方式）
2. class定义的类中直接写的方法，其实都是定义在类的prototype属性上的，即都是公有方法，而私有方法是常见需求，但ES6不提供，只能通过变通方法模拟实现，详细实现参考[参考链接](http://caibaojian.com/es6/class.html)
3. class中constructor所有的属性都是私有属性，想添加公有属性需要直接在prototype上添加，因为语法不允许在class中直接添加公有属性
4. class定义的类不允许重定向prototype的指向

#### 什么是面向对象？

面向对象是一种编程思想，JS本身就是基于面向对象编写出来的（比如JS中有很多的内置类，像Promise就是ES6中新增的一个内置类），我们平时用的VUE也是基于面向对象构建出来的，他们都是类。

JS中的面向对象，和其他编程语言还是有略微不同的，JS中类和实例是基于原型和原型链机制来处理的。

#### 面向对象的3大特征

- 封装
- 继承
- 多态

封装：就是把客观事物封装成抽线的类，可以把自己的属性和方法暴露给可信的类或对象操作，对不可信的进行隐藏。低耦合高内聚。

继承：继承是指这样一种能力：它可以使用现有类的所有功能，并在无需重新编写原来的类的情况下对这些功能进行扩展。（我的理解：子类可以继承父类的所有属性和方法，而直接在其上进行扩展自己的属性和方法），继承主要解决的问题是：共性抽取。

多态：因为有继承的存在，才导致的多态性，一个对象拥有多种形态（就是属于多个类，类之间有继承关系），这就是对象的多态性。比如：小明是一个学生（类），也是一个人（类）。重载和重写：重载——方法名相同，形参格式或类型不一样（JS种不存在真正意义上的重载，重写——在类的继承中，子类可以重写父类中的方法）

#### 原型及原型链的理解

prototype：原型，其实就是函数function的一个属性：对象{}

\_\_proto\_\_：原型链（链接点），其实就是对象Object的一个属性：对象{}

对象的\_\_proto\_\_保存着该对象的构造函数的prototype

```js
// 理解原型链
function Test () {
    this.a = 1
}
let test = new Test()
/*
test {
	a: 1,
	__proto__: Test.prototype = {
		b: 2,
		__proto__: Object.prototype = {
			c: 3,
			// __proto__ null
		}
	}
}
*/
```

#### Function、Object：既是函数、也是对象

```js
// 上述的Test函数
console.log(Test.__proto__ === Function.prototype) // true
console.log(Function.__proto__ === Function.prototype) // true
```

每一个函数都是Function构造函数构造出来的对象，所以Test.\__proto__ === Function.prototype

Function作为一个构造函数，本身又是一个对象，作为一个对象有\_\_proto\_\_，发现Function.\__proto__  === Function.prototype，所以Funtion对象的构造函数就是Funtion本身，这也是由底层指定好的。

```js
// 现在看Object
var obj = {}
// 相当于 var obj = new Object()
// 所以Object也是一个构造函数，而且是一个对象
console.log(Object.__proto === Function.prototype) // true
```

所以Object函数对象也是由Function构造出来的，所以由以上：

```js
console.log(Object.__proto__ === Function.__proto__) // true
```

#### call bind apply 区别

三者都是重定义this的指向

```js
var liu = {
    name: 'liu',
    show: function () {
        console.log(this.name)
    }
}
liu.show() // liu
var zhang = {
    name: 'zhang'
}
liu.show.call(zhang) // zhang
liu.show.apply(zhang) // zhang
liu.show.bind(zhang)() // zhang
```

以上可知call、apply、bind重定向this到zhang对象，且第一个参数都是重定向的对象，但是只有bind是返回一个函数，所以需要加 () 重新调用。

```js
// 传参问题
var liu = {
    name: 'liu',
    show: function (A, B) {
        console.log(this.name, A, B)
    }
}
this.show(A, B) // liu A B
var zhang = {
    name: 'zhang'
}
liu.show.call(zhang, A, B) // zhang A B
liu.show.apply(zhang, [A, B]) // zhang A B
liu.show.bind(zhang, A, B)() // zhang A B
```

由上，call和bind传参都是依次传递，用逗号隔开，apply传参是把所有参数放到一个数组里传进去。

#### Function.prototype.apply()

**`apply()`** 方法调用一个具有给定`this`值的函数，以及以一个数组（或[类数组对象](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Indexed_collections#working_with_array-like_objects)）的形式提供的参数。

```js
func.apply(thisArg, [argsArray])
```

`thisArg`

必选的。在 *`func`* 函数运行时使用的 `this` 值。请注意，`this`可能不是该方法看到的实际值：如果这个函数处于[非严格模式](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Strict_mode)下，则指定为 `null` 或 `undefined` 时会自动替换为指向全局对象，原始值会被包装。

`argsArray`

可选的。一个数组或者类数组对象，其中的数组元素将作为单独的参数传给 `func` 函数。如果该参数的值为 [`null`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/null) 或 [`undefined`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/undefined)，则表示不需要传入任何参数。从ECMAScript 5 开始可以使用类数组对象。 [浏览器兼容性](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/apply#browser_compatibility) 请参阅本文底部内容。



------

## 5. 原型链

```js
//1.让Foo继承Bar（原型继承即可）
function Foo(){}
function Bar(){}
//2.Foo.__proto__是谁
//3.Foo.prototype.__proto__是谁
//4.Function.__proto__是谁（是Function.prototype）
//(验证方法：Object.getPrototypeOf(Function) === Function.prototype)
```

```js
// 1.利用原型继承实现上题
Foo.prototype = new Bar()
Foo.prototype.constructor = Foo
// 2. Foo.__proto__ 是 Function.prototype
// 因为Foo作为一个函数对象，是由Function这个构造函数构造出来的，所以Foo.__proto__ = Function.prototype
// 3. Foo.prototype.__proto__ 是 Object.prototype
// 因为Foo.prototype是一个原型对象，是由Object这个构造函数构造出来的，所以Foo.prototype.__proto__ = Object.prototype
// 4. Function.__proto__ 是 Function.prototype
// 可以理解为Function作为一个函数对象，由它自己作为构造函数创造了自己（底层就是这么规定的），所以Function.__proto__ = Function.prototype
```

补充：

```js
Object.__proto__ = Function.prototype = Function.__proto__
// Object这个构造函数对象也是由Function创造出来的
```



------

## 6. 笔试题 JavaScript

```js
// 请尽量在半小时内完成作答

// ====================
// 题目：为字符串原型增加 reverse() 方法，调用后将自己倒序返回
// 代码写在这里↓↓↓↓↓

String.prototype.reverse = function () {
    return this.split('').reverse().join('')
}

// 代码写在这里↑↑↑↑↑
console.log("123".reverse()); // "321"

// ====================
// 题目：有一个数组，里面只存在 * 和 字母，如 ['*', 'd', 'c', '*', 'e']。
// 实现一个函数把这个数组中的所有星号移动到左边，所有的字母移动到右边，所有字母的顺序不能改变。


function move(array) {
    // 代码写在这里↓↓↓↓↓
    // 1.不开辟新空间的方法
    let starNum = 0
    for (let item in arr) {
        if (arr[item] === '*') {
            for (let i = parseInt(item); i > starNum; i--) {
                temp = arr[i]
                arr[i] = arr[i - 1]
                arr[i - 1] = temp
            }
            starNum += 1
        }
    }
    // 2.下面这种开发开辟了新的内存空间
    let starList = [], temp
    for (let item in arr) {
        if (arr[item] === '*') {
            starList.push(parseInt(item))
        }
    }
    for (let item in starList) {
        for (let i = starList[item]; i > parseInt(item); i--) {
            temp = arr[i]
            arr[i] = arr[i - 1]
            arr[i - 1] = temp
        }
    }
    // 代码写在这里↑↑↑↑↑
}
const arr = ['*', 'd', 'c', '*', 'e'];
move(arr);
console.log(arr); // ['*', '*', 'd', 'c', 'e']

// ====================
// 题目：将字符串转为驼峰格式
function change(string) {
    // 代码写在这里↓↓↓↓↓
    let strList = string.split('-')
    for (let i = 1; i < strList.length; i++) {
        strList[i] = strList[i][0].toUpperCase() + strList[i].substring(1)
    }
    return strList.join('')
    // 代码写在这里↑↑↑↑↑
}
console.log(change("border-bottom-color")); // 输出 borderBottomColor

// ====================
// 题目：实现一个函数，比较两个版本号的大小。返回 1（大于）/0（等于）/-1（小于）
function compareVer(ver1, ver2) {
    // 代码写在这里↓↓↓↓↓
    ver1 = ver1.split('.')
    ver2 = ver2.split('.')
    let sameCount = 0
    for (let i = 0; i < ver1.length; i++){
        if( parseInt(ver1[i]) < parseInt(ver2[i])){
            return -1
        } else if( parseInt(ver1[i]) > parseInt(ver2[i])){
            return 1
        }
    }
    return 0
    // 代码写在这里↑↑↑↑↑
}
console.log(compareVer("1.0.20", "1.1.0")); // 1.0.20 < 1.1.0 返回 -1
console.log(compareVer("1.0.20", "1.0.3")); // 1.0.20 > 1.0.3 返回 1

// ====================
// 题目：实现一个函数，效果同 document.getElementById（通过遍历 node.childNodes 和 node.id 属性实现）
function getElementById(findId) {
    // 代码写在这里↓↓↓↓↓
    let star  = document.body, resultNode = null
    function find (node, id) {
        for (let item of Array.from(node.childNodes)){ // 把返回的nodeList这个类似数组的对象转化为数组
            if( item.id === id){
                resultNode = item
                return item
            } else if (item.childNodes.length === 0) {
                continue
            } else {
                find(item, id)
            }
        }
    }
    find(star, findId)
    return resultNode
    // 代码写在这里↑↑↑↑↑
} 
```



stringObject.**split**(separator,howmany) —— separator：分隔符；howmany：返回的最大数组长度；

arrayObject.**reverse**() —— 方法会改变原来的数组，用于颠倒数组中元素的顺序；

arrayObject.**join**(separator) —— separator：拼接数组的拼接符；

arrayObject.**sort**(sortby) —— sortby：规定排序顺序，必须是函数；数组在原数组上进行排序，不生成副本；

- 如果调用该方法时没有使用参数，将按**字母顺序对数组中的元素进行排序**，说得更精确点，是按照字符编码的顺序进行排序。要实现这一点，首先应**把数组的元素都转换成字符串**（如有必要），以便进行比较。
- 如果想按照其他标准进行排序，就需要提供比较函数，该函数要比较两个值，然后返回一个用于说明这两个值的相对顺序的数字。比较函数应该具有两个参数 a 和 b，其返回值如下：
  - 若 a 小于 b，在排序后的数组中 a 应该出现在 b 之前，则返回一个小于 0 的值；
  - 若 a 等于 b，则返回 0；
  - 若 a 大于 b，则返回一个大于 0 的值；

stringObject.**toUpperCase**() —— 一个新的字符串，在其中 stringObject 的所有小写字符全部被转换为了大写字符；

stringObject.**toLowerCase**() —— 一个新的字符串，在其中 stringObject 的所有大写字符全部被转换为了小写字符；

stringObject.**substring**(start,stop) —— 一个新的字符串，该字符串值包含 *stringObject* 的一个子字符串，其内容是从 *start* 处到 *stop*-1 处的所有字符，其长度为 *stop* 减 *start*。start：开始下标；stop：结束下标 **+1** 的位置，不写默认为结尾；

stringObject.**replace**(regexp/substr,replacement) —— 一个新的字符串，是用 *replacement* 替换了 regexp 的第一次匹配或所有匹配之后得到的;

#### ES6——数组的扩展Array.form()

[参考链接](http://caibaojian.com/es6/array.html)

`Array.from`方法用于将两类对象转为真正的数组：**类似数组的对象**（array-like object）和**可遍历（iterable）的对象**（包括ES6新增的数据结构Set和Map）。

下面是一个类似数组的对象，`Array.from`将它转为真正的数组。

```js
let arrayLike = {
    '0': 'a',
    '1': 'b',
    '2': 'c',
    length: 3
};

// ES5的写法
var arr1 = [].slice.call(arrayLike); // ['a', 'b', 'c']

// ES6的写法
let arr2 = Array.from(arrayLike); // ['a', 'b', 'c']
```

实际应用中，**常见的类似数组的对象**是**DOM操作返回的NodeList集合**，以及**函数内部的`arguments`对象**。`Array.from`都可以将它们转为真正的数组。所谓类似数组的对象，本质特征只有一点，即必须有`length`属性。因此，任何有`length`属性的对象，都可以通过`Array.from`方法转为数组，而此时扩展运算符（`...`）就无法转换。

```javascript
// NodeList对象
let ps = document.querySelectorAll('p');
Array.from(ps).forEach(function (p) {
  console.log(p);
});

// arguments对象
function foo() {
  var args = Array.from(arguments);
  // ...
}
```

上面代码中，`querySelectorAll`方法返回的是一个类似数组的对象，只有将这个对象转为真正的数组，才能使用`forEach`方法。

只要是部署了Iterator接口的数据结构，`Array.from`都能将其转为数组。

```javascript
Array.from('hello')
// ['h', 'e', 'l', 'l', 'o']

let namesSet = new Set(['a', 'b'])
Array.from(namesSet) // ['a', 'b']
```

上面代码中，字符串和Set结构都具有Iterator接口，因此可以被`Array.from`转为真正的数组。

如果参数是一个真正的数组，`Array.from`会返回一个一模一样的新数组。

```javascript
Array.from([1, 2, 3])
// [1, 2, 3]
```

值得提醒的是，扩展运算符（`...`）也可以将某些数据结构转为数组。

```javascript
// arguments对象
function foo() {
  var args = [...arguments];
}

// NodeList对象
[...document.querySelectorAll('div')]
```

扩展运算符背后调用的是遍历器接口（`Symbol.iterator`），如果一个对象没有部署这个接口，就无法转换。`Array.from`方法则是还支持类似数组的对象。所谓类似数组的对象，本质特征只有一点，即必须有`length`属性。因此，任何有`length`属性的对象，都可以通过`Array.from`方法转为数组，而此时扩展运算符就无法转换。

```javascript
Array.from({ length: 3 });
// [ undefined, undefined, undefined ]
```

上面代码中，`Array.from`返回了一个具有三个成员的数组，每个位置的值都是`undefined`。扩展运算符转换不了这个对象。

------

## 7. js如何判断数组

1. 通过instanceof运算符：`arr instanceof Array`
2. 通过isPrototypeOf()判断：`Array.prototype.isPrototypeOf(arr)`
3. 通过Object.prototype.toString判断：`Object.prototype.toString.call(arr) === '[object Array]'` 或 `Object.prototype.toString.call(arr).slice(8, -1) === 'Array'`
4. 通过原型链判断：`arr.__proto__ === Array.prototype` 或者直接写 `arr.constructor === Array` 因为constructor是proto里的属性，可以直接调用
5. 通过Array.isArray()判断：`Array.isArray(arr)`

------

#### Array.prototype.slice(start,end) 

 返回一个新的数组，这一对象是一个由 `start` 和 `end` 决定的原数组的**浅拷贝**，包含从 start 到 end （不包括该元素）的 arrayObject 中的元素。start：**可选**！开始位置下标，省略表示从开始位置；end：结束位置下标 **+1**，非必填，若不填表示到位置结束，>>>>>***也可以用 -1 表示最后位置*** <<<<<**这句话是错的！！！-1 表示的是最后位置的序号，但是end表示最后位置 +1 ，所以只能到结束位置 -1**；

#### String.prototype.slice(start,end) 

**`slice()`** 方法提取某个字符串的一部分，并返回一个新的字符串，且不会改动原字符串。同理于上不包括end。同理start可选。

#### String.prototype.substr()

`substr()` 方法返回一个字符串中从指定位置开始到指定字符数的字符。

```js
str.substr(start[, length])
```

#### Array.prototype.splice()

**`splice()`** 方法通过删除或替换现有元素或者原地添加新的元素来修改数组,并**以数组形式返回被修改的内容**。此方法会**改变原数组**。

```js
array.splice(start[, deleteCount[, item1[, item2[, ...]]]])
```

`start`

指定修改的开始位置（从0计数）。如果超出了数组的长度，则从数组末尾开始添加内容；如果是负值，则表示从数组末位开始的第几位（从-1计数，这意味着-n是倒数第n个元素并且等价于`array.length-n`）；如果负数的绝对值大于数组的长度，则表示开始位置为第0位。

`deleteCount` 可选

整数，表示要移除的数组元素的个数。

如果 `deleteCount` 大于 `start` 之后的元素的总数，则从 `start` 后面的元素都将被删除（含第 `start` 位）。

如果 `deleteCount` **被省略了**，或者它的值**大于等于**`array.length - start`(也就是说，如果它大于或者等于`start`之后的所有元素的数量)，那么`start`之后数组的所有元素**都会被删除**。

如果 `deleteCount` 是 0 或者负数，则不移除元素。这种情况下，至少应添加一个新元素。

`item1, item2, ...` 可选

要添加进数组的元素,从`start` 位置开始。如果不指定，则 `splice()` 将只删除数组元素。

返回值——只返回删除元素：

由被删除的元素组成的一个数组。如果只删除了一个元素，则返回只包含一个元素的数组。如果没有删除元素，则返回空数组。

#### Array.prototype.push(element1, ..., elementN)

`push()` 方法将一个或多个元素添加到数组的**末尾**，并返回该数组的新长度。

#### Array.prototype.pop()

`pop()`方法从数组中删除最后一个元素，并返回该元素的值。此方法更改数组的长度。

#### Array.prototype.shift()

`shift()` 方法从数组中删除**第一个**元素，并返回该元素的值。此方法更改数组的长度。`arr.shift()`

#### Array.prototype.unshift(element1, ..., elementN)

**`unshift()`** 方法将一个或多个元素添加到数组的**开头**，并返回该数组的**新长度(该**方法修改原有数组**)**。

#### Array.prototype.concat()

 `concat()` 方法用于合并两个或多个数组。此方法不会更改现有数组，而是返回一个新数组。

```js
var new_array = old_array.concat(value1[, value2[, ...[, valueN]]])
```

`valueN`可选

**数组**和/或**值**，将被合并到一个新的数组中。**如果省略**了所有 `valueN` 参数，则 `concat` 会返回调用此方法的现存数组的一个**浅拷贝**。

#### String.prototype.concat()

**`concat()`** 方法将一个或多个字符串与原字符串连接合并，形成一个新的字符串并返回。

```js
str.concat(str2, [, ...strN])
```

#### Array.prototype.indexOf()

`indexOf()`方法返回在数组中可以找到一个给定元素的第一个索引，如果不存在，则返回-1。

```js
arr.indexOf(searchElement[, fromIndex])
```

#### String.prototype.indexOf()

`indexOf()` 方法返回调用它的 String 对象中第一次出现的指定值的索引，从 `fromIndex` 处进行搜索。如果未找到该值，则返回 -1。

```js
str.indexOf(searchValue [, fromIndex])
```

#### Array.prototype.includes()

`includes()` 方法用来判断一个数组是否包含一个指定的值，根据情况，如果包含则返回 true，否则返回false。

```js
arr.includes(valueToFind[, fromIndex])
```

#### Array.prototype.find()

 `find()` 方法返回数组中满足提供的测试函数的第一个元素的值。否则返回 undefined。

```js
arr.find(callback[, thisArg])
```

`callback`

在数组每一项上执行的函数，接收 3 个参数：

- `element`

  当前遍历到的元素。

- `index`可选

  当前遍历到的索引。

- `array`可选

  数组本身。

`thisArg`可选

执行回调时用作`this` 的对象。

#### Array.prototype.reverse()

`reverse()` 方法将数组中元素的位置颠倒，并返回该数组。数组的第一个元素会变成最后一个，数组的最后一个元素变成第一个。该方法会改变原数组。

#### Array.prototype.sort()

`sort()` 方法用原地算法对数组的元素进行排序，并返回数组。默认排序顺序是在将元素转换为字符串，然后比较它们的UTF-16代码单元值序列时构建的。

```js
arr.sort([compareFunction])
```

`compareFunction` 可选

用来指定按某种顺序进行排列的函数。如果省略，元素按照转换为的字符串的各个字符的Unicode位点进行排序。

- `firstEl`

  第一个用于比较的元素。

- `secondEl`

  第二个用于比较的元素。

- 如果调用该方法时没有使用参数，将按**字母顺序对数组中的元素进行排序**，说得更精确点，是按照字符编码的顺序进行排序。要实现这一点，首先应**把数组的元素都转换成字符串**（如有必要），以便进行比较。
- 如果想按照其他标准进行排序，就需要提供比较函数，该函数要比较两个值，然后返回一个用于说明这两个值的相对顺序的数字。比较函数应该具有两个参数 a 和 b，其返回值如下：
  - 若 a 小于 b，在排序后的数组中 a 应该出现在 b 之前，则返回一个小于 0 的值；
  - 若 a 等于 b，则返回 0；
  - 若 a 大于 b，则返回一个大于 0 的值；

#### Array.prototype.join()

`join()` 方法将一个数组（或一个[类数组对象](https://developer.mozilla.org/zh-CN_docs/Web/JavaScript/Guide/Indexed_collections#working_with_array-like_objects)）的所有元素连接成一个字符串并返回这个字符串。如果数组只有一个项目，那么将返回该项目而不使用分隔符。

```js
arr.join([separator])
```

`separator` 可选

指定一个字符串来分隔数组的每个元素。如果需要，将分隔符转换为字符串。如果缺省该值，数组元素用逗号（`,`）分隔。如果`separator`是空字符串(`""`)，则所有元素之间都没有任何字符。

#### Array.prototype.map()

```js
A.map(function B)
// 创建一个新的数组
// 结果是A数组中的每一个元素, 经过B函数的计算返回值, 加入到数组
```

#### Array.prototype.filter()

```js
A.filter(function B)
// 创建一个新的数组
// 结果是A数组中的每一个元素, 经过B函数的计算返回true的所有元素, 加入到数组
```

#### Array.prototype.reduce()

`reduce()` 方法对数组中的每个元素执行一个由您提供的**reducer**函数(升序执行)，将其结果汇总为单个返回。

```js
arr.reduce(reducer(accumulator, currentValue[, index[, array]])[, initialValue])
```

**reducer** 函数执行数组中每个值 (如果没有提供 `initialValue则第一个值除外`)的函数，包含四个参数：

1. Accumulator (acc) (累计器)——累计器累计回调的返回值; 它是上一次调用回调时返回的累积值，或`initialValue`（见于下方）。
2. Current Value (cur) (当前值)——数组中正在处理的元素。
3. Current Index (idx) (当前索引，可选)——数组中正在处理的当前元素的索引。 如果提供了`initialValue`，则起始索引号为0，否则从索引1起始。
4. Source Array (src) (源数组，可选)——调用`reduce()`的数组。

您的 **reducer** 函数的返回值分配给累计器，该返回值在数组的每个迭代中被记住，并最后成为最终的单个结果值。

5. initialValue——作为第一次调用 reducer函数时的第一个参数的值。 如果没有提供初始值，则将使用数组中的第一个元素。 在没有初始值的空数组上调用 reduce 将报错。

#### Array.prototype.flat()

可以扁平化数，比如：

```js
const arr1 = [0, 1, 2, [3, 4]];
console.log(arr1.flat());
// expected output: [0, 1, 2, 3, 4]
const arr2 = [0, 1, 2, [[[3, 4]]]];
console.log(arr2.flat(2));
// expected output: [0, 1, 2, [3, 4]]
```

```js
var newArray = arr.flat([depth])
```

可以传递一个参数 depth，默认是1 ， 也就是默认可以递归一层数组！

可以设置为`Infinity`，就可以递归到最后一层！

还有可以自动去除中间的空项

```js
var arr4 = [1, 2, , 4, 5];
arr4.flat();
// [1, 2, 4, 5]
```

还可以有替代方案，思考——reduce、concat

------

## 8. 作用域（var、let、const）

var：全局作用域 和 局部作用域（即函数作用域）

let、const：块级作用域

#### ES6——let和const命令

[参考链接](http://caibaojian.com/es6/let.html)

|       | 重复定义（同一个变量）           | 修改值 | 声明提升 | 作用域                                 |
| ----- | -------------------------------- | ------ | -------- | -------------------------------------- |
| var   | 可以                             | 可以   | 会       | 全局作用域、局部作用域（即函数作用域） |
| let   | 不可以                           | 可以   | 不会     | 块级作用域                             |
| const | 不可以（且必须初始化，否则报错） | 不可以 | 不会     | 块级作用域                             |

`for`循环的计数器，就很合适使用`let`命令。

```javascript
for (let i = 0; i < 10; i++) {}

console.log(i);
//ReferenceError: i is not defined
```

上面代码中，计数器`i`只在`for`循环体内有效，在循环体外引用就会报错。

**暂时性死区**

只要块级作用域内存在`let`命令，它所声明的变量就“绑定”（binding）这个区域，不再受外部的影响。

```javascript
var tmp = 123;

if (true) {
  tmp = 'abc'; // ReferenceError
  let tmp;
}
```

上面代码中，存在全局变量`tmp`，但是块级作用域内`let`又声明了一个局部变量`tmp`，导致后者绑定这个块级作用域，所以在`let`声明变量前，对`tmp`赋值会报错。

**ES6明确规定，如果区块中存在`let`和`const`命令，这个区块对这些命令声明的变量，从一开始就形成了封闭作用域。凡是在声明之前就使用这些变量，就会报错。**

总之，在代码块内，使用let命令声明变量之前，该变量都是不可用的。这在语法上，称为“暂时性死区”（temporal dead zone，简称TDZ）。

**顶层对象的属性**

顶层对象，在浏览器环境指的是`window`对象，在Node指的是`global`对象。ES5之中，顶层对象的属性与全局变量是等价的。

```javascript
window.a = 1;
a // 1

a = 2;
window.a // 2
```

上面代码中，顶层对象的属性赋值与全局变量的赋值，是同一件事。

顶层对象的属性与全局变量挂钩，被认为是JavaScript语言最大的设计败笔之一。这样的设计带来了几个很大的问题，首先是没法在编译时就报出变量未声明的错误，只有运行时才能知道（因为全局变量可能是顶层对象的属性创造的，而属性的创造是动态的）；其次，程序员很容易不知不觉地就创建了全局变量（比如打字出错）；最后，顶层对象的属性是到处可以读写的，这非常不利于模块化编程。另一方面，`window`对象有实体含义，指的是浏览器的窗口对象，顶层对象是一个有实体含义的对象，也是不合适的。

ES6为了改变这一点，一方面规定，为了保持兼容性，`var`命令和`function`命令声明的全局变量，依旧是顶层对象的属性；另一方面规定，`let`命令、`const`命令、`class`命令声明的全局变量，不属于顶层对象的属性。也就是说，从ES6开始，全局变量将逐步与顶层对象的属性脱钩。

```javascript
var a = 1;
// 如果在Node的REPL环境，可以写成global.a
// 或者采用通用方法，写成this.a
window.a // 1

let b = 1;
window.b // undefined
```

上面代码中，全局变量`a`由`var`命令声明，所以它是顶层对象的属性；全局变量`b`由`let`命令声明，所以它不是顶层对象的属性，返回`undefined`。

------

## 9. 打印出1，用预编译解释

```js
foo();
var foo;

function foo() {
    console.log(1)
}
foo = function () {
    console.log(2)
}

// 打印出1（用预编译解释）
```

真实步骤如下：

```js
// 首先变量声明
var foo = undefined
// 然后函数声明并赋值
var foo = function () {
    console.log(1)
}
// 然后开始编译执行
foo();
// 此时打印出1
foo = function () {
    console.log(2)
}
// 这时赋值已经无意义
```



------

#### js运行三步曲

1. 语法分析
2. 预编译
3. 解释执行

#### 预编译

在JavaScript中存在一种预编译的机制，这也是Java等一些语言中没有的特性，也就正是因为这个预编译的机制，导致了js中变量提升的一些问题，下面这两句话能解决开发当中一部份问题，但不能解决所有问题，还有一些问题是你必须通过学习预编译才能解决的。

1. **函数声明**整体提升
2. **变量声明**提升（*注意是变量声明**）**意思就是函数变量不仅声明了还赋初值了!

> tip：*JS函数的调用永远都是在函数声明下面调用，即使你的调用是写在函数声明之前的，它隐式也是在函数声明下调用的。*

#### 预编译什么时候发生

预编译分为全局预编译和局部预编译，全局预编译发生在页面加载完成时执行，而局部预编译发生在函数执行的前一刻。



> *tip：预编译阶段发生变量声明和函数声明，没有初始化行为（赋值），匿名函数不参与预编译 。只有在解释执行阶段才会进行变量初始化 。*

#### 预编译前奏

**imply global**暗示全局变量，任何变量，如果变量未经声明就赋值，这些变量就为全局对象所有。***一切声明的全局变量和未经声明的变量，全归window所有。***

例如

```js
var a = 123;
window.a = 123;
```

```js
// 自己总结：记住以下
var a = 1;
// 和直接
a = 1;
// 没有任何区别！
// 都是一样的变量提升
```

下面这个函数里面只有一个连等的操作，赋值操作都是自右向左的，而b是未经声明的变量，所以它是归window的，我们可以直接使用window.b去使用它。

```js
function test(){
	// 这里的b是未经声明的变量，所以是归window所有的。
	var a = b = 110;
}
```

#### **预编译步骤**

首先JavaScript的执行过程会先扫描一下整体语法语句，如果存在逻辑错误或者语法错误，那么直接报错，程序停止执行，没有错误的话，开始从上到下解释一行执行一行。

**局部预编译的4个步骤：**

1. 创建AO对象（Activation Object）执行期上下文。
2. 找形参和变量**声明**，将变量和形参名作为AO属性名，值为undefined
3. 将实参值和形参统一。
4. 在函数体里面找函数声明，值赋予函数体。

**全局预编译的3个步骤：**

1. 创建GO对象（Global Object）全局对象。
2. 找变量声明，将变量名作为GO属性名，值为undefined
3. 查找函数声明，作为GO属性，值赋予函数体

**注意：函数是后声明的！且变量声明后赋值undefined，而函数赋值为函数体！**

由于全局中没有参数的的概念，所以省去了实参形参相统一这一步。

> **tip：**GO对象是全局预编译，所以它优先于AO对象所创建和执行

------

## 10. JS事件循环机制

JS 是一门单线程的语言，它的 **异步** 和 **多线程** 的实现是通过 **Event Loop**（事件循环机制）来实现的。*如何实现*？

**Event Loop**大致有三部分组成：调用栈（call stack）、消息队列（Message Queue）、微任务队列（Microtask Queue）

1. **Event Loop**开始时，会从Script整体代码开始一行一行执行，遇到函数调用时，会把它压入栈（call stack）中，执行函数内部的代码，函数执行完毕后会从栈中弹出；
2. 当遇到一些需要异步执行的特殊函数比如 setTimeout、setInterval等 会把他们的回调函数压入消息队列（Message Queue）中，这类特殊函数所执行的任务都叫做宏任务；但遇到像 Promise 一类的函数会把他们的回调函数压入微任务队列（Microtask Queue）中，这类特殊函数所执行的任务都叫做微任务；像Script（整体代码）也属于一个宏任务；
3. 这些被压入队列中的回调函数的执行顺序是这样的：当栈中还有函数未执行完时，就一直执行栈中的函数，直到栈中所有的函数弹出，这时检查微任务队列中是否有回调函数，有的话则依次压入栈中顺序执行，直到微任务队列为空；然后检查宏任务队列是否有回调函数，有的话则压入栈中执行，注意！执行的过程按照上面规则继续压入回调函数到消息队列和微任务队列，由此，当栈空时，继续先检查微任务队列，依次执行下去。

## 10-1. 为什么还要引入微任务?

我的理解是：**如果不引入微任务，所有这些异步操作也是可以的，直接把它们推到宏任务中就可以了，这样做有什么坏处呢？**

**那就是万一宏任务队列很长，这些可能很需要尽快处理然后反馈的任务会被延迟，这些任务本身是异步的，不可能让他去同步执行，**

**所以设计出了这种微任务队列，我认为本质上就是给异步操作设置了优先级，让异步操作的灵活性能更好，**

**因为微任务的队列中相对于宏任务队列是要有限执行的，也就是说那些优先性更高的异步任务会有选择优先执行的权力！**

主要论点：区分了优先执行的异步任务。

而且从名称上来看，宏任务一般是比较大比较耗时的任务，微任务是比较小比较快的任务，所以让小任务先执行，对队列的优化、以及用户的体验来说也是好事情。

------

**JavaScript的一大特点就是单线程，而这个线程中拥有唯一的一个事件循环**

- 一个线程中，事件循环是唯一的，但是任务队列可以拥有多个。

- 任务队列又分为macro-task（宏任务）与micro-task（微任务），在最新标准中，它们被分别称为task与jobs。

- macro-task大概包括：script(整体代码), setTimeout, setInterval, setImmediate, I/O, UI rendering。

- micro-task大概包括：process.nextTick, Promise, Object.observe(已废弃), MutationObserver(html5新特性)

- setTimeout/Promise等我们称之为任务源。而进入任务队列的是他们指定的具体执行任务。

- 来自不同任务源的任务会进入到不同的任务队列。其中setTimeout与setInterval是同源的。

- 事件循环的顺序，决定了JavaScript代码的执行顺序。它从script(整体代码)开始第一次循环。之后全局上下文进入函数调用栈。直到调用栈清空(只剩全局)，然后执行所有的micro-task。当所有可执行的micro-task执行完毕之后。循环再次从macro-task开始，找到其中一个任务队列执行完毕，然后再执行所有的micro-task，这样一直循环下去。

- 其中每一个任务的执行，无论是macro-task还是micro-task，都是借助函数调用栈来完成。

[2分钟重要参考视频](https://www.bilibili.com/video/BV1kf4y1U7Ln/?spm_id_from=333.788.b_636f6d6d656e74.36)

#### 进程 线程 同步 异步 并行 串行 并发

**进程**：进程是操作系统分配给应用程序独享的一块资源，一般一个应用程序至少拥有一个进程，进程的资源（内存、CPU、I/O等）是独立的，进程之间不共享资源；

**线程**：线程可以看作是进程执行的最小单位，是“轻量级”的进程，线程没有独立的资源，需要进程提供，多个线程可以共享进程资源；

**同步**：代码按照书写顺序，依次执行，如A-B-C-D；

**异步**：代码不按照书写顺序依次执行，如A-C-D-B；

**并行**：在同一时间**点**，多个处理器处理任务（可以是同一个任务，也可以是不同的任务）；

**串行**：在任一时间**点**，都只有一个处理器在处理任务；

理解——并行不一定异步（多个CPU同时依次处理A-B-C-D），异步也不一定需要并行（一个CPU处理A-C-D-B）

**并发**：**并行**显然只能在多核CPU上出现，而在单核CPU时代，**并发是为了模拟并行**的，就是把CPU的运行时间切分成很小的时间片，然后每一个时间片，依次处理A-B-C-D，由于很快，就感觉A、B、C、D在同时被执行，在每个时间**点**上，CPU还是在处理一个任务，本质还是串行，但是一个时间**段**内，可以看作是A、B、C、D被同时执行。

------

## 11. 手写深拷贝

**基础版本**

```js
function clone (target) {
    // 这个函数实现简单的深拷贝
    // 通过递归调用的方法实现
    // 递归思想: 假设我这个函数实现了深拷贝, 返回的是深拷贝target后的结果
    if (typeof target === 'object') {
        // 如果是复杂数据类型, 那么遍历它的所有属性, 并将它的值深拷贝
        let cloneTarget = {}
        for (const key in target) {
            cloneTarget[key] = clone(target[key])
        }
        return cloneTarget
    } else {
        // 否则是基本数据类型, 直接返回target即可, 就可以实现数值复制
        return target
    }
}
// 显然，上面的方法是不全面的！
```

**考虑数组**

```js
// 如果是数组，会在 for in 中被解组成一个个的属性，显然不对的
function clone (target) {
    if (typeof target === 'object') {
        // 如果是数组，只需要添加如下判别即可
        let cloneTarget = Array.isArray(target) ? [] : {}
        for (const key in target) {
            cloneTarget[key] = clone(target[key])
        }
        return cloneTarget
    } else {
        return target
    }
}
```

**循环引用**

```js
// 考虑下面这个问题
const target = {
    field1: 1,
    field2: undefined,
    field3: {
        child: 'child'
    },
    field4: [2, 4, 8]
}
target.target = target
// 这时候clone方法会进入死循环中！因为没有了递归出口！
```

```js
// 解决方法是增加 target - cloneTarget 键值对，利用Map数据结构实现
// 想法是这样的：我为每一个 target 创建一个 target - cloneTarget 键值对
// 每次开始clone前增加一个判断：这个target是否有键值对了？
// 如果有，说明了什么？说明了在后面的克隆过程中，某一个target[key]又指向了target，循环引用发生了
// 这时候直接return clone的target即可，意思就是循环引用也克隆下来
function clone (target, map = new Map()) {
    if (typeof target === 'object') {
        let cloneTarget = Array.isArray(target) ? [] : {}
		// 判断target的键值对是否存在Map中了
        if (map.get(target)) {
            return map.get(target)
        }
        // 每一个target都设置一个键值对
        map.set(target, cloneTarget)
        for (const key in target) {
            cloneTarget[key] = clone(target[key], map)
        }
        return cloneTarget
    } else {
        return target
    }
}
```

**拷贝函数——还有很多其他的数据类型，这里值说明函数**

```js
// 如果是函数，会被识别为 typrof target === 'function' 因此会进入else直接返回，就成了浅拷贝
// 如股是null，也会被识别成object，无法正确返回
// 下面先写一个拷贝函数的方法
function cloneFunction (func) {
    const bodyReg = /(?<={)(.|\n)+(?=})/m
    // 记住这个正则并不是最完美的，会有遗漏的情况
    const paramReg = /(?<=\().+(?=\)\s+{)/  
    const funcString = func.toString()
    // 首先判断func是普通函数还是类似箭头函数的其他函数
    if (func.prototype) {
        console.log('是普通函数')
        const body = bodyReg.exec(funcString)
        const param = paramReg.exec(funcString)
        if (body) {
            console.log('找到了函数体', body[0])
            if (param) {
                const paramArgs = param[0].split(',')
                console.log('找到了参数', paramsArgs)
                return new Function(...paramArgs, body[0])
            } else {
                return new Function(body[0])
            }
        } else {
            // 这里直接返回了null
            // 严格来说，没有函数体的函数也是一个函数，不能直接返回null
            return null
        }
    } else {
        console.log('是其他函数')
        // eval(str)用来把str字符串当作js代码来执行
        // 在这里funcString就是定义一个函数的代码执行
        return eval(funcString)
    }
}
```



------

#### 深拷贝 浅拷贝

深拷贝和浅拷贝只针对像 Object、Array 这样的复杂对象的，浅拷贝只拷贝一层对象的属性，而深拷贝则递归拷贝了所有层级。

浅拷贝——

*创建一个新对象，这个对象有着原始对象属性值的一份精确拷贝。如果属性是基本类型，拷贝的就是基本类型的值，如果属性是引用类型，拷贝的就是内存地址 ，所以如果其中一个对象改变了这个地址，就会影响到另一个对象。*

深拷贝——

*将一个对象从内存中完整的拷贝一份出来，从堆内存中开辟一个新的区域存放新对象,且修改新对象不会影响原对象。*

#### JS的拷贝方法

1. `Object.assign(target, ...source)` 方法用于将所有可枚举属性的值从一个或多个源对象（...source）分配到目标对象（target）。它将返回目标对象。只能拷贝一层对象属性，是一种**浅拷贝**方式；
2. `JSON.parse(JSON.stringify())`：`JSON.stringify()` 方法将一个 JavaScript 对象或值转换为 JSON 字符串。`JSON.parse()` 方法用来解析JSON字符串，构造由字符串描述的JavaScript值或对象。可以实现**深拷贝但是**！无法拷贝`function`和`undefined`以及其他引用类型；
3. `Object.create(obj)`方法创建一个新对象，是之`__proto__`属性指向obj对象；可以实现**浅拷贝**，但是很差别用；

#### ES6——Set和Map数据结构

[参考链接](http://caibaojian.com/es6/set-map.html)

**Set基本用法**

ES6提供了新的数据结构Set。它类似于数组，但是成员的值都是唯一的，没有重复的值。

（意思就是即使你往数组里面添加了重复的值，也添加不上去）

Set本身是一个构造函数，用来生成Set数据结构。

```js
var s = new Set();
[2, 3, 5, 4, 5, 2, 2].map(x => s.add(x));
for (let i of s) {
  console.log(i);
}
// 2 3 5 4
```

Set函数可以接受一个数组（或类似数组的对象）作为参数，用来初始化。

```js
// 例一
var set = new Set([1, 2, 3, 4, 4])
[...set]
// [1, 2, 3, 4]
// 例二
var items = new Set([1, 2, 3, 4, 5, 5, 5, 5])
items.size // 5
// 例三
function divs () {
  return [...document.querySelectorAll('div')] // 这里其实解构成了一个数组
}
// 即使不解构成数组，也是可以直接new Set的
var set = new Set(divs())
```

向Set加入值的时候，不会发生类型转换，所以`5`和`"5"`是两个不同的值。Set内部判断两个值是否不同，使用的算法叫做“Same-value equality”，它类似于精确相等运算符（`===`），主要的区别是`NaN`等于自身，而精确相等运算符认为`NaN`不等于自身。

另外，两个对象总是不相等的。

```javascript
let set = new Set();

set.add({});
set.size // 1

set.add({});
set.size // 2
```

上面代码表示，由于两个空对象不相等，所以它们被视为两个值。

**Set实例的属性和方法**

Set结构的实例有以下属性。

- `Set.prototype.constructor`：构造函数，默认就是`Set`函数。
- `Set.prototype.size`：返回`Set`实例的成员总数。

Set实例的方法分为两大类：操作方法（用于操作数据）和遍历方法（用于遍历成员）。下面先介绍四个操作方法。

- `add(value)`：添加某个值，返回Set结构本身。
- `delete(value)`：删除某个值，返回一个布尔值，表示删除是否成功。
- `has(value)`：返回一个布尔值，表示该值是否为`Set`的成员。
- `clear()`：清除所有成员，没有返回值。

`Array.from`方法可以将Set结构转为数组。这就提供了去除数组重复成员的另一种方法。

```js
function dedupe(array) {
  return Array.from(new Set(array));
}
```

**Set遍历操作**

Set结构的实例有四个遍历方法，可以用于遍历成员。

- `keys()`：返回键名的遍历器
- `values()`：返回键值的遍历器
- `entries()`：返回键值对的遍历器
- `forEach()`：使用回调函数遍历每个成员

注意：Set数据结构的 键 和 值 相等。forEach 是无法中止的，无法break、continue、return。

**遍历的应用**

扩展运算符（`...`）内部使用`for...of`循环，所以也可以用于Set结构。

扩展运算符和Set结构相结合，就可以去除数组的重复成员。

```javascript
let arr = [3, 5, 2, 2, 5, 5];
let unique = [...new Set(arr)];
// [3, 5, 2]
```

而且，数组的`map`和`filter`方法也可以用于Set了。

```javascript
let set = new Set([1, 2, 3]);
set = new Set([...set].map(x => x * 2));
// 返回Set结构：{2, 4, 6}

let set = new Set([1, 2, 3, 4, 5]);
set = new Set([...set].filter(x => (x % 2) == 0));
// 返回Set结构：{2, 4}
```

**WeakSet**

WeakSet结构与Set类似，也是不重复的值的集合。但是，它与Set有两个区别。

首先，**WeakSet的成员只能是对象**，而不能是其他类型的值。

其次，WeakSet中的对象都是弱引用，即垃圾回收机制不考虑WeakSet对该对象的引用，也就是说，如果其他对象都不再引用该对象，那么垃圾回收机制会自动回收该对象所占用的内存，不考虑该对象还存在于WeakSet之中。这个特点意味着，无法引用WeakSet的成员，因此WeakSet是不可遍历的。

我的理解：弱引用，指的是即使这个对象被引用了，还是有可能被垃圾回收机制回收；而WeakSet中的对象，如果仅仅只是被添加它进入的WeakSet实例所用，那么是有可能被回收的！！！意思就是，这个对象**必须得被其他的对象引用**，否则会被回收！！！

WeakSet结构有以下三个方法。

- **WeakSet.prototype.add(value)**：向WeakSet实例添加一个新成员。
- **WeakSet.prototype.delete(value)**：清除WeakSet实例的指定成员。
- **WeakSet.prototype.has(value)**：返回一个布尔值，表示某个值是否在WeakSet实例之中。

**Map结构的目的和基本用法**

JavaScript的对象（Object），本质上是键值对的集合（Hash结构），但是**传统上只能用字符串当作键**。这给它的使用带来了很大的限制。

为了解决这个问题，ES6提供了Map数据结构。它类似于对象，也是键值对的集合，但是“键”的范围不限于字符串，**各种类型的值（包括对象）都可以当作键**。也就是说，Object结构提供了“字符串—值”的对应，Map结构提供了“值—值”的对应，是一种更完善的Hash结构实现。如果你需要“键值对”的数据结构，Map比Object更合适。

Map的键实际上是跟内存地址绑定的，只要内存地址不一样，就视为两个键。这就解决了同名属性碰撞（clash）的问题，我们扩展别人的库的时候，如果使用对象作为键名，就不用担心自己的属性与原作者的属性同名。

```js
var map = new Map();
var k1 = ['a'];
var k2 = ['a'];

map.set(k1, 111).set(k2, 222); // 证明set返回的还是set实例本身，所以可以链式调用

map.get(k1) // 111
map.get(k2) // 222
```

**WeakMap**

`WeakMap`结构与`Map`结构基本类似，唯一的区别是它**只接受对象作为键名**（`null`除外），不接受其他类型的值作为键名，而且键名所指向的对象，不计入垃圾回收机制（意思就是这个引用不被考虑）。

`WeakMap`的设计目的在于，键名是对象的弱引用（垃圾回收机制不将该引用考虑在内），所以其所对应的对象可能会被自动回收。当对象被回收后，`WeakMap`自动移除对应的键值对。典型应用是，一个对应DOM元素的`WeakMap`结构，当某个DOM元素被清除，其所对应的`WeakMap`记录就会自动被移除。基本上，`WeakMap`的专用场合就是，它的键所对应的对象，可能会在将来消失。`WeakMap`结构有助于防止内存泄漏。

重要理解：（对于对象）变量存储着地址！地址指向对象！只要这个弱引用的对象不在被其他的地址指着（包括变量存储的地址直接指着，或者其他对象内部的属性指着），就有可能会被回收！

#### ES6——Symbol

[参考链接](http://caibaojian.com/es6/symbol.html)

ES5的对象属性名都是字符串，这容易造成属性名的冲突。比如，你使用了一个他人提供的对象，但又想为这个对象添加新的方法（mixin模式），新方法的名字就有可能与现有方法产生冲突。如果有一种机制，保证每个属性的名字都是独一无二的就好了，这样就从根本上防止属性名的冲突。这就是ES6引入Symbol的原因。

ES6引入了一种新的原始数据类型Symbol，表示独一无二的值。它是JavaScript语言的第七种数据类型，前六种是：Undefined、Null、布尔值（Boolean）、字符串（String）、数值（Number）、对象（Object）。

Symbol值通过`Symbol`函数生成。这就是说，对象的属性名现在可以有两种类型，**一种是原来就有的字符串，另一种就是新增的Symbol类型**。凡是属性名属于Symbol类型，就都是独一无二的，可以保证不会与其他属性名产生冲突。

```js
let s = Symbol();

typeof s
// "symbol"
```

注意，`Symbol`函数前不能使用`new`命令，否则会报错。这是因为生成的Symbol是一个原始类型的值，不是对象。也就是说，由于Symbol值不是对象，所以不能添加属性。基本上，它是一种类似于字符串的数据类型。

`Symbol`函数可以接受一个字符串作为参数，表示对Symbol实例的描述，主要是为了在控制台显示，或者转为字符串时，比较容易区分。

```js
var s1 = Symbol('foo');
var s2 = Symbol('bar');

s1 // Symbol(foo)
s2 // Symbol(bar)

s1.toString() // "Symbol(foo)"
s2.toString() // "Symbol(bar)"
```

上面代码中，`s1`和`s2`是两个Symbol值。如果不加参数，它们在控制台的输出都是`Symbol()`，不利于区分。有了参数以后，就等于为它们加上了描述，输出的时候就能够分清，到底是哪一个值。

如果 Symbol 的参数是一个对象，就会调用该对象的`toString`方法，将其转为字符串，然后才生成一个 Symbol 值。

```javascript
const obj = {
  toString() {
    return 'abc';
  }
};
const sym = Symbol(obj);
sym // Symbol(abc)
```

注意，`Symbol`函数的参数只是表示对当前 Symbol 值的描述，因此相同参数的`Symbol`函数的返回值是不相等的。

```javascript
// 没有参数的情况
var s1 = Symbol();
var s2 = Symbol();

s1 === s2 // false

// 有参数的情况
var s1 = Symbol('foo');
var s2 = Symbol('foo');

s1 === s2 // false
```

上面代码中，`s1`和`s2`都是`Symbol`函数的返回值，而且参数相同，但是它们是不相等的。

Symbol值不能与其他类型的值进行运算，会报错。

```javascript
var sym = Symbol('My symbol');

"your symbol is " + sym
// TypeError: can't convert symbol to string
`your symbol is ${sym}`
// TypeError: can't convert symbol to string
```

但是，Symbol值可以显式转为字符串。

```javascript
var sym = Symbol('My symbol');

String(sym) // 'Symbol(My symbol)'
sym.toString() // 'Symbol(My symbol)'
```

另外，Symbol值也可以转为布尔值，但是不能转为数值。

```javascript
var sym = Symbol();
Boolean(sym) // true
!sym  // false

if (sym) {
  // ...
}

Number(sym) // TypeError
sym + 2 // TypeError
```

Symbol 作为属性名，该属性不会出现在`for...in`、`for...of`循环中，也不会被`Object.keys()`、`Object.getOwnPropertyNames()`、`JSON.stringify()`返回。但是，它也不是私有属性，有一个`Object.getOwnPropertySymbols`方法，可以获取指定对象的所有 Symbol 属性名。

`Object.getOwnPropertySymbols`方法返回一个数组，成员是当前对象的所有用作属性名的 Symbol 值。

```javascript
var obj = {};
var a = Symbol('a');
var b = Symbol('b');

obj[a] = 'Hello';
obj[b] = 'World';

var objectSymbols = Object.getOwnPropertySymbols(obj);

objectSymbols
// [Symbol(a), Symbol(b)]
```

有时，我们希望重新使用同一个Symbol值，`Symbol.for`方法可以做到这一点。它接受一个字符串作为参数，然后搜索有没有以该参数作为名称的Symbol值。如果有，就返回这个Symbol值，否则就新建并返回一个以该字符串为名称的Symbol值。

```javascript
var s1 = Symbol.for('foo');
var s2 = Symbol.for('foo');

s1 === s2 // true
```

上面代码中，`s1`和`s2`都是 Symbol 值，但是它们都是同样参数的`Symbol.for`方法生成的，所以实际上是同一个值。

`Symbol.for()`与`Symbol()`这两种写法，都会生成新的Symbol。它们的区别是，前者会被登记在全局环境中供搜索，后者不会。`Symbol.for()`不会每次调用就返回一个新的 Symbol 类型的值，而是会先检查给定的`key`是否已经存在，如果不存在才会新建一个值。比如，如果你调用`Symbol.for("cat")`30次，每次都会返回同一个 Symbol 值，但是调用`Symbol("cat")`30次，会返回30个不同的Symbol值。

```javascript
Symbol.for("bar") === Symbol.for("bar")
// true

Symbol("bar") === Symbol("bar")
// false
```

上面代码中，由于`Symbol()`写法没有登记机制，所以每次调用都会返回一个不同的值。

`Symbol.keyFor`方法返回一个已登记的 Symbol 类型值的`key`。

```javascript
var s1 = Symbol.for("foo");
Symbol.keyFor(s1) // "foo"

var s2 = Symbol("foo");
Symbol.keyFor(s2) // undefined
```

上面代码中，变量`s2`属于未登记的Symbol值，所以返回`undefined`。

#### Symbol.iterator

对象的`Symbol.iterator`属性，指向该对象的默认遍历器方法。

```javascript
var myIterable = {};
myIterable[Symbol.iterator] = function* () {
  yield 1;
  yield 2;
  yield 3;
};

[...myIterable] // [1, 2, 3]
```

对象进行`for...of`循环时，会调用`Symbol.iterator`方法，返回该对象的默认遍历器，详细介绍参见《Iterator和for...of循环》一章。

```javascript
class Collection {
  *[Symbol.iterator]() {
    let i = 0;
    while(this[i] !== undefined) {
      yield this[i];
      ++i;
    }
  }
}

let myCollection = new Collection();
myCollection[0] = 1;
myCollection[1] = 2;

for(let value of myCollection) {
  console.log(value);
}
// 1
// 2
```

#### ES6——Iterator和for...of循环

[参考链接](http://caibaojian.com/es6/iterator.html)

JavaScript原有的表示“集合”的数据结构，主要是数组（Array）和对象（Object），ES6又添加了Map和Set。这样就有了四种数据集合，用户还可以组合使用它们，定义自己的数据结构，比如数组的成员是Map，Map的成员是对象。这样就需要一种统一的接口机制，来处理所有不同的数据结构。

遍历器（Iterator）就是这样一种机制。它是一种接口，为各种不同的数据结构提供统一的访问机制。任何数据结构只要部署Iterator接口，就可以完成遍历操作（即依次处理该数据结构的所有成员）。

Iterator的作用有三个：一是为各种数据结构，提供一个统一的、简便的访问接口；二是使得数据结构的成员能够按某种次序排列；三是ES6创造了一种新的遍历命令`for...of`循环，Iterator接口主要供`for...of`消费。

在ES6中，有些数据结构原生具备Iterator接口（比如数组），即不用任何处理，就可以被`for...of`循环遍历，有些就不行（比如对象）。原因在于，这些数据结构原生部署了`Symbol.iterator`属性（详见下文），另外一些数据结构没有。凡是部署了`Symbol.iterator`属性的数据结构，就称为部署了遍历器接口。调用这个接口，就会返回一个遍历器对象。

**数据结构的默认Iterator接口**

Iterator接口的目的，就是为所有数据结构，提供了一种统一的访问机制，即`for...of`循环（详见下文）。当使用`for...of`循环遍历某种数据结构时，该循环会自动去寻找Iterator接口。

一种数据结构只要部署了Iterator接口，我们就称这种数据结构是”可遍历的“（iterable）。

ES6规定，默认的Iterator接口部署在数据结构的`Symbol.iterator`属性，或者说，一个数据结构只要具有`Symbol.iterator`属性，就可以认为是“可遍历的”（iterable）。`Symbol.iterator`属性本身是一个函数，就是当前数据结构默认的遍历器生成函数。执行这个函数，就会返回一个遍历器。至于属性名`Symbol.iterator`，它是一个表达式，返回`Symbol`对象的`iterator`属性，这是一个预定义好的、类型为Symbol的特殊值，所以要放在方括号内。（参见Symbol一章）。

```javascript
const obj = {
  [Symbol.iterator] : function () {
    return {
      next: function () {
        return {
          value: 1,
          done: true
        };
      }
    };
  }
};
```

上面代码中，对象`obj`是可遍历的（iterable），因为具有`Symbol.iterator`属性。执行这个属性，会返回一个遍历器对象。该对象的根本特征就是具有`next`方法。每次调用`next`方法，都会返回一个代表当前成员的信息对象，具有`value`和`done`两个属性。

在ES6中，有三类数据结构**原生具备I**terator接口：**数组、某些类似数组的对象、Set和Map结构**。

上面提到，原生就部署Iterator接口的数据结构有三类，对于这三类数据结构，不用自己写遍历器生成函数，`for...of`循环会自动遍历它们。除此之外，其他数据结构（主要是对象）的Iterator接口，都需要自己在`Symbol.iterator`属性上面部署，这样才会被`for...of`循环遍历。

对象（Object）之所以没有默认部署Iterator接口，是因为对象的哪个属性先遍历，哪个属性后遍历是不确定的，需要开发者手动指定。本质上，遍历器是一种线性处理，对于任何非线性的数据结构，部署遍历器接口，就等于部署一种线性转换。不过，严格地说，对象部署遍历器接口并不是很必要，因为这时对象实际上被当作Map结构使用，ES5没有Map结构，而ES6原生提供了。

一个对象如果要有可被`for...of`循环调用的Iterator接口，就必须在`Symbol.iterator`的属性上部署遍历器生成方法（原型链上的对象具有该方法也可）。

对于类似数组的对象（存在数值键名和length属性），部署Iterator接口，有一个简便方法，就是`Symbol.iterator`方法直接引用数组的Iterator接口。

下面是类似数组的对象调用数组的`Symbol.iterator`方法的例子。

```javascript
let iterable = {
  0: 'a',
  1: 'b',
  2: 'c',
  length: 3,
  [Symbol.iterator]: Array.prototype[Symbol.iterator]
};
for (let item of iterable) {
  console.log(item); // 'a', 'b', 'c'
}
```

注意，普通对象部署数组的`Symbol.iterator`方法，并无效果。**仔细对比上下两例子！**

```javascript
let iterable = {
  a: 'a',
  b: 'b',
  c: 'c',
  length: 3,
  [Symbol.iterator]: Array.prototype[Symbol.iterator]
};
for (let item of iterable) {
  console.log(item); // undefined, undefined, undefined
}
```

如果`Symbol.iterator`方法对应的不是遍历器生成函数（即会返回一个遍历器对象），解释引擎将会报错。

**调用Iterator接口的场合**

**（1）解构赋值**

对数组和Set结构进行解构赋值时，会默认调用`Symbol.iterator`方法。

```javascript
let set = new Set().add('a').add('b').add('c');

let [x,y] = set;
// x='a'; y='b'

let [first, ...rest] = set;
// first='a'; rest=['b','c'];
```

**（2）扩展运算符**

扩展运算符（...）也会调用默认的iterator接口。

```javascript
// 例一
var str = 'hello';
[...str] //  ['h','e','l','l','o']

// 例二
let arr = ['b', 'c'];
['a', ...arr, 'd']
// ['a', 'b', 'c', 'd']
```

上面代码的扩展运算符内部就调用Iterator接口。

实际上，这提供了一种简便机制，可以将任何部署了Iterator接口的数据结构，转为数组。也就是说，只要某个数据结构部署了Iterator接口，就可以对它使用扩展运算符，将其转为数组。

```javascript
let arr = [...iterable];
```

**（3）yield\*** （**待研究**）

yield*后面跟的是一个可遍历的结构，它会调用该结构的遍历器接口。

```javascript
let generator = function* () {
  yield 1;
  yield* [2,3,4];
  yield 5;
};

var iterator = generator();

iterator.next() // { value: 1, done: false }
iterator.next() // { value: 2, done: false }
iterator.next() // { value: 3, done: false }
iterator.next() // { value: 4, done: false }
iterator.next() // { value: 5, done: false }
iterator.next() // { value: undefined, done: true }
```

**（4）其他场合**

由于数组的遍历会调用遍历器接口，所以任何接受数组作为参数的场合，其实都调用了遍历器接口。下面是一些例子。

- for...of
- Array.from()
- Map(), Set(), WeakMap(), WeakSet()（比如`new Map([['a',1],['b',2]])`）
- Promise.all()
- Promise.race()

**字符串的Iterator接口**

*字符串是一个类似数组的对象，也原生具有Iterator接口。*

#### Iterator接口与Generator函数（待看）

**遍历器对象的return()，throw()**

遍历器对象除了具有`next`方法，还可以具有`return`方法和`throw`方法。如果你自己写遍历器对象生成函数，那么`next`方法是必须部署的，`return`方法和`throw`方法是否部署是可选的。

`return`方法的使用场合是，如果`for...of`循环提前退出（通常是因为出错，或者有`break`语句或`continue`语句），就会调用`return`方法。如果一个对象在完成遍历前，需要清理或释放资源，就可以部署`return`方法。

**for...of循环**

ES6 借鉴 C++、Java、C# 和 Python 语言，引入了`for...of`循环，作为遍历所有数据结构的统一的方法。

一个数据结构只要部署了`Symbol.iterator`属性，就被视为具有iterator接口，就可以用`for...of`循环遍历它的成员。也就是说，`for...of`循环内部调用的是数据结构的`Symbol.iterator`方法。

`for...of`循环可以使用的范围包括数组、Set 和 Map 结构、某些类似数组的对象（比如`arguments`对象、DOM NodeList 对象）、后文的 Generator 对象，以及字符串。

**计算生成的数据结构**

有些数据结构是在现有数据结构的基础上，计算生成的。比如，ES6的数组、Set、Map都部署了以下三个方法，调用后都返回遍历器对象。

- `entries()` 返回一个遍历器对象，用来遍历`[键名, 键值]`组成的数组。对于数组，键名就是索引值；对于Set，键名与键值相同。Map结构的iterator接口，默认就是调用entries方法。
- `keys()` 返回一个遍历器对象，用来遍历所有的键名。
- `values()` 返回一个遍历器对象，用来遍历所有的键值。

这三个方法调用后生成的遍历器对象，所遍历的都是计算生成的数据结构。

```javascript
let arr = ['a', 'b', 'c'];
for (let pair of arr.entries()) {
  console.log(pair);
}
// [0, 'a']
// [1, 'b']
// [2, 'c']
```

**与其他遍历语法的比较**

以数组为例，JavaScript提供多种遍历语法。最原始的写法就是for循环。

```javascript
for (var index = 0; index < myArray.length; index++) {
  console.log(myArray[index]);
}
```

这种写法比较麻烦，因此数组提供内置的forEach方法。

```javascript
myArray.forEach(function (value) {
  console.log(value);
});
```

这种写法的问题在于，无法中途跳出`forEach`循环，break命令或return命令都不能奏效。

`for...in`循环可以遍历数组的键名。

```javascript
for (var index in myArray) {
  console.log(myArray[index]);
}
```

for...in循环有几个缺点。

- 数组的键名是数字，但是for...in循环是以字符串作为键名“0”、“1”、“2”等等。
- for...in循环不仅遍历数字键名，还会遍历手动添加的其他键，甚至包括原型链上的键。
- 某些情况下，for...in循环会以任意顺序遍历键名。

总之，`for...in`循环主要是为遍历对象而设计的，不适用于遍历数组。

`for...of`循环相比上面几种做法，有一些显著的优点。

```javascript
for (let value of myArray) {
  console.log(value);
}
```

- 有着同for...in一样的简洁语法，但是没有for...in那些缺点。
- 不同用于forEach方法，它可以与break、continue和return配合使用。
- 提供了遍历所有数据结构的统一操作接口。

------

## 12. ES6 的箭头函数和以前的普通函数的区别

 **——箭头函数可以作为构造函数吗（可以使用 new 操作符的调用吗）？为什么？**

区别：

1. 箭头函数是使用箭头来定义一个函数的，function不用写，如果只有一个参数可以不写括号，如果只有一个语句，可以省略return
2. 箭头函数内的this指向的是它定义时所在的对象，而不是使用时所在的对象，是固定的不会改变（普通函数与之相反）
3. 箭头函数不可以用作构造函数，不可以使用new命令，否则会报错
4. 不可以使用`arguments`对象，该对象在箭头函数中不存在，但是可以使用rest代替
5. （还不明白）不可以使用`yield`，因此箭头函数不能用作Generator函数

不可以用作构造函数，原因：

先明白new关键字的作用如下：

1. 创建一个js的空对象
2. 让这个对象的proto属性指向构造函数的prototype属性
3. 把这个构造函数就当作普通函数执行，但是让他内部的this指向new新建的对象
4. 如果函数本身没有返回对象，则返回this

那么为什么箭头函数使用new关键字会报错呢？

原因就出在第三步改变函数内部的this指向，箭头函数内部其实没有自己的this，它的this其实就是包裹着它的外部函数中的this，是借用别人的this，所以就没有办法为新添加的对象增加属性方法，所以无法使用new。



------

#### ES6——函数的扩展

ES6允许为函数的参数设置默认值，即直接写在参数定义的后面。`function log(x, y = 'World')`，如果参数不赋初值就为默认值。

除了简洁，ES6的写法还有两个好处：首先，阅读代码的人，可以立刻意识到哪些参数是可以省略的，不用查看函数体或文档；其次，有利于将来的代码优化，即使未来的版本在对外接口中，彻底拿掉这个参数，也不会导致以前的代码无法运行。

参数默认值可以与解构赋值的默认值，结合起来使用。

```javascript
function foo({x, y = 5}) {
  console.log(x, y);
}

foo({}) // undefined, 5
foo({x: 1}) // 1, 5
foo({x: 1, y: 2}) // 1, 2
foo() // TypeError: Cannot read property 'x' of undefined
```

**函数的length属性**

指定了默认值以后，函数的`length`属性，将返回没有指定默认值的参数个数。也就是说，指定了默认值后，`length`属性将失真。

```javascript
(function (a) {}).length // 1
(function (a = 5) {}).length // 0
(function (a, b, c = 5) {}).length // 2
```

如果设置了默认值的参数不是尾参数，那么`length`属性也**不再计入后面**的参数了。

```javascript
(function (a = 0, b, c) {}).length // 0
(function (a, b = 1, c) {}).length // 1
```

**作用域**

一个需要注意的地方是，如果参数默认值是一个变量，则该变量所处的作用域，与其他变量的作用域规则是一样的，即先是当前函数的作用域，然后才是全局作用域。

```javascript
var x = 1;

function f(x, y = x) {
  console.log(y);
}

f(2) // 2
```

上面代码中，参数`y`的默认值等于`x`。调用时，由于函数作用域内部的变量`x`已经生成，所以`y`等于参数`x`，而不是全局变量`x`。

如果调用时，函数作用域内部的变量`x`没有生成，结果就会不一样。

```javascript
let x = 1;

function f(y = x) {
  let x = 2;
  console.log(y);
}

f() // 1
```

仔细思考上面的过程是为什么？把 `let x = 2` 改成 var 也是一样的结果，而且再次用 let 声明 y 也会报错，说明了什么？首先，函数（y=x）内的变量不能用 let 或 const 重复声明，其次一定是先执行（y=x）内的赋值操作，才会执行后面 { } 内的操作，所以初始赋值的时候，{ } 内声明的代码还没有执行。

**rest参数**

ES6引入rest参数（形式为“...变量名”），用于获取函数的多余参数，这样就不需要使用arguments对象了。rest参数搭配的变量是一个**数组**，该变量将**多余的参数**放入数组中。

注意，rest参数之后不能再有其他参数（即只能是最后一个参数），否则会报错。

```js
function push(array, ...items) 
```

函数的length属性，不包括rest参数。

**扩展运算符**

扩展运算符（spread）是三个点（`...`）。它好比rest参数的逆运算（rest是把一堆参数逗号转化为数组），将一个数组转为用逗号分隔的参数序列。其实扩展运算符内部调用的是数据结构的Iterator接口，因此只要具有Iterator接口的对象，都可以使用扩展运算符。

```js
// 自己理解：...items === A,B,C,D  所以 item 是个数组，...是个结构数组的运算符
```

下面是扩展运算符取代`apply`方法的一个实际的例子，应用`Math.max`方法，简化求出一个数组最大元素的写法。

```javascript
// ES5的写法
Math.max.apply(null, [14, 3, 77])

// ES6的写法
Math.max(...[14, 3, 77])

// 等同于
Math.max(14, 3, 77);
```

上面代码表示，由于JavaScript不提供求数组最大元素的函数，所以只能套用`Math.max`函数，将数组转为一个参数序列，然后求最大值。有了扩展运算符以后，就可以直接用`Math.max`了。

另一个例子是通过`push`函数，将一个数组添加到另一个数组的尾部。

```javascript
// ES5的写法
var arr1 = [0, 1, 2];
var arr2 = [3, 4, 5];
Array.prototype.push.apply(arr1, arr2);

// ES6的写法
var arr1 = [0, 1, 2];
var arr2 = [3, 4, 5];
arr1.push(...arr2);
```

上面代码的ES5写法中，`push`方法的参数不能是数组，所以只好通过`apply`方法变通使用`push`方法。有了扩展运算符，就可以直接将数组传入`push`方法。

**合并数组**

扩展运算符提供了数组合并的新写法。

```javascript
// ES5
[1, 2].concat(more)
// ES6
[1, 2, ...more]

var arr1 = ['a', 'b'];
var arr2 = ['c'];
var arr3 = ['d', 'e'];

// ES5的合并数组
arr1.concat(arr2, arr3);
// [ 'a', 'b', 'c', 'd', 'e' ]

// ES6的合并数组
[...arr1, ...arr2, ...arr3]
// [ 'a', 'b', 'c', 'd', 'e' ]
```

**箭头函数**

ES6允许使用“箭头”（`=>`）定义函数。

箭头函数有几个使用注意点。

（1）**函数体内的`this`对象，就是定义时所在的对象，而不是使用时所在的对象**。（理解什么是定义时？这个理解对了很重要！！其实就是包裹这个箭头函数的函数执行时候，这个**包裹函数中的this**）

（2）不可以当作构造函数，也就是说，**不可以使用`new`命令**，否则会抛出一个错误。

（3）不可以使用`arguments`对象，该对象在函数体内不存在。如果要用，可以用Rest参数代替。

（4）不可以使用`yield`命令，因此箭头函数不能用作Generator函数。

上面四点中，第一点尤其值得注意。`this`对象的指向是可变的，但是在箭头函数中，它是固定的。

`this`指向的固定化，并不是因为箭头函数内部有绑定`this`的机制，实际原因是**箭头函数根本没有自己的`this`**，**导致内部的`this`就是外层代码块的`this`**。**正是因为它没有`this`，所以也就不能用作构造函数**。

另外，由于箭头函数没有自己的`this`，所以当然也就不能用`call()`、`apply()`、`bind()`这些方法去改变`this`的指向。







#### new 运算符

**`new` 运算符**创建一个用户定义的对象类型的实例或具有构造函数的内置对象的实例。

**`new`** 关键字会进行如下的操作：

1. 创建一个空的简单JavaScript对象（即`{}`）；
2. 链接该对象（设置该对象的**constructor**）到另一个对象 ；（其实是把对象的proto属性设置为构造函数的）
3. 将步骤1新创建的对象作为`this`的上下文 ；
4. 如果该函数没有返回对象，则返回`this`。

明白了new的作用之后，这样其实就能手动实现一个new构造函数了！也能理解为什么箭头函数无法new了！

## 13. 正则表达式RegRxp

```js
\d 所有数字
\D 匹配除了所有数字
\w 所有字母数字下划线
\W 匹配除了字母数字下划线

[\s\S][\d\D][\w\W] 都能匹配所有的字符
             
a|b 选择a或者b,左右两边任何一个满足的就可以
aaau|bccc 选择的是aaau整体或者bccc整体,理解:不带括号的所有
aa(au|bc)cc 选择的是括号中的au或者bc

[123456abc] 选择的是1或2或3或4...或a或b或c,选择的是一个
[^123456abc] 匹配除了123456abc中的所有
[()] 注意：()放到[]里面就表示普通的括号（意思就是不用转义就能匹配到括号），放到外面表示原子组
[.+] 放到[]中的.+也没有特殊含义，所以[]中的字符没有特殊含义，除了\d \ \w等
[a-z] 选择的26个字母中的一个
{4, 9} 匹配连续的4-9位

. 有两层含义: 1.表示除换行符外的任何字符 2.普通点.
\. 把.转义为普通点.

^ 限定起始边界，放在[]中的时候比如[^abc]表示除了...
$ 限定结束边界

$1 $2 还可以在替换中表示第1 2个原子组的内容
$& 表示匹配到的内容本身
$` 表示匹配到的内容的前面`
$' 表示匹配到底内容的后面

\s 匹配空白、换行（\n）
\S 匹配除了空白、换行

/./s 模式s视为单行匹配，理解：把换行符当作普通空格了
/./i 模式i视为匹配的时候不区分大小写
/./g 模式g视为全局匹配，不是匹配到一个就停了，而是匹配所有的形成数组
/./m 模式m视为多行匹配，一行一行的进行模式匹配

() 表示原子组，后面可以用\1 \2 代表第几个原子组
(?<bias>) 原子组中可以通过?<>起别名，然后通过$<bias>引用
(h[1-6]) 匹配h1-h6，后面用\1 表示匹配到的h1-h6标签

+ 匹配1个或多个 +? 禁止贪婪 意思就是我后面能匹配到了，就不需要前面的尽量匹配了
* 匹配0个或多个 *? 禁止贪婪
? 匹配0个或1个 ?? 禁止贪婪
{2} 匹配2个 {2，4} 匹配2-4个，也是贪婪的，{2,} 2-无数个 {2，4}? 禁止贪婪
                             
(?=条件内容) 断言?=表示匹配后面条件内容,相当于条件匹配,在前表示匹配前面的,在后表示匹配后面的,但是它本身不算进匹配的内容
(?<=条件内容) ?<=匹配前面的条件内容
(?!) 表示后面不是什么条件
(?<!) 表示前面不是什么条件
```

## 14. Object的一些方法

#### Object.getOwnPropertySymbols()

#### Object.getOwnPropertyNames()

#### Object.keys()

#### Object.defineProperty()

## 15. 运算符优先级

**注意！** **逻辑与 大于 逻辑或 大于 三目运算！！！**

```js
&& 大于 || 大于 ?:
<,>,<=,>= 大于 ==,===,!=,!== 大于 && 大于 || 大于 ?: 大于 =
```

举两个例子：

1. 

```js
666 || 1 && 999;
// 输出 666
// 证明 && 的优先级高于 ||, 1 && 999 得到 999, 666 || 999 得到 666
// 若非如此, 则 666 || 1 得到 666, 666 && 999 得到 999, 应该输出 999
```

2.

```js
111 || 0 ? 333 : 444 && 555
// 输出 111 ? 333 : 555 => 333
// 若非如此, 则 111 || 444 && 555 => 111 || 555 => 111
```





