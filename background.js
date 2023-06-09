chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.local.set({counter: 0}, function() {
    console.log("Counter value set to 0");
  });
});
