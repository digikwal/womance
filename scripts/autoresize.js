function autoResize(textarea) {
  if (textarea.tagName.toLowerCase() === 'textarea') { // Controleer of het een <textarea> is
    textarea.style.height = 'auto'; // Reset de hoogte
    textarea.style.height = textarea.scrollHeight + 'px'; // Stel de hoogte in op basis van de inhoud
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const messageField = document.getElementById('bericht');
  if (messageField) {
    // Zorg ervoor dat de autoresize werkt bij handmatig typen
    messageField.addEventListener('input', () => autoResize(messageField));
  }
});