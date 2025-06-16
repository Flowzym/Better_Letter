import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import 'react-quill/dist/quill.snow.css';

// BOLT-UI-ANPASSUNG 2025-01-15: StrictMode entfernt um findDOMNode-Warnungen zu eliminieren
createRoot(document.getElementById('root')!).render(
  <App />
);