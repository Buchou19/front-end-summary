## 1. MVVM 是是什么?

MVVM 是 Model-View-ViewModel 的缩写，MVVM 是一种设计思想。

Model 层代表数据模型，也可以在 Model 中定义数据修改和操作的业务逻辑；View 代表 UI 组件，它负责将数据模型转化成 UI 展现出来，ViewModel 是一个同步 View 和 Model 的对象。

在 MVVM 架构下，View 和 Model 之间并没有直接的联系，而是通过 ViewModel 进行交互，Model 和 ViewModel 之间的交互是双向的， 因此 View 数据的变化会同步到 Model 中，而 Model 数据的变化也会立即反应到 View 上。

ViewModel 通过双向数据绑定把 View 层和 Model 层连接了起来，而 View 和 Model 之间的同步工作完全是自动的，无需人为干涉，因此开发者只需关注业务逻辑，不需要手动操作 DOM, 不需要关注数据状态的同步问题，复杂的数据状态维护完全由 MVVM 来统一管理。

## 2. vue 的响应式原理

#### 对象的响应式

先来了解下这个函数 Object.defineProperty : 方法会直接在一个对象上定义一个新属性，或者修改一个对象的现有属性，并返回此对象。

```js
// Object.defineProperty(obj, prop, descriptor)
const object1 = {};

Object.defineProperty(object1, 'property1', {
  value: 42,
  writable: false
});

object1.property1 = 77;
// throws an error in strict mode

console.log(object1.property1);
// expected output: 42
```

重点了解下里面的 getter、setter 函数：

```js
const obj = {};

Object.defineProperty(obj, 'property1', {
  get() {
      console.log('你访问了一次obj的property1的属性！');
  },
  set() {
      console.log('你操作了一次obj的property1的属性！');
  }
});
```

设置了 getter 函数后，每访问一次 obj.property 就会执行一次 getter 函数内容，obj.property 的返回值就是 getter 函数 return 的结果，如果没有return就是 undefined；

设置了 setter 函数后，每修改一次 obj.property 的值就会执行一次 setter 函数内容，**注意！**如果在 setter 中又修改 obj.property 的值，就会无休止的执行 setter 函数，而 obj.property 的返回值只会唯一跟 getter 的返回值有关；

所有一个需要一个**中间变量**，且可以封装一个外部函数：

```js
const obj = {};

function defineReactive(data, key, val) {
    // 这时 val 就是初始值
    Object.defineProperty(data, key, {
      get() {
          console.log('你访问了一次' + data + '的' + key + '的属性！');
          return val;
      },
      set( newValue ) {
          console.log('你操作了一次' + data + '的' + key + '的属性！');
          if (val === newValue) {
              return;
          }
          val = newValue;
      }
    });
}

defineReactive(obj, 'property1', 0);
```

**完美！**以上我们实现了对一个对象属性的 **访问监听** 和 **变化监听**，下面我们完整的实现对一个对象所有属性的响应式监听以及下面所有属性对象的响应式监听，并且实现了属性修改后的响应式监听，如下：

```js
class Observer {
  constructor(obj) {
    var thisObserver = this;
    // 给 obj 增加 __ob__ 属性, 属性值就是这个Observer实例本身
    Object.defineProperty(obj, '__ob__', {
      value: thisObserver,
      enumerable: false, // 是否可枚举
      writable: true, // 是否可写
      configurable: true // 是否可以被删除
    });
    // 给这个对象的每个属性增加响应式
    this.walk(obj);
  }
  walk(obj) {
    for (let k in obj) {
      defineReactive(obj, k);
    }
  }
};

/**
 * 这里开始
 */
var obj = {
  a: {
    aa: {
      aaa: 999
    }
  },
  b: 777
};

// 我想做的是把 obj 对象的所有属性及下面的属性对象的所有属性都建立成响应式的
observe(obj);

// obeserve 函数就是用来做这件事
function observe(obj) {
  // obj不是对象, 我就不需要为它建立响应式, 因为它就没有属性
  // 考虑null
  if (typeof obj !== 'object') return;
  // 接下里判断这个对象是不是有了观察者对象 Observer 属性
  // 如果有了这个属性就直接返回, 没有的话就为它新建一个然后返回
  var ob;
  if (obj.__ob__ !== undefined) {
    ob = obj.__ob__;
  } else {
    ob = new Observer(obj);
  }
  return ob;
}

function defineReactive(obj, key, val) {
  // 如果没有传 val , 就默认是原始对象初始值
  if (arguments.length === 2) {
    val = obj[key];
  }
  // 在给这个对象属性增加响应式之前
  // 我先给这个对象属性值增加响应式, 如下:
  observe(obj[key]);

  Object.defineProperty(obj, key, {
      get() {
          console.log('你访问了一次' + obj + '的' + key + '的属性！');
          return val;
      },
      set(newValue) {
          console.log('你操作了一次' + obj + '的' + key + '的属性！');
          if (val === newValue) {
              return;
          }
          val = newValue;
          // 一定记得当属性值修改后也为新的属性值建立响应式监听
          observe(val);
      }
  });
};
```

**以上！**

#### 数组的响应式

以上的代码是没有办法处理数组的响应式，在 vue 的底层代码中，它**改写了数组的 7 个原生方法**，分别是：

1. **push**
2. **pop**
3. **unshift**
4. **shift**
5. **splice**
6. **sort**
7. **reverse**

改写完成之后，数组的这 7 个方法就是具有响应式的了，下面我们来手动实现它：

在此之前，我们先来学几个 Object 的方法吧：

```js
Object.setPrototypeOf(obj, prototype); // 将 obj 的原型链指向 prototype
// 等价于
obj.__proto__ = prototype;

Object.create(prototype); // 创建一个空对象，并将其原型链指向 prototype
// 等价于
Object.setPrototypeOf({}, prototype);
// 等价于
{}.__proto__ = prototype;

```

实现代码如下：

```js
class Observer {
  constructor(obj) {
    var thisObserver = this;
    // 给 obj 增加 __ob__ 属性, 属性值就是这个Observer实例本身
    Object.defineProperty(obj, '__ob__', {
      value: thisObserver,
      enumerable: false, // 是否可枚举
      writable: true, // 是否可写
      configurable: true // 是否可以被删除
    });
	// 增加数组的判断
    if (Array.isArray(obj)) {
      // 如果是数组的话, 要做些特殊的操作
      // 先让这个数组对象的原型链指向重写了7中方法的 arrayMethods
      Object.setPrototypeOf(obj, arrayMethods);
      // 然后让这个数组变成响应式
      // 主意下面 observeArray 的操作!
      this.observeArray(obj);
    } else {
      // 给这个对象的每个属性增加响应式
      this.walk(obj);
    }
  }
  walk(obj) {
    for (let k in obj) {
      defineReactive(obj, k);
    }
  }
  observeArray(arr) {
    for (let i = 0, l = arr.length; i < l; i++) {
      // 这个操作并没有为数组的每个属性设置响应式监听
      // 而是遍历每个数组值, 为可能出现的数组或对象设置监听
      observe(arr[i]);
    }
  }
};

// obeserve 函数就是用来做这件事
function observe(obj) {
  // obj不是对象, 我就不需要为它建立响应式, 因为它就没有属性
  // 考虑null
  if (typeof obj !== 'object') return;
  // 接下里判断这个对象是不是有了观察者对象 Observer 属性
  // 如果有了这个属性就直接返回, 没有的话就为它新建一个然后返回
  var ob;
  if (obj.__ob__ !== undefined) {
    ob = obj.__ob__;
  } else {
    ob = new Observer(obj);
  }
  return ob;
}

function defineReactive(obj, key, val) {
  // 如果没有传 val , 就默认是原始对象初始值
  if (arguments.length === 2) {
    val = obj[key];
  }
  // 在给这个对象属性增加响应式之前
  // 我先给这个对象数值增加响应式, 如下:
  observe(obj[key]);

  Object.defineProperty(obj, key, {
    get() {
      console.log('你访问了一次' + obj + '的' + key + '的属性！');
      return val;
    },
    set(newValue) {
      console.log('你操作了一次' + obj + '的' + key + '的属性为' + newValue + '!');
      if (val === newValue) {
        return;
      }
      val = newValue;
      observe(val);
    }
  });
};

// 我们来手动构建一个原型对象 arrayMethods
// 它的__proto__指向了Array.prototype, 并且定义了7个同名的数组方法
const arrayMethods = Object.create(Array.prototype);
['push', 'pop', 'unshift', 'shift', 'splice', 'sort', 'reverse'].forEach(methodName => {
  const original = Array.prototype[methodName];
  Object.defineProperty(arrayMethods, methodName, {
    value: function () {
      // 注意在这个函数里我已经监听到了调用这7个方法的响应
      // 这7个数组的响应操作是在这里进行了, 如:
      console.log('你调用了数组的' + methodName + '方法!');
      // 下面要处理一下这三个特殊的方法: push、unshift、splice
      // 因为这三个方法都添加了新元素到数组中, 需要为新元素添加监听
      let inserted = [];
      switch (methodName) {
        case 'push':
        case 'unshift':
          inserted = [...arguments];
          break;
        case 'splice':
          inserted = [...arguments].slice(2);
          break;
      }
      for (let i = 0; i < inserted.length; i++) {
        observe(inserted[i]);
      }
      // 实现函数原本的功能
      return original.apply(this, arguments);
    },
    enumerable: false,
    configurable: true
  });
});


/**
 * 这里开始
 */
var obj = {
  a: {
    aa: {
      aaa: 999
    }
  },
  b: 777,
  c: [1, [11, 22], 3]
};
// 我想做的是把 obj 对象的所有属性及下面的属性对象的所有属性都建立成响应式的
observe(obj);
```

**记住！**

- 所有对对象的属性的操作是有监听的，但是为对象增加属性是没有监听的，因为没有绑定响应式；
- 所有对数组的直接操作都是没有监听的，例如 arr[i] ，不管 arr[i] 指向的是指向的值、数组、对象，能监听到的只有数组的7个方法
- 数组中的对象、数组同理！对象中的数组、对象同理！

#### 收集依赖 Watcher Dep

