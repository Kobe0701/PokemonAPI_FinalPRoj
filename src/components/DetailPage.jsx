import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Loader from './Loader';

function DetailPage({ addToFavorites, favorites }) {
  const { id } = useParams();
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  const isFavorite = pokemon && favorites.some(fav => fav.id === pokemon.id);

  useEffect(() => {
    const fetchPokemonDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        if (!response.ok) {
          throw new Error('Pokemon not found');
        }
        const data = await response.json();
        
        // Fetch species data for description
        const speciesResponse = await fetch(data.species.url);
        const speciesData = await speciesResponse.json();
        
        // Find English description
        const description = speciesData.flavor_text_entries.find(
          entry => entry.language.name === 'en'
        )?.flavor_text || 'No description available';
        
        setPokemon({ ...data, description });
        setError(null);
      } catch (err) {
        setError('Failed to load Pokemon details. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemonDetails();
  }, [id]);

  const handleAddToFavorites = () => {
    addToFavorites(pokemon);
  };

  const goBack = () => {
    navigate(-1);
  };

  if (loading) return <Loader />;
  if (error) return <div className="error-message">{error}</div>;
  if (!pokemon) return <div className="not-found">Pokemon not found</div>;

  return (
    <div className="detail-container">
      <button onClick={goBack} className="back-button">← Back</button>
      
      <div className="pokemon-detail-card">
        <div className="pokemon-detail-header">
          <h1>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h1>
          <span className="pokemon-id">#{pokemon.id}</span>
        </div>
        
        <div className="pokemon-detail-content">
          <div className="pokemon-detail-image">
            <img 
              src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default} 
              alt={pokemon.name} 
            />
          </div>
          
          <div className="pokemon-detail-info">
            <p className="pokemon-description">{pokemon.description.replace(/\f/g, ' ')}</p>
            
            <div className="pokemon-stats">
              <h3>Stats</h3>
              {pokemon.stats.map(stat => (
                <div key={stat.stat.name} className="stat-bar">
                  <span className="stat-name">{stat.stat.name}</span>
                  <div className="stat-bar-container">
                    <div 
                      className="stat-bar-fill" 
                      style={{ width: `${Math.min(100, (stat.base_stat / 255) * 100)}%` }}
                    ></div>
                  </div>
                  <span className="stat-value">{stat.base_stat}</span>
                </div>
              ))}
            </div>
            
            <div className="pokemon-types">
              <h3>Types</h3>
              <div className="type-tags">
                {pokemon.types.map(type => (
                  <span 
                    key={type.type.name} 
                    className={`type-tag ${type.type.name}`}
                  >
                    {type.type.name}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="pokemon-abilities">
              <h3>Abilities</h3>
              <ul>
                {pokemon.abilities.map(ability => (
                  <li key={ability.ability.name}>
                    {ability.ability.name.replace(/-/g, ' ')}
                    {ability.is_hidden && <span className="hidden-ability"> (Hidden)</span>}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="pokemon-dimensions">
              <div>
                <h3>Height</h3>
                <p>{pokemon.height / 10} m</p>
              </div>
              <div>
                <h3>Weight</h3>
                <p>{pokemon.weight / 10} kg</p>
              </div>
            </div>
          </div>
        </div>
        
        <button 
          onClick={handleAddToFavorites} 
          className={`favorite-button ${isFavorite ? 'is-favorite' : ''}`}
          disabled={isFavorite}
        >
          {isFavorite ? 'Added to Favorites' : 'Add to Favorites'}
        </button>
      </div>
    </div>
  );
}

export default DetailPage;