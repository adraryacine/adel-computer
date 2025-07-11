// Point d'entrée principal de l'application React
// On importe StrictMode pour activer des vérifications supplémentaires en développement
import { StrictMode } from 'react'
// On importe la fonction pour créer la racine React
import { createRoot } from 'react-dom/client'
// On importe les styles globaux
import './App.css'
// On importe le composant principal de l'application
import App from './App.jsx'

// Handle external script errors (browser extensions, etc.)
window.addEventListener('error', (event) => {
  // Ignore errors from external scripts (browser extensions, etc.)
  if (event.filename && (
    event.filename.includes('share-modal.js') ||
    event.filename.includes('extension') ||
    event.filename.includes('chrome-extension') ||
    event.filename.includes('moz-extension')
  )) {
    event.preventDefault();
    return false;
  }
});

// On crée la racine React à partir de l'élément HTML avec l'id 'root'
// Puis on rend l'application à l'intérieur de <StrictMode> pour de meilleures pratiques
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
