const fileBrowser = document.getElementById('fileBrowser');
const subFileBrowser = document.getElementById('subFileBrowser');
const previewContainer = document.getElementById('preview');
const categoryList = document.getElementById('categoryList');
const searchInput = document.getElementById('searchInput');

let currentPath = []; // Houdt de huidige directory bij
let files = []; // Cache voor bestanden

// Haal bestanden op uit assets.json
async function getFiles() {
  if (files.length === 0) {
    try {
      const response = await fetch('/data/assets.json');
      if (!response.ok) {
        throw new Error('Failed to fetch assets.json');
      }
      files = await response.json();
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  }
  return files;
}

// Haal de huidige directory op
function getCurrentDirectory(allFiles) {
  let directory = allFiles;
  for (const pathSegment of currentPath) {
    const subdirectory = directory.find(
      (item) => item.name === pathSegment && item.type === 'directory'
    );
    if (subdirectory && subdirectory.children) {
      directory = subdirectory.children;
    } else {
      return []; // Als de directory niet bestaat, geef een lege array terug
    }
  }
  return directory;
}

// Sorteer items: directories bovenaan, bestanden eronder
function sortItems(items) {
  return items.sort((a, b) => {
    if (a.type === 'directory' && b.type !== 'directory') return -1;
    if (a.type !== 'directory' && b.type === 'directory') return 1;
    return a.name.localeCompare(b.name); // Sorteer alfabetisch binnen dezelfde type
  });
}

// Render bestanden en directories
function renderFiles(items, target = fileBrowser, parentItems = null, updatePath = false) {
  target.innerHTML = '';

  // Toon een melding als er geen categorie is geselecteerd
  if (currentPath.length === 0 && target === fileBrowser) {
    const message = document.createElement('div');
    message.classList.add('no-category-message');
    message.textContent = 'Selecteer een categorie aan de linkerkant om te beginnen met bladeren.';
    target.appendChild(message);
    return;
  }

  // Voeg een "terug"-knop toe als we niet in de root zijn
  if (currentPath.length > 0 && target === fileBrowser) {
    const backButton = document.createElement('div');
    backButton.classList.add('directory');
    backButton.innerHTML = '<i class="fas fa-arrow-left"></i> Terug';
    backButton.addEventListener('click', () => {
      if (updatePath) {
        currentPath.pop(); // Ga één niveau omhoog
      }
      updateFileBrowser();
    });
    target.appendChild(backButton);
  }

  // Sorteer items
  const sortedItems = sortItems(items);

  // Render elk item
  sortedItems.forEach((item) => {
    const itemElement = document.createElement('div');
    itemElement.classList.add(item.type === 'directory' ? 'directory' : 'file');
    itemElement.innerHTML = `<i class="fas ${item.type === 'directory' ? 'fa-folder' : 'fa-file'}"></i> ${item.name}`;

    if (item.type === 'directory') {
      itemElement.addEventListener('click', () => {
        if (target === fileBrowser) {
          // Update de tweede kolom en toon de inhoud in de derde kolom
          renderFiles(item.children || [], subFileBrowser, items, false);
          subFileBrowser.style.display = 'block';

          // Highlight de geopende map in kolom 2
          document.querySelectorAll('#fileBrowser .directory').forEach((dir) => dir.classList.remove('active'));
          itemElement.classList.add('active');
        } else if (target === subFileBrowser) {
          // Update de derde kolom en blijf in dezelfde bovenliggende map
          renderFiles(item.children || [], subFileBrowser, items, false);
        }
      });
    } else {
      itemElement.addEventListener('click', () => {
        showPreview(item, items);
      });
    }

    target.appendChild(itemElement);
  });

  // Als de derde kolom wordt weergegeven, toon de bovenliggende map in de tweede kolom
  if (parentItems && target === subFileBrowser) {
    renderFiles(parentItems, fileBrowser, null, false);
  }
}

// Update de file browser
async function updateFileBrowser() {
  const allFiles = await getFiles();
  const currentDirectory = getCurrentDirectory(allFiles);

  // Controleer of er een categorie is geselecteerd
  if (currentPath.length === 0) {
    renderFiles([], fileBrowser); // Toon de melding in de tweede kolom
    subFileBrowser.innerHTML = ''; // Reset alleen de inhoud van de derde kolom
    return;
  }

  // Render de huidige directory in de tweede kolom
  renderFiles(currentDirectory, fileBrowser);

  // Reset alleen de inhoud van de derde kolom
  subFileBrowser.innerHTML = '';
}

function showPreview(file, filesInDirectory) {
  previewContainer.innerHTML = '';

  const overlay = document.createElement('div');
  overlay.classList.add('preview-overlay');

  // Filter alleen bestanden (geen directories)
  const filesOnly = filesInDirectory.filter(f => f.type !== 'directory');

  let currentIndex = filesOnly.findIndex(f => f.name === file.name);
  if (currentIndex === -1) {
    console.error('Bestand niet gevonden in directory:', file.name);
    return;
  }

  const updatePreview = (index) => {
    const currentFile = filesOnly[index];
    overlay.innerHTML = ''; // Reset overlay content

    if (currentFile.type === 'image') {
      const img = document.createElement('img');
      img.src = currentFile.thumbnail;
      img.alt = currentFile.name;
      img.classList.add('preview-image');
      overlay.appendChild(img);
    } else {
      const message = document.createElement('p');
      message.textContent = `Voorbeeld niet beschikbaar voor ${currentFile.type}`;
      overlay.appendChild(message);
    }

    // Voeg navigatiepijlen toe
    if (index > 0) {
      const leftArrow = document.createElement('button');
      leftArrow.classList.add('arrow', 'arrow-left');
      leftArrow.innerHTML = '<i class="fas fa-arrow-left"></i>'; // Font Awesome-pijl
      leftArrow.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + filesOnly.length) % filesOnly.length;
        updatePreview(currentIndex);
      });
      overlay.appendChild(leftArrow);
    }

    if (index < filesOnly.length - 1) {
      const rightArrow = document.createElement('button');
      rightArrow.classList.add('arrow', 'arrow-right');
      rightArrow.innerHTML = '<i class="fas fa-arrow-right"></i>'; // Font Awesome-pijl
      rightArrow.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % filesOnly.length;
        updatePreview(currentIndex);
      });
      overlay.appendChild(rightArrow);
    }

    // Voeg knoppencontainer toe
    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('button-container');

    const downloadButton = document.createElement('a');
    downloadButton.href = `/assets/${currentFile.category}/${currentFile.name}`;
    downloadButton.download = currentFile.name;
    downloadButton.textContent = 'Download';
    downloadButton.classList.add('download-button');
    buttonContainer.appendChild(downloadButton);

    const closeButton = document.createElement('button');
    closeButton.textContent = 'Sluiten';
    closeButton.classList.add('close-button');
    closeButton.addEventListener('click', () => {
      previewContainer.innerHTML = '';
      document.removeEventListener('keydown', handleKeydown); // Verwijder de keydown listener bij sluiten
    });
    buttonContainer.appendChild(closeButton);

    overlay.appendChild(buttonContainer);
  };

  const handleKeydown = (event) => {
    if (event.key === 'ArrowLeft' && currentIndex > 0) {
      currentIndex = (currentIndex - 1 + filesOnly.length) % filesOnly.length;
      updatePreview(currentIndex);
    } else if (event.key === 'ArrowRight' && currentIndex < filesOnly.length - 1) {
      currentIndex = (currentIndex + 1) % filesOnly.length;
      updatePreview(currentIndex);
    } else if (event.key === 'Escape') {
      previewContainer.innerHTML = '';
      document.removeEventListener('keydown', handleKeydown); // Verwijder de keydown listener bij sluiten
    }
  };

  // Voeg de keydown event listener toe
  document.addEventListener('keydown', handleKeydown);

  updatePreview(currentIndex);
  previewContainer.appendChild(overlay);
}

// Voeg eventlisteners toe aan de Finder-categorieën
categoryList.addEventListener('click', (e) => {
  if (e.target.classList.contains('finder-item')) {
    const category = e.target.getAttribute('data-category');
    currentPath = [category];
    updateFileBrowser();

    // Markeer de actieve categorie
    document.querySelectorAll('.finder-item').forEach((item) => item.classList.remove('active'));
    e.target.classList.add('active');
  }
});

// Zoekfunctionaliteit
searchInput.addEventListener('input', async (e) => {
  const query = e.target.value.toLowerCase();
  const allFiles = await getFiles();

  // Filter bestanden op basis van de zoekopdracht
  const filteredFiles = allFiles.filter((file) =>
    file.name.toLowerCase().includes(query)
  );

  // Toon de gefilterde bestanden in de tweede kolom
  renderFiles(filteredFiles, fileBrowser);

  // Reset alleen de inhoud van de derde kolom
  subFileBrowser.innerHTML = '';
});

// Initialiseer
updateFileBrowser();