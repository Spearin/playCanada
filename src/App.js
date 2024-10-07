import React, { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import Filters from './components/Filters';
import GameList from './components/GameList';
import AddGameForm from './components/AddGameForm';
import axios from 'axios';
import Modal from 'react-modal';

// Attach modal to root element
Modal.setAppElement('#root');


const App = () => {
  const [games, setGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    era: 'All',
    militaryBranch: 'All',
    war: 'All',
    cdnUnits: 'All',
    theatre: 'All',
    publisher: 'All',
    developer: 'All',
    keyCreative: 'All',
    releaseYear: 'All',
    realismRating: 'All',
    battles: 'All',
    genre: 'All',
  });
  
  const [filterOptions, setFilterOptions] = useState({
    militaryBranch: [],
    era: [],
    war: [],
    cdnUnits: [],
    theatre: [],
    publisher: [],
    developer: [],
    keyCreative: [],
    releaseYear: [],
    realismRating: [],
    battles: [],
    genre: [],
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/api/games');
        if (response.data && Array.isArray(response.data.games)) {
          setGames(response.data.games);
          setFilteredGames(response.data.games);
          
          // Check if the filters object is correctly structured
          if (response.data.filters) {
            setFilterOptions(response.data.filters);
          } else {
            console.error('Filters data is missing or incorrectly structured:', response.data);
          }
        }
      } catch (error) {
        console.error('Error fetching game data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchGames();
  }, []);
  
    
  // Handle search functionality
  const handleSearch = (term) => {
    setSearchTerm(term);
    filterGames(term, filters);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    filterGames(searchTerm, newFilters);
  };
  

  const filterGames = (term, appliedFilters) => {
    let filtered = [...games];
  
    console.log('Applied Filters:', appliedFilters);
  
    // Filter by search term across all fields
    if (term) {
      filtered = filtered.filter((game) =>
        Object.values(game).some((value) => {
          if (Array.isArray(value)) {
            return value.some((v) => {
              if (typeof v !== 'string') {
                console.warn('Non-string value encountered in array:', v);
              }
              return typeof v === 'string' && v.toLowerCase().includes(term.toLowerCase());
            });
          } else if (typeof value === 'string') {
            return value.toLowerCase().includes(term.toLowerCase());
          }
          return false;
        })
      );
    }
  
    // Apply additional filters - include only games that match ALL applied filter criteria
    Object.keys(appliedFilters).forEach((key) => {
      if (appliedFilters[key] !== 'All') {
        console.log(`Filtering by ${key}: ${appliedFilters[key]}`);
        filtered = filtered.filter((game) => {
          const gameValue = game[key];
          const filterValue = appliedFilters[key].toLowerCase();
  
          // Handle multi-value fields like battles
          if (Array.isArray(gameValue)) {
            return gameValue.some(
              (value) => typeof value === 'string' && value.toLowerCase() === filterValue
            );
          } else if (typeof gameValue === 'string') {
            return gameValue.toLowerCase() === filterValue;
          }
  
          // If the value is neither an array nor a string, it's a mismatch
          return false;
        });
      }
    });
  
    console.log('Filtered Games:', filtered);
    setFilteredGames(filtered);
  };
  
  

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
        <h1>Play Canada</h1>
        <div className="app-container">      
        <SearchBar onSearch={handleSearch} />
        <Filters filters={filters} filterOptions={filterOptions} onFilterChange={handleFilterChange} />
        <GameList games={filteredGames} />
        <AddGameForm onAddGame={(newGame) => setGames([...games, newGame])} />
        </div>
    </div>
  );
};

export default App;
