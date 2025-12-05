import React, { useState, useEffect } from 'react';
import "../assets/styles/styles.css";
import { useNavigate } from 'react-router-dom';

function GameSelection() {
  const navigate = useNavigate();
  
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creatingGame, setCreatingGame] = useState(false);
  const [error, setError] = useState('');
  const [deletingGameId, setDeletingGameId] = useState(null);

  useEffect(() => {
    fetchGames();
  }, []);

  // Fetch list of all games
  const fetchGames = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/sudoku', {
        method: 'GET',
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        setGames(data.games);
      } else {
        console.error('Error fetching games:', data.error);
      }
    } catch (error) {
      console.error('Error fetching games:', error);
    } finally {
      setLoading(false);
    }
  };

  // Create a new game
  const createGame = async (difficulty) => {
    setCreatingGame(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5001/api/sudoku', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ difficulty }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create game');
      }

      console.log('Game created:', data);

      navigate(`/game/${data.game.id}`);

    } catch (err) {
      console.error('Create game error:', err);
      setError(err.message);
    } finally {
      setCreatingGame(false);
    }
  };

  // Delete a game 
  const deleteGame = async (gameId, gameName) => {
    if (!window.confirm(`Are you sure you want to delete the  game "${gameName}"? This action cannot be undone.`)) {
      return;
    }

    setDeletingGameId(gameId);
    setError('');

    try {
      const response = await fetch(`http://localhost:5001/api/sudoku/${gameId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete game');
      }

      console.log('Game deleted:', data);

      setGames(games.filter(game => game.id !== gameId));
    } catch (err) {
      console.error('Delete game error:', err);
      setError(err.message);
    } finally {
      setDeletingGameId(null);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <>
      <div className='main-container'>
        <h1 className='title'>Game Selection</h1>

        {/* Error message */}
        {error && (
          <div style={{
            color: 'red',
            marginBottom: '20px',
            padding: '10px',
            backgroundColor: '#ffebee',
            borderRadius: '4px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        {/* Create New Game Section */}
        <div style={{ marginBottom: '40px' }}>
          <p style={{ marginBottom: '10px', fontSize: '20px' }}>Create New Game:</p>

          <div className="container">
            <div>
              <h3>Normal Game (9x9)</h3>
            </div>
            <div>
              <button 
                onClick={() => createGame('NORMAL')} 
                className='btn-primary'
                disabled={creatingGame}
              >
                {creatingGame ? 'Creating...' : 'Create & Play'}
              </button>
            </div>
          </div>

          <div className="container">
            <div>
              <h3>Easy Game (6x6)</h3>
            </div>
            <div>
              <button 
                onClick={() => createGame('EASY')} 
                className='btn-primary'
                disabled={creatingGame}
              >
                {creatingGame ? 'Creating...' : 'Create & Play'}
              </button>
            </div>
          </div>
        </div>

        {/* Existing Games List */}
        <div>
          <p style={{ marginBottom: '10px', fontSize: '20px' }}>Or Play Existing Games:</p>

          {loading ? (
            <p>Loading games...</p>
          ) : games.length === 0 ? (
            <p>No games available yet. Create the first one!</p>
          ) : (
            <div>
              {games.map((game) => (
                <div 
                  key={game.id} 
                  className="container" 
                  style={{ 
                    marginBottom: '15px',
                    padding: '15px',
                    border: '1px solid #ddd',
                    borderRadius: '8px'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <h3 style={{ marginBottom: '8px' }}>{game.name}</h3>
                    <p style={{ margin: '5px 0', fontSize: '14px' }}>
                      <strong>Difficulty:</strong> {game.difficulty} ({game.size}x{game.size})
                    </p>
                    <p style={{ margin: '5px 0', fontSize: '14px' }}>
                      <strong>Created by:</strong> {game.createdBy}
                    </p>
                    <p style={{ margin: '5px 0', fontSize: '14px' }}>
                      <strong>Date:</strong> {formatDate(game.createdAt)}
                    </p>
                    <p style={{ margin: '5px 0', fontSize: '14px' }}>
                      <strong>Completed by:</strong> {game.completedCount} player(s)
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
                    <button 
                      onClick={() => navigate(`/game/${game.id}`)}
                      className='btn-primary'
                      disabled={deletingGameId === game.id}
                    >
                      Play Game
                    </button>
                    
                    <button 
                      onClick={() => deleteGame(game.id, game.name)}
                      className='btn-primary'
                      disabled={deletingGameId === game.id}
                      style={{ 
                        backgroundColor: deletingGameId === game.id ? '#ccc' : '#d32f2f',
                        cursor: deletingGameId === game.id ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {deletingGameId === game.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default GameSelection