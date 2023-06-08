console.log("%c plugIn run !!!!!!!!", "color:white;background:black");
var shadeValue = 2;

// 阴影值只存在一个 就是存在background的缓存中,不同网页都适用于这个阴影值

// 从 background中获取阴影缓存值 并渲染dom
function getShadeValue() {
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
// 更新background 的缓存阴影值
function updateBackgroundShade() {
  var port = chrome.extension.connect({ name: "updateShadeValue" });
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

      updateBackgroundShade();

      sendResponse({
        farewell: "I'm contentscript,goodbye!",
        data: request.data,
      });

      // 这里是打开poppup时,需要从background的缓存中获取最新的阴影值缓存
    } else if (request.greeting == "getShadeValue") {
      sendResponse({
        data: shadeValue,
      });
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

getShadeValue();
