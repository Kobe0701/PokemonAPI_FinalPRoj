import React from 'react';

function PokemonCard({ pokemon }) {
  return (
    <div className="pokemon-card">
      <div className="pokemon-image">
        <img 
          src={pokemon.sprites.front_default || 'https://via.placeholder.com/96'}
          alt={pokemon.name} 
        />
      </div>
      <div className="pokemon-info">
        <span className="pokemon-id">#{pokemon.id}</span>
        <h3 className="pokemon-name">{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h3>
        <div className="pokemon-types">
          {pokemon.types.map(type => (
            <span 
              key={type.type.name} 
              className={`type-badge ${type.type.name}`}
            >
              {type.type.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PokemonCard;