// Entry point for the admin React app.
// Loads global styles and mounts the root <App /> component.
// StrictMode helps surface side effects during development.
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);