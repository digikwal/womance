const fileBrowser = document.getElementById("fileBrowser");
const categoryButtons = document.querySelectorAll("#categoryButtons button");
const searchInput = document.getElementById("searchInput");

let currentCategory = "";
let files = [];
let assets = {}; // Wordt dynamisch geladen

// Haal de JSON-data op
fetch("/data/assets.json")
  .then(response => response.json())
  .then(data => {
    assets = data; // Sla de opgehaalde data op
  })
  .catch(error => {
    console.error("Fout bij het ophalen van assets:", error);
  });

function renderFiles(list) {
  fileBrowser.innerHTML = "";
  if (list.length === 0) {
    fileBrowser.innerHTML = "<p>Geen bestanden gevonden.</p>";
    return;
  }

  list.forEach(filename => {
    const categoryPath = currentCategory ? `/assets/${currentCategory}/${filename}` : `#`;
    const fileEl = document.createElement("a");
    fileEl.href = categoryPath;
    fileEl.setAttribute("download", filename);
    fileEl.innerHTML = `<i class='fa fa-file'></i><span>${filename}</span>`;
    fileBrowser.appendChild(fileEl);
  });
}

categoryButtons.forEach(button => {
  button.addEventListener("click", () => {
    categoryButtons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");

    currentCategory = button.dataset.category;
    files = assets[currentCategory] || [];
    renderFiles(files);
  });
});

searchInput.addEventListener("input", () => {
  const term = searchInput.value.toLowerCase();
  const filtered = files.filter(name => name.toLowerCase().includes(term));
  renderFiles(filtered);
});