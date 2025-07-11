// background.js (MV3)

// 监听来自 content script 或 popup 的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "getShadeValue") {
      chrome.storage.local.get(["shadeValue"], (result) => {
        const shadeValue = result.shadeValue || 2;
        sendResponse({ shadeValue });
      });
  
      // 必须返回 true 表示异步响应
      return true;
    }
  
    if (message.type === "updateShadeValue") {
      const newValue = message.value || 2;
  
      chrome.storage.local.set({ shadeValue: newValue }, () => {
        // 通知所有 tab 更新阴影值
        chrome.tabs.query({}, (tabs) => {
          for (const tab of tabs) {
            chrome.tabs.sendMessage(tab.id, {
              greeting: "formBackground",
              data: newValue,
            });
          }
        });
  
        sendResponse({ shadeValue: newValue });
      });
  
      return true;
    }
  });
  