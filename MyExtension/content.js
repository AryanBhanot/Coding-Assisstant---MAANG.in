// content.js
// Inject helper.js into the page
const script = document.createElement("script");
script.src = chrome.runtime.getURL("helper.js");
(document.head || document.documentElement).appendChild(script);
script.onload = function() {
  script.remove();
};
