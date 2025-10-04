// src/main.jsx
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router';
import App from './App';
import { GameProvider } from './context/GameContext';

ReactDOM.createRoot(document.getElementById('root')).render(
    <BrowserRouter>
      <GameProvider> 
        <Routes>
          <Route path="/" element={<App />} />
        </Routes>
      </GameProvider>
    </BrowserRouter>
);
