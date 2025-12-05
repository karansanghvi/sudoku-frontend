import React from 'react';
import "../assets/styles/rulesStyle.css";

function RulesPage() {
  return (
    <div className='main-container'>
      <h1 className='title'>How To Play?</h1>

      <div className='content'>
        <h2>Objective:</h2>
        <p>Fill the grid so that every row, every column, and every subgrid (also called a “box” or “region”) contains all the numbers exactly once.</p>

        <br />

        <h2>Rules For Normal Sudoko:</h2>
        <ol type="1">
          <li>The grid has 9 rows and 9 columns (81 cells total).</li>
          <li>The grid is divided into 9 subgrids of 3×3 each.</li>
          <li>You must place the digits 1 to 9 in the empty cells.</li>
          <li>Each row must contain all numbers 1–9, without repetition.</li>
          <li>Each column must contain all numbers 1–9, without repetition.</li>
          <li>Each 3×3 subgrid must also contain all numbers 1–9, without repetition.</li>
          <li>Some cells are already filled (called “givens” or “clues”). You cannot change these.</li>
          <li>There is usually only one unique solution to the puzzle.</li>
        </ol>
        
        <br />

        <h2>Rules For Easy Sudoko:</h2>
        <ol type='1'>
          <li>The grid has 6 rows and 6 columns (36 cells total).</li>
          <li>The grid is divided into 6 subgrids of 2×3 each.</li>
          <li>You must place the digits 1 to 6 in the empty cells.</li>
          <li>Each row must contain all numbers 1–6, without repetition.</li>
          <li>Each column must contain all numbers 1–6, without repetition.</li>
          <li>Each 2×3 subgrid must also contain all numbers 1–6, without repetition.</li>
        </ol>
      </div>
    </div>
  )
}

export default RulesPage
