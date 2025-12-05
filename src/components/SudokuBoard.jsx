import React, { useContext } from 'react'
import { SudokuContext } from '../context/SudokuContext'
import SudokuCells from './SudokuCells';
import "../assets/styles/board.css"

function SudokuBoard() {

  const { board } = useContext(SudokuContext);

  return (
    <div className='board'>
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="row">
          {row.map((cell, colIndex) => (
            <SudokuCells
              key={colIndex}
              value={cell}
              row={rowIndex}
              col={colIndex}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default SudokuBoard
