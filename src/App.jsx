import React from 'react';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home';
import DetailPage from './components/DetailPage';
import SavedCollection from './components/SavedCollection';
import './App.css';

function App() {
  const [favorites, setFavorites] = useState([]);

  // Load favorites from localStorage on initial render
  useEffect(() => {
    const savedFavorites = localStorage.getItem('pokemonFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('pokemonFavorites', JSON.stringify(favorites));
  }, [favorites]);

  const addToFavorites = (pokemon) => {
    if (!favorites.some(fav => fav.id === pokemon.id)) {
      setFavorites([...favorites, pokemon]);
    }
  };

  const removeFromFavorites = (pokemonId) => {
    setFavorites(favorites.filter(pokemon => pokemon.id !== pokemonId));
  };

  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <div className="logo">
            <h1>Pokédex</h1>
          </div>
          <div className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/favorites">Favorites</Link>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route 
            path="/pokemon/:id" 
            element={<DetailPage addToFavorites={addToFavorites} favorites={favorites} />} 
          />
          <Route 
            path="/favorites" 
            element={<SavedCollection favorites={favorites} removeFromFavorites={removeFromFavorites} />} 
          />
        </Routes>

        <footer className="footer">
          <p>© 2025 Pokédex App - Kobe Santarin</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;