const fileBrowser = document.getElementById('fileBrowser');
const subFileBrowser = document.getElementById('subFileBrowser');
const previewContainer = document.getElementById('preview');
const categoryList = document.getElementById('categoryList');
const searchInput = document.getElementById('searchInput');

let currentPath = [];
let files = [];

async function getFiles() {
  if (files.length === 0) {
    try {
      const response = await fetch('/data/assets.json');
      if (!response.ok) throw new Error('Failed to fetch assets.json');
      files = await response.json();
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  }
  return files;
}

function getCurrentDirectory(allFiles) {
  let directory = allFiles;
  for (const pathSegment of currentPath) {
    const subdirectory = directory.find((item) => item.name === pathSegment && item.type === 'directory');
    if (subdirectory && subdirectory.children) {
      directory = subdirectory.children;
    } else {
      return [];
    }
  }
  return directory;
}

function sortItems(items) {
  return items.sort((a, b) => {
    if (a.type === 'directory' && b.type !== 'directory') return -1;
    if (a.type !== 'directory' && b.type === 'directory') return 1;
    return a.name.localeCompare(b.name);
  });
}

function renderFiles(items, target = fileBrowser, parentItems = null, updatePath = false) {
  target.innerHTML = '';
  if (currentPath.length === 0 && target === fileBrowser) {
    const message = document.createElement('div');
    message.classList.add('no-category-message');
    message.textContent = 'Selecteer een categorie aan de linkerkant om te beginnen met bladeren.';
    target.appendChild(message);
    return;
  }
  if (currentPath.length > 0 && target === fileBrowser) {
    const backButton = document.createElement('div');
    backButton.classList.add('directory');
    backButton.innerHTML = '<i class="fas fa-arrow-left"></i> Terug';
    backButton.addEventListener('click', () => {
      if (updatePath) currentPath.pop();
      updateFileBrowser();
    });
    target.appendChild(backButton);
  }
  const sortedItems = sortItems(items);
  sortedItems.forEach((item) => {
    const itemElement = document.createElement('div');
    itemElement.classList.add(item.type === 'directory' ? 'directory' : 'file');
    itemElement.innerHTML = `<i class="fas ${item.type === 'directory' ? 'fa-folder' : 'fa-file'}"></i> ${item.name}`;
    if (item.type === 'directory') {
      itemElement.addEventListener('click', () => {
        if (target === fileBrowser) {
          renderFiles(item.children || [], subFileBrowser, items, false);
          subFileBrowser.style.display = 'block';
          document.querySelectorAll('#fileBrowser .directory').forEach((dir) => dir.classList.remove('active'));
          itemElement.classList.add('active');
        } else if (target === subFileBrowser) {
          renderFiles(item.children || [], subFileBrowser, items, false);
        }
      });
    } else {
      itemElement.addEventListener('click', () => showPreview(item, items));
    }
    target.appendChild(itemElement);
  });
  if (parentItems && target === subFileBrowser) renderFiles(parentItems, fileBrowser, null, false);
}

async function updateFileBrowser() {
  const allFiles = await getFiles();
  const currentDirectory = getCurrentDirectory(allFiles);
  if (currentPath.length === 0) {
    renderFiles([], fileBrowser);
    subFileBrowser.innerHTML = '';
    return;
  }
  renderFiles(currentDirectory, fileBrowser);
  subFileBrowser.innerHTML = '';
}

function showPreview(file, filesInDirectory) {
  previewContainer.innerHTML = '';
  const overlay = document.createElement('div');
  overlay.classList.add('preview-overlay');
  const filesOnly = filesInDirectory.filter(f => f.type !== 'directory');
  let currentIndex = filesOnly.findIndex(f => f.name === file.name);
  if (currentIndex === -1) return;

  const updatePreview = (index) => {
    const currentFile = filesOnly[index];
    overlay.innerHTML = '';
    const filePath = `/assets/${currentFile.category}/${currentFile.name}`;

    if (currentFile.type === 'image') {
      const img = document.createElement('img');
      img.src = currentFile.thumbnail;
      img.alt = currentFile.name;
      img.classList.add('preview-image');
      overlay.appendChild(img);
    } else if (currentFile.name.match(/\.(txt|md|log)$/i)) {
      fetch(filePath)
        .then((r) => r.text())
        .then((text) => {
          const pre = document.createElement('pre');
          pre.classList.add('preview-text');
          pre.textContent = text;
          overlay.appendChild(pre);
        })
        .catch(() => {
          const msg = document.createElement('p');
          msg.textContent = 'Kan tekstbestand niet laden.';
          overlay.appendChild(msg);
        });
    } else if (currentFile.name.match(/\.(mp3|wav|ogg)$/i)) {
      const audio = document.createElement('audio');
      audio.controls = true;
      audio.src = filePath;
      audio.classList.add('preview-audio');
      overlay.appendChild(audio);
    } else if (currentFile.name.match(/\.(mp4|webm|mov)$/i)) {
      const video = document.createElement('video');
      video.controls = true;
      video.src = filePath;
      video.classList.add('preview-video');
      overlay.appendChild(video);
    } else if (currentFile.name.match(/\.pdf$/i)) {
      const iframe = document.createElement('iframe');
      iframe.src = filePath;
      iframe.classList.add('preview-pdf');
      overlay.appendChild(iframe);
    } else {
      const message = document.createElement('p');
      message.textContent = `Voorbeeld niet beschikbaar voor ${currentFile.name}`;
      overlay.appendChild(message);
    }

    if (index > 0) {
      const leftArrow = document.createElement('button');
      leftArrow.classList.add('arrow', 'arrow-left');
      leftArrow.innerHTML = '<i class="fas fa-arrow-left"></i>';
      leftArrow.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + filesOnly.length) % filesOnly.length;
        updatePreview(currentIndex);
      });
      overlay.appendChild(leftArrow);
    }
    if (index < filesOnly.length - 1) {
      const rightArrow = document.createElement('button');
      rightArrow.classList.add('arrow', 'arrow-right');
      rightArrow.innerHTML = '<i class="fas fa-arrow-right"></i>';
      rightArrow.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % filesOnly.length;
        updatePreview(currentIndex);
      });
      overlay.appendChild(rightArrow);
    }

    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('button-container');
    const downloadButton = document.createElement('a');
    downloadButton.href = filePath;
    downloadButton.download = currentFile.name;
    downloadButton.textContent = 'Download';
    downloadButton.classList.add('download-button');
    buttonContainer.appendChild(downloadButton);
    const closeButton = document.createElement('button');
    closeButton.textContent = 'Sluiten';
    closeButton.classList.add('close-button');
    closeButton.addEventListener('click', () => {
      previewContainer.innerHTML = '';
      document.removeEventListener('keydown', handleKeydown);
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
      document.removeEventListener('keydown', handleKeydown);
    }
  };

  let startX = 0;
  let endX = 0;
  overlay.addEventListener('touchstart', (e) => startX = e.touches[0].clientX);
  overlay.addEventListener('touchmove', (e) => endX = e.touches[0].clientX);
  overlay.addEventListener('touchend', () => {
    const swipeDistance = endX - startX;
    if (swipeDistance > 50 && currentIndex > 0) {
      currentIndex = (currentIndex - 1 + filesOnly.length) % filesOnly.length;
      updatePreview(currentIndex);
    } else if (swipeDistance < -50 && currentIndex < filesOnly.length - 1) {
      currentIndex = (currentIndex + 1) % filesOnly.length;
      updatePreview(currentIndex);
    }
  });

  document.addEventListener('keydown', handleKeydown);
  updatePreview(currentIndex);
  previewContainer.appendChild(overlay);
}

categoryList.addEventListener('click', (e) => {
  if (e.target.classList.contains('finder-item')) {
    const category = e.target.getAttribute('data-category');
    currentPath = [category];
    updateFileBrowser();
    document.querySelectorAll('.finder-item').forEach((item) => item.classList.remove('active'));
    e.target.classList.add('active');
  }
});

searchInput.addEventListener('input', async (e) => {
  const query = e.target.value.toLowerCase();
  const allFiles = await getFiles();
  const filteredFiles = allFiles.filter((file) => file.name.toLowerCase().includes(query));
  renderFiles(filteredFiles, fileBrowser);
  subFileBrowser.innerHTML = '';
});

updateFileBrowser();

function checkOrientationSupport() {
  const isMobile = window.innerWidth < 768;
  const isPortrait = window.innerHeight > window.innerWidth;
  const overlay = document.getElementById('rotateOverlay');
  if (isMobile && isPortrait) {
    overlay.classList.add('visible');
  } else {
    overlay.classList.remove('visible');
  }
}

window.addEventListener('resize', checkOrientationSupport);
window.addEventListener('orientationchange', checkOrientationSupport);
document.addEventListener('DOMContentLoaded', checkOrientationSupport);
