setTimeout(() => {
  function getShadeValue() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { greeting: "getShadeValue" },
        function (response) {
          localStorage.setItem("eyePlugin", response.data);
          renderScript(response.data);
        }
      );
    });
  }

  function renderScript(shadeValue) {
    let brightness = document.querySelector(".brightness");
    let brightnessInpt = document.querySelector("#brightnessInpt");

    brightness.textContent = shadeValue;
    brightnessInpt.value = shadeValue;
    brightnessInpt.oninput = function (e) {
      console.log("e", e);
      brightness.textContent = e.target.value;
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(
          tabs[0].id,
          { greeting: "eyePlugin", data: e.target.value },
          function (response) {
            // console.log("response::::", response);
            brightness.textContent = response.data;
            brightnessInpt.value = response.data;
            localStorage.setItem("eyePlugin", response.data);
          }
        );
      });
    };
  }

  getShadeValue();
}, 1);
