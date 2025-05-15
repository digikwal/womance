const categoryButtons = document.querySelectorAll('.toggle-btn');
const resetFiltersButton = document.getElementById('resetFilters');
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

// Reset filters
resetFiltersButton.addEventListener('click', () => {
  activeCategories.clear();
  categoryButtons.forEach(button => button.classList.remove('active'));
  updateFileBrowser();
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
    const fileElement = document.createElement('div');
    fileElement.textContent = file.name;
    fileBrowser.appendChild(fileElement);

    if (file.type === 'image') {
      const img = document.createElement('img');
      img.src = file.thumbnail;
      previewContainer.appendChild(img);
    }
  });
}

// Initialiseer
updateFileBrowser();