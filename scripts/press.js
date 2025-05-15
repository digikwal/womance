const fileBrowser = document.getElementById('fileBrowser');
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

// Update file browser
async function updateFileBrowser() {
  const allFiles = await getFiles();
  const currentDirectory = getCurrentDirectory(allFiles);

  renderFiles(currentDirectory);
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

// Render bestanden en directories
function renderFiles(items) {
  fileBrowser.innerHTML = '';

  // Voeg een "terug"-knop toe als we niet in de root zijn
  if (currentPath.length > 0) {
    const backButton = document.createElement('div');
    backButton.classList.add('directory');
    backButton.textContent = '⬅️ Terug';
    backButton.addEventListener('click', () => {
      currentPath.pop();
      updateFileBrowser();
    });
    fileBrowser.appendChild(backButton);
  }

  items.forEach((item) => {
    const itemElement = document.createElement('div');
    itemElement.classList.add(item.type === 'directory' ? 'directory' : 'file');
    itemElement.textContent = item.name;

    if (item.type === 'directory') {
      itemElement.addEventListener('click', () => {
        currentPath.push(item.name);
        updateFileBrowser();
      });
    } else {
      itemElement.addEventListener('click', () => {
        showPreview(item);
      });
    }

    fileBrowser.appendChild(itemElement);
  });
}

// Zoekfunctionaliteit
searchInput.addEventListener('input', async (e) => {
  const query = e.target.value.toLowerCase();
  const allFiles = await getFiles();
  const filteredFiles = allFiles.filter((file) =>
    file.name.toLowerCase().includes(query)
  );
  renderFiles(filteredFiles);
});

// Toon een preview van een bestand
function showPreview(file) {
  previewContainer.innerHTML = '';

  const overlay = document.createElement('div');
  overlay.classList.add('preview-overlay');

  if (file.type === 'image') {
    const img = document.createElement('img');
    img.src = file.thumbnail;
    img.alt = file.name;
    img.classList.add('preview-image');
    overlay.appendChild(img);
  } else {
    const message = document.createElement('p');
    message.textContent = `Voorbeeld niet beschikbaar voor ${file.type}`;
    overlay.appendChild(message);
  }

  const downloadButton = document.createElement('a');
  downloadButton.href = `/assets/${file.category}/${file.name}`;
  downloadButton.download = file.name;
  downloadButton.textContent = 'Download';
  downloadButton.classList.add('download-button');
  overlay.appendChild(downloadButton);

  const closeButton = document.createElement('button');
  closeButton.textContent = 'Sluiten';
  closeButton.classList.add('close-button');
  closeButton.addEventListener('click', () => {
    previewContainer.innerHTML = '';
  });
  overlay.appendChild(closeButton);

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

// Initialiseer
updateFileBrowser();