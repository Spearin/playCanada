import React, { useState } from 'react';
import Modal from 'react-modal';

// Setting the app element for accessibility
Modal.setAppElement('#root');

const GameList = ({ games }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);

  // Open the modal and set the selected game
  const openModal = (game) => {
    console.log('Opening modal for game:', game);
    setSelectedGame(game);
    setModalIsOpen(true);
  };

  // Close the modal
  const closeModal = () => {
    console.log('Closing modal');
    setModalIsOpen(false);
    setSelectedGame(null);
  };

  return (
    <div className="game-list">
      {games.map((game, index) => (
        <div
          key={index}
          className="game-item"
          onClick={() => openModal(game)}
        >
          <img src={game.thumbnail} alt={game.gameName} />
          <h3>{game.gameName}</h3>
          <p>{game.description}</p>
        </div>
      ))}

      {selectedGame && (
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Game Details"
          className="game-modal"
          overlayClassName="game-modal-overlay"
        >
          <h2>{selectedGame.gameName}</h2>
          <p><strong>Era:</strong> {selectedGame.era}</p>
          <p><strong>Military Branch:</strong> {selectedGame.militaryBranch}</p>
          <p><strong>War:</strong> {selectedGame.war}</p>
          <p><strong>Canadian Units:</strong> {selectedGame.cdnUnits}</p>
          <p><strong>Theatre:</strong> {selectedGame.theatre}</p>
          <p><strong>Description:</strong> {selectedGame.description}</p>
          <p><strong>Publisher:</strong> {selectedGame.publisher}</p>
          <p><strong>Developer:</strong> {selectedGame.developer}</p>
          <p><strong>Key Creative:</strong> {selectedGame.keyCreative}</p>
          <p><strong>Release Year:</strong> {selectedGame.releaseYear}</p>
          <p><strong>Realism Rating:</strong> {selectedGame.realismRating}</p>
          <p><strong>Battles:</strong> {selectedGame.battles.join(', ')}</p>
          <p><strong>Genre:</strong> {selectedGame.genre}</p>
          <div className="screenshots">
            <h3>Screenshots</h3>
            <img src={selectedGame.screenshotUrl} alt="Screenshot" />
          </div>
          <button className="close-modal-button" onClick={closeModal}>Close</button>
        </Modal>
      )}
    </div>
  );
};

export default GameList;
