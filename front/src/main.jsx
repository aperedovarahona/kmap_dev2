import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { AuthProvider } from './auth.jsx';
import './index.css';
import './theme.css';

// Inicialización inmediata del tema guardado para evitar parpadeos
const savedTheme = localStorage.getItem('kmap_theme') || 'blue';
document.documentElement.setAttribute('data-theme', savedTheme);
if (document.body) {
  document.body.setAttribute('data-theme', savedTheme);
}

createRoot(document.getElementById('root')).render(
  <BrowserRouter><AuthProvider><App /></AuthProvider></BrowserRouter>
);
