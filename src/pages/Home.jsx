import React from 'react';
import "../assets/styles/styles.css";
import homeImage from "../assets/images/sudoko_logo.png";
import { Link } from 'react-router-dom';

function Home() {
  return (
    <>
      <div>
        <h1 className='welcome-text'>Welcome To The Game Of Sudoko!!</h1>
        <div className='home-container'>
            <div>
                <img src={homeImage} alt='Sudoko' />
            </div>
            <div>
                <div className="choose-puzzle">
                    <div className="btn-container">
                        <Link to="/games" className='btn-primary'>Select A Game</Link>
                        <br />
                        <Link to="/rules" className='btn-primary'>How To Play</Link>
                        <br />
                        <Link to="/scores" className='btn-primary'>View Scores</Link>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </>
  );
}

export default Home;
