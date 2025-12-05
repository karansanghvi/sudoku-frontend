import React, { useContext, useEffect } from 'react';
import "../assets/styles/styles.css";
import { SudokuContext } from '../context/SudokuContext';
import SudokuBoard from '../components/SudokuBoard';

function NormalGame() {

  const { startNewGame, resetGame, time, getHint } = useContext(SudokuContext);

  useEffect(() => {
    startNewGame("normal");
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0")
    return `${mins}:${secs}`;
  };

  return (
    <div className='main-container'>
      <h1 className='title'>Game Type: Normal</h1>

      <br />

      <div className='game-controls'>
        <div className='buttons'>
          <button onClick={() => startNewGame("normal")} className='btn-primary' style={{ marginRight: '10px' }}>New Game</button>
          <button onClick={resetGame} className='btn-primary' style={{ marginRight: '10px' }}>Reset Game</button>
          <button onClick={getHint} className='btn-primary'>Hint</button>
        </div>
        <div>
          <p className='timer'>Time: {formatTime(time)}</p>
        </div>
      </div>

      <br />

      <div className='board-container'>
        <SudokuBoard />
      </div>
    </div>
  )
}

export default NormalGame
