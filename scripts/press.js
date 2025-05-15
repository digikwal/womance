const categoryButtons = document.querySelectorAll('.toggle-btn');
const searchInput = document.getElementById('searchInput');
const fileBrowser = document.getElementById('fileBrowser');
const previewContainer = document.getElementById('preview');

let activeCategories = new Set();
let files = []; // Cache voor bestanden

// Toggle categorieën
categoryButtons.forEach(button => {
  button.addEventListener('click', () => {
    const category = button.dataset.category;
    if (activeCategories.has(category)) {
      activeCategories.delete(category);
      button.classList.remove('active');
    } else {
      activeCategories.add(category);
      button.classList.add('active');
    }
    updateFileBrowser();
  });
});

// Zoekfunctie
searchInput.addEventListener('input', () => {
  updateFileBrowser();
});

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
  const query = searchInput.value.toLowerCase();
  const categories = Array.from(activeCategories);

  // Controleer of er actieve categorieën of een zoekterm zijn
  if (categories.length === 0 && query === '') {
    fileBrowser.innerHTML = ''; // Leeg de file browser
    previewContainer.innerHTML = ''; // Leeg de preview container
    return; // Stop de functie
  }

  // Haal bestanden op
  const allFiles = await getFiles();
  const filteredFiles = allFiles.filter(file => {
    const matchesCategory = categories.length === 0 || categories.includes(file.category);
    const matchesQuery = file.name.toLowerCase().includes(query);
    return matchesCategory && matchesQuery;
  });

  renderFiles(filteredFiles);
}

// Render bestanden
function renderFiles(files) {
  fileBrowser.innerHTML = '';
  previewContainer.innerHTML = '';

  files.forEach(file => {
    if (file.type === 'image' && file.thumbnail) {
      // Maak een container voor de thumbnail
      const thumbnailContainer = document.createElement('div');
      thumbnailContainer.classList.add('thumbnail-container');

      // Voeg de thumbnail toe
      const img = document.createElement('img');
      img.src = file.thumbnail;
      img.alt = file.name;
      img.classList.add('thumbnail');
      thumbnailContainer.appendChild(img);

      // Voeg een klik-event toe om de preview te vergroten
      img.addEventListener('click', () => {
        showPreview(file);
      });

      fileBrowser.appendChild(thumbnailContainer);
    }
  });
}

// Toon een vergrote preview met downloadknop
function showPreview(file) {
  // Leeg de preview container
  previewContainer.innerHTML = '';

  // Maak een overlay voor de preview
  const overlay = document.createElement('div');
  overlay.classList.add('preview-overlay');

  // Voeg de vergrote afbeelding toe
  const img = document.createElement('img');
  img.src = file.thumbnail;
  img.alt = file.name;
  img.classList.add('preview-image');
  overlay.appendChild(img);

  // Controleer of de afbeelding correct geladen is
  img.onload = () => {
    console.log('Afbeelding geladen:', file.name);
  };

  img.onerror = () => {
    console.error('Fout bij het laden van de afbeelding:', file.name);
  };

  // Voeg een downloadknop toe
  const downloadButton = document.createElement('a');
  downloadButton.href = file.thumbnail; // Gebruik de thumbnail-URL als downloadlink
  downloadButton.download = file.name;
  downloadButton.textContent = 'Download';
  downloadButton.classList.add('download-button');
  overlay.appendChild(downloadButton);

  // Voeg een sluitknop toe
  const closeButton = document.createElement('button');
  closeButton.textContent = 'Sluiten';
  closeButton.classList.add('close-button');
  closeButton.addEventListener('click', () => {
    previewContainer.innerHTML = ''; // Sluit de preview
  });
  overlay.appendChild(closeButton);

  // Voeg de overlay toe aan de preview container
  previewContainer.appendChild(overlay);
}

// Initialiseer
updateFileBrowser();