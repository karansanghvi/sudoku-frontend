import React, { useState, useEffect } from 'react';
import "../assets/styles/styles.css";

function ScoresPage() {
  const [userScores, setUserScores] = useState([]);
  const [gameScores, setGameScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users'); 

  useEffect(() => {
    fetchScores();
  }, []);

  const fetchScores = async () => {
    try {
      const userResponse = await fetch('http://localhost:5001/api/highscore', {
        method: 'GET',
        credentials: 'include',
      });

      const gameResponse = await fetch('http://localhost:5001/api/highscore/games', {
        method: 'GET',
        credentials: 'include',
      });

      if (userResponse.ok) {
        const userData = await userResponse.json();
        setUserScores(userData.leaderboard);
      }

      if (gameResponse.ok) {
        const gameData = await gameResponse.json();
        setGameScores(gameData.games);
      }

    } catch (error) {
      console.error('Error fetching scores:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className='main-container'>
        <h1 className='title'>Loading scores...</h1>
      </div>
    );
  }

  return (
    <div className='main-container'>
      <h1 className='title'>High Scores</h1>

      {/* Tab buttons */}
      <div style={{ 
        display: 'flex', 
        gap: '10px', 
        marginBottom: '30px',
        justifyContent: 'center'
      }}>
        <button 
          onClick={() => setActiveTab('users')}
          className='btn-primary'
          style={{
            backgroundColor: activeTab === 'users' ? '#0080ffff' : '#666',
          }}
        >
          Player Leaderboard
        </button>
        <button 
          onClick={() => setActiveTab('games')}
          className='btn-primary'
          style={{
            backgroundColor: activeTab === 'games' ? '#0080ffff' : '#666',
          }}
        >
          Game Leaderboard
        </button>
      </div>

      {/* User Leaderboard */}
      {activeTab === 'users' && (
        <div>
          <h2 style={{ marginBottom: '20px' }}>Top Players</h2>
          
          {userScores.length === 0 ? (
            <p>No scores yet. Complete a game to appear on the leaderboard!</p>
          ) : (
            <div>
              {userScores.map((player) => (
                <div 
                  key={player.rank} 
                  className='container'
                  style={{
                    marginBottom: '15px',
                    padding: '15px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ 
                      fontSize: '24px', 
                      fontWeight: 'bold',
                      minWidth: '40px'
                    }}>
                      #{player.rank}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ margin: '0 0 5px 0' }}>
                        {player.rank === 1}
                        {player.rank === 2}
                        {player.rank === 3}
                        {player.username}
                      </h3>
                      <p style={{ margin: 0 }}>
                        <strong>Games Won:</strong> {player.gamesWon}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Game Leaderboard */}
      {activeTab === 'games' && (
        <div>
          <h2 style={{ marginBottom: '20px' }}>Most Completed Games</h2>
          
          {gameScores.length === 0 ? (
            <p>No completed games yet. Be the first to complete a game!</p>
          ) : (
            <div>
              {gameScores.map((game) => (
                <div 
                  key={game.rank} 
                  className='container'
                  style={{
                    marginBottom: '15px',
                    padding: '15px',
                    border: '1px solid #ddd',
                    borderRadius: '8px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ 
                      fontSize: '24px', 
                      fontWeight: 'bold',
                      minWidth: '40px'
                    }}>
                      #{game.rank}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ margin: '0 0 5px 0' }}>
                        {game.rank === 1}
                        {game.name}
                      </h3>
                      <p style={{ margin: '3px 0', fontSize: '14px' }}>
                        <strong>Difficulty:</strong> {game.difficulty} ({game.size}x{game.size})
                      </p>
                      <p style={{ margin: '3px 0', fontSize: '14px' }}>
                        <strong>Created by:</strong> {game.createdBy}
                      </p>
                      <p style={{ margin: '3px 0', fontSize: '14px' }}>
                        <strong>Completed by:</strong> {game.completionCount} player(s)
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ScoresPage;