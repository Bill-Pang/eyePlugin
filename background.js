// 监听
chrome.extension.onConnect.addListener(function (port) {
  function getShadomValue() {
    port.onMessage.addListener(function (data) {
      let shadeValue = localStorage.getItem("shadeValue") || 2;
      port.postMessage({ shadeValue });
    });
  }

  function sendShadeValueToContent() {
    // 遍历所有已打开的tab 全部发送
    chrome.tabs.query({}, function (tabs) {
      // 遍历标签页数组
      for (var i = 0; i < tabs.length; i++) {
        // 向每个标签页的 content script 发送消息
        chrome.tabs.sendMessage(tabs[i].id, {
          greeting: "formBackground",
          data: localStorage.getItem("shadeValue") || 2,
        });
      }
    });
  }

  function updateShadeValue() {
    port.onMessage.addListener(function (data) {
      let shadeValue = localStorage.setItem("shadeValue", data.detail.data);
      port.postMessage({ shadeValue });
      // 主动向content 发送最新的阴影值 同时同步多个网页的阴影值
      sendShadeValueToContent();
    });
  }

  switch (port.name) {
    case "getShadeValue":
      getShadomValue();
      break;
    case "updateShadeValue":
      updateShadeValue();
      break;
  }
});
