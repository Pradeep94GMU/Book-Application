document.addEventListener('DOMContentLoaded', (event) => {
  const counterDisplay = document.getElementById('counterDisplay');
  const incrementButton = document.getElementById('incrementButton');
  const undoButton = document.getElementById('undoButton');
  const resetButton = document.getElementById('resetButton');
  const companyInput = document.getElementById('companyInput');
  const saveCompanyButton = document.getElementById('saveCompanyButton');
  const companyList = document.getElementById('companyList');

  incrementButton.addEventListener('click', function() {
    chrome.storage.local.get(['counter'], function(result) {
      let newCount = result.counter + 1;
      counterDisplay.innerText = newCount;
      chrome.storage.local.set({counter: newCount}, function() {
        console.log('Counter value is set to ' + newCount);
      });
    });
  });

  undoButton.addEventListener('click', function() {
    chrome.storage.local.get(['counter'], function(result) {
      let newCount = result.counter - 1;
      if (newCount < 0) newCount = 0;
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

  saveCompanyButton.addEventListener('click', function() {
    const newCompany = companyInput.value;
    if (!newCompany) return;
    chrome.storage.local.get(['companies'], function(result) {
      let companies = result.companies;
      if (!companies) companies = [];
      companies.push(newCompany);
      chrome.storage.local.set({companies: companies}, function() {
        console.log('Company added to list');
        renderCompanies(companies);
        companyInput.value = '';
      });
    });
  });

  chrome.storage.local.get(['counter', 'companies'], function(result) {
    counterDisplay.innerText = result.counter || 0;
    if (result.companies) renderCompanies(result.companies);
  });

  function renderCompanies(companies) {
    companyList.innerHTML = '';
    for (let i = 0; i < companies.length; i++) {
      const listItem = document.createElement('li');
      listItem.innerText = companies[i];
      const deleteButton = document.createElement('button');
      deleteButton.innerText = 'Delete';
      deleteButton.addEventListener('click', function() {
        companies.splice(i, 1);
        chrome.storage.local.set({companies: companies}, function() {
          console.log('Company removed from list');
          renderCompanies(companies);
        });
      });
      listItem.appendChild(deleteButton);
      companyList.appendChild(listItem);
    }
  }
});
