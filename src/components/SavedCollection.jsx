import React from 'react';
import { Link } from 'react-router-dom';
import PokemonCard from './PokemonCard';

function SavedCollection({ favorites, removeFromFavorites }) {
  return (
    <div className="favorites-container">
      <h2>My Favorite Pokémon</h2>
      
      {favorites.length === 0 ? (
        <div className="no-favorites">
          <p>You haven't added any Pokémon to your favorites yet.</p>
          <Link to="/" className="return-home">Return to Home to add some Pokémon!</Link>
        </div>
      ) : (
        <div className="pokemon-grid">
          {favorites.map(pokemon => (
            <div key={pokemon.id} className="favorite-card-container">
              <Link to={`/pokemon/${pokemon.id}`} className="pokemon-link">
                <PokemonCard pokemon={pokemon} />
              </Link>
              <button 
                onClick={() => removeFromFavorites(pokemon.id)} 
                className="remove-favorite"
              >
                Remove from Favorites
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SavedCollection;