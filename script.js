document.addEventListener('DOMContentLoaded', () => {
  const termClassInput = document.getElementById('termClassInput');
  const translationClassInput = document.getElementById(
    'translationClassInput'
  );
  const htmlInput = document.getElementById('htmlInput');
  const processButton = document.getElementById('processButton');
  const exportButton = document.getElementById('exportButton');
  const themeToggleButton = document.getElementById('themeToggleButton');
  const output = document.getElementById('output');

  processButton.addEventListener('click', () => {
    const termClass = termClassInput.value;
    const translationClass = translationClassInput.value;
    const htmlContent = htmlInput.value;
    processDivs(termClass, translationClass, htmlContent);
  });

  exportButton.addEventListener('click', () => {
    exportToQuizlet();
  });

  themeToggleButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
  });

  function processDivs(termClass, translationClass, htmlContent) {
    const tempContainer = document.createElement('div');
    tempContainer.innerHTML = htmlContent;
    const divs = Array.from(tempContainer.querySelectorAll('div'));
    const termsArray = [];
    const translationsArray = [];

    // Merge divs with similar classes
    for (let i = 0; i < divs.length; i++) {
      const currentDiv = divs[i];
      const nextDiv = divs[i + 1];

      if (nextDiv) {
        const currentClasses = currentDiv.classList;
        const nextClasses = nextDiv.classList;

        if (
          (currentClasses.contains(termClass) &&
            nextClasses.contains(termClass)) ||
          (currentClasses.contains(translationClass) &&
            nextClasses.contains(translationClass))
        ) {
          currentDiv.innerHTML += nextDiv.innerHTML;
          nextDiv.remove();
          divs.splice(i + 1, 1); // Remove the merged div from the array
          i--; // Adjust the index to account for the removed element
        }
      }
    }

    // Populate termsArray and translationsArray
    divs.forEach((div) => {
      if (div.classList.contains(termClass)) {
        termsArray.push(div.innerHTML);
      } else if (div.classList.contains(translationClass)) {
        translationsArray.push(div.innerHTML);
      }
    });

    console.log(termsArray);
    console.log(translationsArray);

    // Create translations map
    const translationsMap = termsArray.map((term, index) => {
      return { term, translation: translationsArray[index] || '' };
    });

    // Create and append table to output div
    const table = document.createElement('table');
    const headerRow = document.createElement('tr');
    const termHeader = document.createElement('th');
    termHeader.textContent = 'Term';
    const translationHeader = document.createElement('th');
    translationHeader.textContent = 'Translation';

    headerRow.appendChild(termHeader);
    headerRow.appendChild(translationHeader);
    table.appendChild(headerRow);

    translationsMap.forEach(({ term, translation }) => {
      const row = document.createElement('tr');
      const termCell = document.createElement('td');
      termCell.textContent = term;
      const translationCell = document.createElement('td');
      translationCell.textContent = translation;

      row.appendChild(termCell);
      row.appendChild(translationCell);
      table.appendChild(row);
    });

    output.innerHTML = ''; // Clear previous output
    output.appendChild(table);

    // Store translationsMap for export
    window.translationsMap = translationsMap;

    // Show export button
    exportButton.style.display = 'block';
  }

  function exportToQuizlet() {
    if (!window.translationsMap) {
      alert('Please process the divs first.');
      return;
    }

    const quizletText = window.translationsMap
      .map(({ term, translation }) => `${term} :: ${translation}`)
      .join('\n');

    // Create a temporary textarea to copy the text
    const tempTextArea = document.createElement('textarea');
    tempTextArea.value = quizletText;
    document.body.appendChild(tempTextArea);
    tempTextArea.select();
    document.execCommand('copy');
    document.body.removeChild(tempTextArea);

    alert('Quizlet text copied to clipboard!');
  }
});
