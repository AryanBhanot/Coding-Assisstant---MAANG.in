document.addEventListener("DOMContentLoaded", function () {
    const apiKeyInput = document.getElementById("apiKeyInput");
    const saveButton = document.getElementById("saveKey");
    const clearButton = document.getElementById("clearKey");
    const statusText = document.getElementById("status");
  
    // Load saved API key
    chrome.storage.sync.get("gemini_api_key", function (data) {
      if (data.gemini_api_key) {
        apiKeyInput.value = data.gemini_api_key;
      }
    });
  
    // Save API key
    saveButton.addEventListener("click", function () {
      const apiKey = apiKeyInput.value.trim();
      if (apiKey) {
        chrome.storage.sync.set({ "gemini_api_key": apiKey }, function () {
          statusText.textContent = "API Key Saved!";
          statusText.style.color = "green";
          setTimeout(() => statusText.textContent = "", 2000);
        });
      } else {
        statusText.textContent = "Please enter a valid API key.";
        statusText.style.color = "red";
      }
    });
  
    // Clear API key
    clearButton.addEventListener("click", function () {
      chrome.storage.sync.remove("gemini_api_key", function () {
        apiKeyInput.value = "";
        statusText.textContent = "API Key Cleared!";
        statusText.style.color = "red";
        setTimeout(() => statusText.textContent = "", 2000);
      });
    });
  });
  