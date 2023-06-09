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

  companyInput.addEventListener('keyup', function(event) {
    if (event.key === "Enter") {
      saveCompanyButton.click();
    }
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
    const newCompany = { name: companyInput.value, status: 'pending' };
    if (!newCompany.name) return;
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
    if (result.companies) {
      // Convert any companies that are strings to objects
      result.companies = result.companies.map(company =>
        typeof company === 'string' ? {name: company, status: 'pending'} : company
      );
      renderCompanies(result.companies);
    }
  });

  function renderCompanies(companies) {
    companyList.innerHTML = '';
    for (let i = 0; i < companies.length; i++) {
      // If the company is a string, convert it to an object
      if (typeof companies[i] === 'string') {
        companies[i] = {
          name: companies[i],
          status: 'pending',
        };
        chrome.storage.local.set({companies: companies}, function() {
          console.log('Company converted to object');
        });
      }

      const listItem = document.createElement('li');
      listItem.innerHTML = `
        <span class="company-name">${companies[i].name}</span>
        <span class="status pending ${companies[i].status === 'pending' ? 'selected' : ''}" data-index="${i}" data-status="pending">Pending</span>
        <span class="status accepted ${companies[i].status === 'accepted' ? 'selected' : ''}" data-index="${i}" data-status="accepted">Accepted</span>
        <span class="status rejected ${companies[i].status === 'rejected' ? 'selected' : ''}" data-index="${i}" data-status="rejected">Rejected</span>
        <button class="delete" data-index="${i}">X</button>
      `;
      companyList.appendChild(listItem);
    }

    // Add click event listeners to status elements
    const statusElements = document.querySelectorAll('.status');
    statusElements.forEach(element => {
      element.addEventListener('click', function() {
        const index = this.dataset.index;
        const status = this.dataset.status;
        companies[index].status = status;
        chrome.storage.local.set({companies: companies}, function() {
          console.log('Status updated');
          renderCompanies(companies);
        });
      });
    });

    // Add click event listeners to delete buttons
    const deleteButtons = document.querySelectorAll('.delete');
    deleteButtons.forEach(button => {
      button.addEventListener('click', function() {
        const index = this.dataset.index;
        companies.splice(index, 1);
        chrome.storage.local.set({companies: companies}, function() {
          console.log('Company removed from list');
          renderCompanies(companies);
        });
      });
    });
  }
  });
