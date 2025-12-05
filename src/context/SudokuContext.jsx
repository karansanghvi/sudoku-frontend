/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useEffect, useState } from 'react';

// to create an empty sudoku board
function createBoard(size) {
  let board = [];
  for (let i = 0; i < size; i++) {
    board.push(new Array(size).fill(null));
  }
  return board;
};

// check if the number is valid according to sudoku
function isValid(board, row, col, num, size, subH, subW) {
  for (let i = 0; i < size; i++) {
    if (board[row][i] === num || board[i][col] === num) return false;
  }

  let startRow = Math.floor(row / subH) * subH;
  let startCol = Math.floor(col / subW) * subW;

  for (let r = 0; r < subH; r++) {
    for (let c = 0; c < subW; c++) {
      if (board[startRow + r][startCol + c] === num) return false;
    }
  }
  return true;
};

// it will count how many solutions exist 
function countSolutions(board, size, subH, subW) {
    let count = 0;

    function solve(tempBoard) {
        for (let row = 0; row < size; row++) {
            for (let col = 0; col < size; col++) {
                if (tempBoard[row][col] === null) {
                    for (let num = 1; num <= size; num++) {
                        if (isValid(tempBoard, row, col, num, size, subH, subW)) {
                            tempBoard[row][col] = num;
                            solve(tempBoard);
                            tempBoard[row][col] = null;
                            if (count > 1) return;
                        }
                    }
                    return;
                }
            }
        }
        count++;
    }

    const temp = board.map(r => [...r]);
    solve(temp);
    return count;
}

// fills the board with random numbers (backtracking)
function fillBoardBacktracking(board, size, subH, subW) {
    for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
            if (board[row][col] === null) {
                const numbers = [...Array(size).keys()].map(n => n + 1).sort(() => Math.random() - 0.5);
                for (let num of numbers) {
                    if (isValid(board, row, col, num, size, subH, subW)) {
                        board[row][col] = num;
                        if (fillBoardBacktracking(board, size, subH, subW)) {
                            return true;
                        }
                        board[row][col] = null;
                    }
                }
                return false;
            }
        }
    }
    return true;
}

// removes a set of cells with making sure to keep one solution
function removeCells(board, countToRemove, size, subH, subW) {
  let removed = 0;
  while (removed < countToRemove) {
    let r = Math.floor(Math.random() * board.length);
    let c = Math.floor(Math.random() * board.length);
    if (board[r][c] !== null) {
        const backup = board[r][c];
        board[r][c] = null;

        const solutions = countSolutions(board, size, subH, subW);
        if (solutions !== 1) {
            board[r][c] = backup;
        } else {
            removed++;
        }
    }
  }
};

// generates the normal 9x9 sudoku board
const generateNormalBoard = () => {
    const size = 9, subH = 3, subW = 3;
    const cellsToKeep = 28 + Math.floor(Math.random() * 3);
    let board = createBoard(size);
    fillBoardBacktracking(board, size, subH, subW);
    removeCells(board, size * size - cellsToKeep);
    return board;
};

// generates 6x6 sudoku board
const generateEasyBoard = () => {
    const size = 6, subH = 2, subW = 3;
    const cellsToKeep = 18;
    let board = createBoard(size);
    fillBoardBacktracking(board, size, subH, subW);
    removeCells(board, size * size - cellsToKeep);
    return board;
};

export const SudokuContext = createContext();

// context for holding all the game logic
export const SudokuProvider = ({ children }) => {
    const [board, setBoard] = useState([]);
    const [originalBoard, setOriginalBoard] = useState([]);
    const [selectedCell, setSelectedCell] = useState(null);
    const [invalidCells, setInvalidCells] = useState([]);
    const [time, setTime] = useState(0);
    const [timerActive, setTimerActive] = useState(false);
    const [hintCell, setHintCell] = useState(null);

    // it will load saved game from localStorage when the app starts 
    useEffect(() => {
        const savedGame = localStorage.getItem("sudokuGame");
        if (savedGame) {
            const data = JSON.parse(savedGame);
            setBoard(data.board);
            setOriginalBoard(data.originalBoard);
            setTime(data.time);
            setTimerActive(data.timerActive);
        }
    }, []);

    // save game after any change
    useEffect(() => {
        if (board.length > 0) {
            const gameData = {
                board,
                originalBoard,
                time,
                timerActive
            };
            localStorage.setItem("sudokuGame", JSON.stringify(gameData));
        }
    }, [board, originalBoard, time, timerActive]);

    // timer 
    useEffect(() => {
        let interval = null;
        if (timerActive) {
            interval = setInterval(() => {
                setTime((prev) => prev + 1);
            }, 1000);
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [timerActive]);

    // to start a new game 
    const startNewGame = (mode = "normal") => {
        localStorage.removeItem("sudokuGame");
        let newBoard = mode === "normal" ? generateNormalBoard() : generateEasyBoard();
        setBoard(newBoard);
        setOriginalBoard(newBoard);
        setSelectedCell(null);
        setInvalidCells([]);
        setHintCell(null);
        setTime(0);
        setTimerActive(true);
    };

    // to reset a game
    const resetGame = () => {
        localStorage.removeItem("sudokuGame");
        setBoard(originalBoard);
        setSelectedCell(null);
        setInvalidCells([]);
        setTime(0);
        setTimerActive(true);
    };

    // get hint
    const getHint = () => {
        const size = board.length;
        const subH = size === 9 ? 3 : 2;
        const subW = size === 9 ? 3 : 3;

        const emptyCells = [];

        for (let r = 0; r < size; r++) {
            for (let c = 0; c < size; c++) {
                if (board[r][c] === "" || board[r][c] === null) {
                    const possible = [];
                    for (let n = 1; n <= size; n++) {
                        if (isValid(board, r, c, n, size, subH, subW)) {
                            possible.push(n);
                        }
                    }
                    if (possible.length === 1) {
                        emptyCells.push({ row: r, col: c, value: possible[0] });
                    }
                }
            }
        }

        if (emptyCells.length > 0) {
            const randomHint = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            setHintCell(randomHint);
        } else {
            alert("No more single-value hints available!");
        }
    };

    return (
        <SudokuContext.Provider
            value={{
                board,
                setBoard,
                originalBoard,
                setOriginalBoard,
                selectedCell,
                setSelectedCell,
                invalidCells,
                setInvalidCells,
                time,
                setTime,
                timerActive,
                setTimerActive,
                startNewGame,
                resetGame,
                hintCell,
                getHint,
                setHintCell
            }}
        >
            {children}
        </SudokuContext.Provider>
    )
}