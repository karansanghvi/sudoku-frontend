import React, { useContext, useEffect } from 'react';
import "../assets/styles/styles.css";
import { SudokuContext } from '../context/SudokuContext';
import SudokuBoard from '../components/SudokuBoard';

function EasyGame() {

  const { startNewGame, resetGame, time, getHint } = useContext(SudokuContext);

  useEffect(() => {
    startNewGame("easy");
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0")
    return `${mins}:${secs}`;
  };

  return (
    <div className='main-container'>
      <h1 className='title'>Game Type: Easy</h1>

      <br />

      <div className='game-controls'>
        <div className='buttons'>
          <button onClick={() => startNewGame("easy")} className='btn-primary' style={{ marginRight: '10px' }}>New Game</button>
          <button onClick={resetGame} className='btn-primary' style={{ marginRight: '10px' }}>Reset Game</button>
          <button onClick={getHint} className='btn-primary'>Hint</button>
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
  )
}

export default EasyGame
