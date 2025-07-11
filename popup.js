document.addEventListener("DOMContentLoaded", () => {
    const brightness = document.querySelector(".brightness");
    const brightnessInpt = document.querySelector("#brightnessInpt");
  
    // 获取当前 tab 的阴影值
    function getShadeValue() {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(
          tabs[0].id,
          { greeting: "getShadeValue" },
          (response) => {
            const value = response?.data || 2;
            brightness.textContent = value;
            brightnessInpt.value = value;
  
            // 也可以保存到 chrome.storage.local（替代 localStorage）
            chrome.storage.local.set({ eyePlugin: value });
          }
        );
      });
    }
  
    // 监听 input 输入变化
    brightnessInpt.addEventListener("input", (e) => {
      const newValue = e.target.value;
  
      brightness.textContent = newValue;
  
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(
          tabs[0].id,
          { greeting: "eyePlugin", data: newValue },
          (response) => {
            const confirmedValue = response?.data || newValue;
            brightness.textContent = confirmedValue;
            brightnessInpt.value = confirmedValue;
  
            chrome.storage.local.set({ eyePlugin: confirmedValue });
          }
        );
      });
    });
  
    getShadeValue();
  });
  