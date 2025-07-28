console.log("%c plugIn run !!!!!!!!", "color:white;background:black");
var shadeValue = 2;
let timer = null;

// 获取并渲染 DOM
function getShadeValue() {
  // 如果阴影dom 没有被创建 则去创建
  if (!document.querySelector("#my__custom__eye__plugin__xxx__000")) {
    chrome.runtime.sendMessage({ type: "getShadeValue" }, (response) => {
      console.log("onMessage background:", response);
      if (response && response.shadeValue) {
        shadeValue = response.shadeValue;
        renderShadeDom(response.shadeValue / 10);
      }
    });
  }
}

// 更新 background 的缓存阴影值
function updateBackgroundShade(request) {
  shadeValue = request.data;

  chrome.runtime.sendMessage(
    { type: "updateShadeValue", value: request.data },
    (response) => {
      console.log("更新 shadeValue 成功:", response);
    }
  );
}

function listenShadeUpdate() {
  // 监听 popup 或 background 发来的消息
  chrome.runtime.onMessage.addListener(function (
    request,
    sender,
    sendResponse
  ) {
    if (request.greeting === "eyePlugin") {
      let number = Number(request.data) / 10;

      document.querySelector(
        "#my__custom__eye__plugin__xxx__000"
      ).style.background = `rgba(0, 0, 0, ${number})`;

      updateBackgroundShade(request);

      sendResponse({
        farewell: "I'm contentscript, goodbye!",
        data: request.data,
      });
    } else if (request.greeting === "getShadeValue") {
      sendResponse({
        data: shadeValue,
      });
    } else if (request.greeting === "formBackground") {
      shadeValue = request.data;
      let number = Number(request.data) / 10;

      const node = document.querySelector("#my__custom__eye__plugin__xxx__000");
      if (node) {
        node.style.background = `rgba(0, 0, 0, ${number})`;
      } else {
        renderShadeDom(number);
      }
    }
  });
}

function renderShadeDom(filterShadeValue) {
  let existing = document.querySelector("#my__custom__eye__plugin__xxx__000");
  if (existing) return; // 防止重复插入

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
  listenShadeUpdate();
}

// 初始化 & 轮询（解决 SPA 页面 DOM 被移除问题）
getShadeValue();
if (timer) clearInterval(timer);
timer = setInterval(() => {
  getShadeValue();
}, 1000);
