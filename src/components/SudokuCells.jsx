import React, { useContext } from 'react'
import { SudokuContext } from '../context/SudokuContext'

const SudokuCells = ({ value, row, col }) => {
    const {
        selectedCell,
        setSelectedCell,
        board,
        setBoard,
        invalidCells,
        hintCell,
        setHintCell,
    } = useContext(SudokuContext);

    const isInvalid = invalidCells.some(
        (cell) => cell.row === row && cell.col === col
    );

    const isSelected = selectedCell && selectedCell.row === row && selectedCell.col === col;

    const isHint = hintCell && hintCell.row === row && hintCell.col === col;

    const handleClick = () => {
        setSelectedCell({ row, col });
    };

    const handleChange = (e) => {
        const val = e.target.value;
        const max = board.length === 9 ? 9 : 6;
        if (/^[1-9]?$/.test(val) && Number(val) <= max) {
            const newBoard = board.map(row => [...row]); 
            newBoard[row][col] = val === "" ? "" : val;
            setBoard(newBoard);

            if (isHint && val !== "") {
                setHintCell(null);
            }
        }
    };
    return (
        <input
            type='text'
            maxLength={1}
            value={value || ""}
            onClick={handleClick}
            onChange={handleChange}
             className={`cell 
                ${isSelected ? "selected" : ""} 
                ${isInvalid ? "invalid" : ""}
                ${isHint ? "hint" : ""}`
            }
            readOnly={value !== null && value !== ""} 
        />
    )
};

export default SudokuCells;