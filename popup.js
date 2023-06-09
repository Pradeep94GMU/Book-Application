document.addEventListener('DOMContentLoaded', (event) => {
  const counterDisplay = document.getElementById('counterDisplay');
  const incrementButton = document.getElementById('incrementButton');
  const resetButton = document.getElementById('resetButton');

  incrementButton.addEventListener('click', function() {
    chrome.storage.local.get(['counter'], function(result) {
      let newCount = result.counter + 1;
      counterDisplay.innerText = newCount;
      chrome.storage.local.set({counter: newCount}, function() {
        console.log('Counter value is set to ' + newCount);
      });
    });
  });

  resetButton.addEventListener('click', function() {
    chrome.storage.local.set({counter: 0}, function() {
      console.log('Counter value is reset to 0');
      counterDisplay.innerText = 0;
    });
  });

  chrome.storage.local.get(['counter'], function(result) {
    counterDisplay.innerText = result.counter;
  });
});
