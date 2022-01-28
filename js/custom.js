// alert(window.location.pathname);

class Dep {
  // 订阅池
  constructor(name) {
    this.id = new Date(); //这里简单的运用时间戳做订阅池的ID
    this.subs = []; //该事件下被订阅对象的集合
  }
  defined() {
    // 添加订阅者
    Dep.watch.add(this);
  }
  notify() {
    //通知订阅者有变化
    this.subs.forEach((e, i) => {
      if (typeof e.update === "function") {
        try {
          e.update.apply(e); //触发订阅者更新函数
        } catch (err) {
          console.warr(err);
        }
      }
    });
  }
}
Dep.watch = null;

class Watch {
  constructor(name, fn) {
    this.name = name; //订阅消息的名称
    this.id = new Date(); //这里简单的运用时间戳做订阅者的ID
    this.callBack = fn; //订阅消息发送改变时->订阅者执行的回调函数
  }
  add(dep) {
    //将订阅者放入dep订阅池
    dep.subs.push(this);
  }
  update() {
    //将订阅者更新方法
    var cb = this.callBack; //赋值为了不改变函数内调用的this
    cb(this.name);
  }
}

var addHistoryMethod = (function () {
  var historyDep = new Dep();
  return function (name) {
    if (name === "historychange") {
      return function (name, fn) {
        var event = new Watch(name, fn);
        Dep.watch = event;
        historyDep.defined();
        Dep.watch = null; //置空供下一个订阅者使用
      };
    } else if (name === "pushState" || name === "replaceState") {
      var method = history[name];
      return function () {
        method.apply(history, arguments);
        historyDep.notify();
      };
    }
  };
})();

window.addHistoryListener = addHistoryMethod("historychange");
history.pushState = addHistoryMethod("pushState");
history.replaceState = addHistoryMethod("replaceState");
// window.history.pushState = function (params) {
//   if (params.url.indexOf("/Gallery/withMyLove") > -1) {
//   }

//   // console.log(params.url.indexOf("/Gallery/withMyLove"));
//   // console.log("路由改变", params);
// };
window.addHistoryListener("pushState", function (aa) {
  const host = location.host;
  console.log("窗口的history改变了", aa, window.location.pathname);
  if (window.location.pathname === "/Gallery/withMyLove") {
    debugger;
    // window.history.back();
    // window.location.reload();
    // debugger;
    var div = document.createElement("div");
    div.classList.add("custom-dialog");
    div.innerHTML =
      "<p>请输入胡小姐的全名</p>" +
      '<div class="customer-input"><input type="text" name="name" value="" id="name20210524"/></div>' +
      "<div class='customer-footer-btn'><button class='queren' id='confirmBtn'>确认</button><button class='quxiao' id='cancelBtn'>取消</button></div>";
    document.getElementById("body-wrap").appendChild(div);
    const inputDom = document.getElementById("name20210524");
    const confirmBtn = document.getElementById("confirmBtn");
    const cancelBtn = document.getElementById("cancelBtn");
    confirmBtn.onclick = function (params) {
      if (inputDom.value === "胡丽娟") {
        // 放行路由
        window.location.replace("/Gallery/withMyLove");
      } else {
        // 返回上级路由
        window.location.replace("/photo");
      }
    };
    cancelBtn.onclick = function (params) {
      // 返回上级路由
      window.location.replace("/photo");
    };
  }
});
// history.pushState({first:'first'}, "page2", "/first")
