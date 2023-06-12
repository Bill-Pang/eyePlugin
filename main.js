console.log("%c plugIn run !!!!!!!!", "color:white;background:black");
var shadeValue = 2;
let timer = null;

// 阴影值只存在一个 就是存在background的缓存中,不同网页都适用于这个阴影值

// 从 background中获取阴影缓存值 并渲染dom
function getShadeValue() {
  // 如果阴影dom 没有被创建 则去创建

  if (!document.querySelector("#my__custom__eye__plugin__xxx__000")) {
    var port = chrome.extension.connect({ name: "getShadeValue" });
    port.postMessage({ detail: { name: "getShadeValue" } });

    //这里主要是为了接受回传的值
    port.onMessage.addListener((msg) => {
      console.log("onMessage background:", msg);
      if (msg.shadeValue) {
        shadeValue = msg.shadeValue;
        renderShadeDom(msg.shadeValue / 10);
      }
    });
  }
}
// 更新background 的缓存阴影值
function updateBackgroundShade(request) {
  var port = chrome.extension.connect({ name: "updateShadeValue" });
  shadeValue = request.data;
  port.postMessage({
    detail: { name: "updateShadeValue", data: request.data },
  });
}

function listenShadeUpdate() {
  //监听从poppup 输入框的变化 并重新调整dom的阴影值
  chrome.runtime.onMessage.addListener(function (
    request,
    sender,
    sendResponse
  ) {
    if (request.greeting == "eyePlugin") {
      let number = Number(request.data) / 10;

      document.querySelector(
        "#my__custom__eye__plugin__xxx__000"
      ).style.background = `rgba(0, 0, 0, ${number})`;

      updateBackgroundShade(request);

      sendResponse({
        farewell: "I'm contentscript,goodbye!",
        data: request.data,
      });

      // 这里是打开poppup时,需要从background的缓存中获取最新的阴影值缓存
    } else if (request.greeting == "getShadeValue") {
      // console.log(
      //   "这里是打开poppup时,需要从background的缓存中获取最新的阴影值缓存"
      // );
      // console.log("shadeValue:", shadeValue);
      sendResponse({
        data: shadeValue,
      });

      // background 主动向contentscript发送 同时同步多个网页的阴影值
    } else if (request.greeting == "formBackground") {
      shadeValue = request.data;
      let number = Number(request.data) / 10;

      document.querySelector(
        "#my__custom__eye__plugin__xxx__000"
      ).style.background = `rgba(0, 0, 0, ${number})`;
    }
  });
}

function renderShadeDom(filterShadeValue) {
  var node = document.createElement("div");
  node.style = `
  width: 100%;
  height: 100%;
  transition: all .5s;
  position: fixed !important;
  left: 0px !important;
  bottom: 0px !important;
  overflow: hidden !important;
  background: rgba(0, 0, 0, ${filterShadeValue});
  pointer-events: none !important;
  z-index: 2147483647;
  `;
  node.id = "my__custom__eye__plugin__xxx__000";
  document.body.appendChild(node);
  // 监听阴影值的变化 ,并同步缓存
  listenShadeUpdate();
}

// 每秒去更新一下 因为有些spa页面 不刷新页面 而重新渲染了页面，导致阴影层被移除了
// 比如 baidu 搜索时，dom被重新渲染 阴影层被移除，此时就需要重新渲染
if (timer) clearInterval(timer);
timer = setInterval(() => {
  getShadeValue();
}, 1000);
