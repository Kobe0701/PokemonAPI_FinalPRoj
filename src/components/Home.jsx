import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PokemonCard from './PokemonCard';
import Loader from './Loader';

function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch initial list of Pokemon
  useEffect(() => {
    fetchInitialPokemon();
  }, []);

  const fetchInitialPokemon = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=12');
      if (!response.ok) {
        throw new Error('Failed to fetch Pokemon');
      }
      const data = await response.json();
      
      // Fetch detailed data for each Pokemon
      const detailedPokemonData = await Promise.all(
        data.results.map(async (pokemon) => {
          const detailResponse = await fetch(pokemon.url);
          return await detailResponse.json();
        })
      );

      setPokemonList(detailedPokemonData);
      setError(null);
    } catch (err) {
      setError('Failed to load Pokemon. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    try {
      setLoading(true);
      // Try to search for a specific Pokemon by name or ID
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${searchTerm.toLowerCase()}`);
        if (response.ok) {
          const data = await response.json();
          setPokemonList([data]);
          setError(null);
          return;
        }
      } catch (specificError) {
        // If specific search fails, continue to try searching in all results
      }

      // If specific search fails, fetch all and filter client-side
      const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=100');
      if (!response.ok) {
        throw new Error('Failed to fetch Pokemon');
      }
      
      const data = await response.json();
      
      // Filter results that contain the search term
      const filteredResults = data.results.filter(pokemon => 
        pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

      if (filteredResults.length === 0) {
        setPokemonList([]);
        setError('No Pokemon found matching your search.');
        setLoading(false);
        return;
      }

      // Fetch detailed data for filtered Pokemon
      const detailedPokemonData = await Promise.all(
        filteredResults.map(async (pokemon) => {
          const detailResponse = await fetch(pokemon.url);
          return await detailResponse.json();
        })
      );

      setPokemonList(detailedPokemonData);
      setError(null);
    } catch (err) {
      setError('Failed to search Pokemon. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-container">
      <div className="search-section">
        <h2>Search for Pokémon</h2>
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Enter Pokémon name or ID..."
            className="search-input"
          />
          <button type="submit" className="search-button">Search</button>
        </form>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <Loader />
      ) : (
        <div className="pokemon-grid">
          {pokemonList.length > 0 ? (
            pokemonList.map(pokemon => (
              <Link to={`/pokemon/${pokemon.id}`} key={pokemon.id} className="pokemon-link">
                <PokemonCard pokemon={pokemon} />
              </Link>
            ))
          ) : (
            <div className="no-results">No Pokemon found</div>
          )}
        </div>
      )}
    </div>
  );
}

export default Home;