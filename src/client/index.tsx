import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
// import './styles/index.css';

const root = createRoot(document.getElementById('app') as Element);
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);