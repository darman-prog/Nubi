import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App';
import { StorageService } from './core/storage';
import { SettingsService } from './core/settings';
import './styles/main.css';

// Aplicamos los ajustes guardados antes de renderizar para evitar parpadeos de tema.
const storage = new StorageService();
new SettingsService(storage).init();

// Montamos la aplicación de forma segura verificando la existencia del nodo contenedor
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('No se encontró el elemento raíz con id "root".');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
