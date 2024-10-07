import React, { useState } from 'react';

const AddGameForm = ({ onAddGame }) => {
  const [gameName, setGameName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddGame({ name: gameName });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Game Name"
        value={gameName}
        onChange={(e) => setGameName(e.target.value)}
      />
      <button type="submit">Add Game</button>
    </form>
  );
};

export default AddGameForm;
