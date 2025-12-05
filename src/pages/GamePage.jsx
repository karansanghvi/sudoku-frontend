import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import "../assets/styles/styles.css";
import { SudokuContext } from '../context/SudokuContext';
import SudokuBoard from '../components/SudokuBoard';

function GamePage() {
  const { gameId } = useParams(); 
  const navigate = useNavigate();
  
  const { 
    board,
    setBoard, 
    setOriginalBoard, 
    time, 
    setTime,
    setTimerActive,
    getHint,
    setSelectedCell,
    setInvalidCells,
    setHintCell
  } = useContext(SudokuContext);

  const [gameData, setGameData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    fetchGame();
  }, [gameId]); 

  useEffect(() => {
    if (!gameData || isCompleted) return;

    console.log('Setting up auto-save interval...');

    const saveInterval = setInterval(() => {
      console.log('10 seconds passed - saving...');
      saveProgress();
    }, 10000);

    return () => {
      console.log('Clearing auto-save interval');
      clearInterval(saveInterval);
    };
  }, [gameData?._id, isCompleted]); 

  const fetchGame = async () => {
    console.log(`📥 Fetching game data for gameId: ${gameId}`);
    setLoading(true);
    
    try {
      const response = await fetch(`http://localhost:5001/api/sudoku/${gameId}`, {
        method: 'GET',
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load game');
      }

      console.log('Game loaded:', data.game);
      
      setGameData(data.game);
      setIsCompleted(data.game.isCompleted || false);
      
      if (data.game.userProgress && data.game.userProgress.currentBoard) {
        console.log('Loading saved progress...');
        loadGameBoard(data.game.userProgress.currentBoard, false);
        setTime(data.game.userProgress.timeSpent || 0);
      } else {
        console.log('No saved progress, loading new game board');
        loadGameBoard(data.game.puzzle, true);
      }
      
      if (!data.game.isCompleted) {
        setTimerActive(true);
      }

    } catch (err) {
      console.error('Fetch game error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadGameBoard = (puzzle, isOriginal = true) => {
    console.log('Loading game board with puzzle:', puzzle);
    const formattedPuzzle = puzzle.map(row => 
      row.map(cell => cell === null ? '' : cell)
    );

    console.log('Formatted puzzle:', formattedPuzzle);
    
    setBoard(formattedPuzzle);
    
    if (isOriginal) {
      setOriginalBoard(formattedPuzzle);
      setTime(0);
    }
    
    setSelectedCell(null);
    setInvalidCells([]);
    setHintCell(null);

    console.log('Game board loaded successfully');
  };

  const saveProgress = async () => {
    if (!board || board.length === 0 || !gameData) {
      console.log('Cannot save: Missing data');
      return;
    }

    console.log('Saving progress...', { time, boardLength: board.length });

    try {
      const response = await fetch(`http://localhost:5001/api/sudoku/${gameId}/progress`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ 
          currentBoard: board,
          timeSpent: time
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Progress saved successfully!', data);
      } else {
        console.error('Failed to save progress:', data);
      }
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  const handleReset = () => {
    if (gameData) {
      loadGameBoard(gameData.puzzle, true);
      setIsCompleted(false);
    }
  };

  const handleComplete = async () => {
    try {
      console.log('Marking game as complete...');
      await saveProgress();

      const response = await fetch(`http://localhost:5001/api/sudoku/${gameId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ completed: true }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsCompleted(true);
        setTimerActive(false);
        alert('Congratulations! You completed the game! 🎉');
        console.log('Game marked as complete');
      } else {
        console.error('Error marking game complete:', data.error);
      }
    } catch (error) {
      console.error('Complete game error:', error);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  if (loading) {
    return (
      <div className='main-container'>
        <h1 className='title'>Loading game...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className='main-container'>
        <h1 className='title'>Error</h1>
        <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>
        <button 
          onClick={() => navigate('/games')} 
          className='btn-primary'
          style={{ display: 'block', margin: '20px auto' }}
        >
          Back to Game Selection
        </button>
      </div>
    );
  }

  return (
    <div className='main-container'>
      <h1 className='title'>{gameData.name}</h1>
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '30px', 
        marginBottom: '20px',
        flexWrap: 'wrap'
      }}>
        <p><strong>Difficulty:</strong> {gameData.difficulty} ({gameData.size}x{gameData.size})</p>
        <p><strong>Created by:</strong> {gameData.createdBy}</p>
        <p><strong>Completed by:</strong> {gameData.completedBy.length} player(s)</p>
      </div>

      {isCompleted && (
        <div style={{
          backgroundColor: '#4caf50',
          color: 'white',
          padding: '15px',
          borderRadius: '8px',
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          <h2>🎉 Game Completed! 🎉</h2>
          <p>You finished this puzzle!</p>
        </div>
      )}

      <br />

      <div className='game-controls'>
        <div className='buttons'>
          <button 
            onClick={handleReset} 
            className='btn-primary' 
            style={{ marginRight: '10px' }}
          >
            Reset Game
          </button>
          <button 
            onClick={getHint} 
            className='btn-primary'
            style={{ marginRight: '10px' }}
            disabled={isCompleted}
          >
            Hint
          </button>
          <button 
            onClick={handleComplete} 
            className='btn-primary'
            disabled={isCompleted}
          >
            {isCompleted ? 'Completed ✓' : 'Mark as Complete'}
          </button>
          <button 
            onClick={saveProgress} 
            className='btn-primary'
            style={{ marginLeft: '10px' }}
          >
            Save Now
          </button>
        </div>
        <div>
          <span className='timer'>Time: {formatTime(time)}</span>
        </div>
      </div>

      <br />

      <div className='board-container'>
        <SudokuBoard />
      </div>
    </div>
  );
}

export default GamePage;