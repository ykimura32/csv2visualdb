// Fetch CSV data from URL
async function fetchCSVData(url) {
  const response = await fetch(url);
  const data = await response.text();
  return data;
}

// Parse CSV data as JSON
function parseCSVData(csvData) {
  const lines = csvData.split('\n');
  const headers = lines[0].split(',');
  const jsonData = [];

  for (let i = 1; i < lines.length; i++) {
    const currentLine = lines[i].split(',');
    if (currentLine.length !== headers.length) {
      continue;
    }

    const row = {};
    for (let j = 0; j < headers.length; j++) {
      row[headers[j]] = currentLine[j];
    }
    jsonData.push(row);
  }

  return jsonData;
}

// Format and display JSON data
function displayData(jsonData) {
  const outputDiv = document.getElementById('output');
  outputDiv.innerHTML = '';

  for (let i = 0; i < jsonData.length; i++) {
    const entry = jsonData[i];
    const entryDiv = document.createElement('div');
    entryDiv.className = 'col '+ entry.UNITID;
    // construct template literal
    const cardHtml = 
    `<div class="card uni-card">
        <div class="card-body">
          <p class="card-title uni-city">${entry.CITY} · ${entry.STABBR}</p>
          <h5 class="card-text uni-name">${entry.INSTNM}</h5>
          <a class="uni-url" href="${entry.INSTURL}" target="_blank">${entry.INSTURL}</a>
        </div>
      </div>
    </div>`
    entryDiv.innerHTML = cardHtml;
    outputDiv.appendChild(entryDiv);
  }
}

// Search JSON data with auto-complete
function displaySearchResults(matches) {
  const searchResults = document.getElementById('suggestion-list');
  searchResults.innerHTML = '';

  if (matches.length > 0) {
    matches.forEach(item => {
      const listItem = document.createElement('li');
      listItem.className = item.UNITID;
      const optionHtml = item.INSTNM + ' (' + item.CITY + ', ' + item.STABBR + ')';
      listItem.innerHTML = optionHtml;
      listItem.addEventListener('click', function() {
        displaySelectedCard(item.UNITID);
      });
      searchResults.appendChild(listItem);
    });
  } else {
    const listItem = document.createElement('li');
    listItem.textContent = 'No results found.';
    searchResults.appendChild(listItem);
  }
}

function displaySelectedCard(selectedItem) {
  const cards = document.getElementsByClassName('col');
  const outputDiv = document.getElementById('output');
  let selectedCard = null;
  if (selectedCard) {
    selectedCard.classList.add('hidden');
  }

  for (var i = 0; i < cards.length; i++) {
    if (cards[i].classList.contains(selectedItem)) {
      cards[i].classList.remove('hidden');
      selectedCard = cards[i];
        outputDiv.insertBefore(cards[i], outputDiv.firstChild);
    } else {
      cards[i].classList.add('hidden');
    }
  }
}
// Fetch CSV data from URL
const csvUrl = 'https://gist.githubusercontent.com/simonlast/d5a86ba0c82e1b0d9f6e3d2581b95755/raw/f608b9b896dd3339df13dae317998d5f24c00a50/edu-scorecard.csv';

fetchCSVData(csvUrl)
  .then(parseCSVData)
  .then(jsonData => {
    displayData(jsonData);

    const searchInput = document.getElementById('search-input');
    const suggestionList = document.getElementById('suggestion-list');

    searchInput.addEventListener('input', () => {
      const query = searchInput.value.trim();
      let matches = [];

      if (query.length > 0) {
          matches = jsonData.filter(entry => {
            const regex = new RegExp(query, 'i');
            return entry.INSTNM.match(regex) || entry.CITY.match(regex);
          });
      }
      displaySearchResults(matches);
    });

})
  .catch(error => console.error('Error:', error));
