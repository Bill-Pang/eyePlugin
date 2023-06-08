chrome.extension.onConnect.addListener(function (port) {
  function getShadomValue() {
    port.onMessage.addListener(function (data) {
      let shadeValue = localStorage.getItem("shadeValue") || 2;
      port.postMessage({ shadeValue });
    });
  }

  function updateShadeValue() {
    port.onMessage.addListener(function (data) {
      console.log("updateShadeValue::");
      console.log(data);
      let shadeValue = localStorage.setItem("shadeValue", data.detail.data);
      port.postMessage({ shadeValue });
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
