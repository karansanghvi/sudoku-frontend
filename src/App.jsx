import React from 'react'
import Navbar from './components/Navbar'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home'
import GameSelection from './pages/GameSelection'
import EasyGame from './pages/EasyGame'
import NormalGame from './pages/NormalGame'
import RulesPage from './pages/RulesPage'
import ScoresPage from './pages/ScoresPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import Footer from './components/Footer';
import "./assets/styles/styles.css";
import GamePage from './pages/GamePage';

function App() {
  return (
    <>
      <div className='app-container'>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/games" element={<GameSelection />} />
            <Route path="/game/:gameId" element={<GamePage />} />
            <Route path="/games/easy" element={<EasyGame />} />
            <Route path="/games/normal" element={<NormalGame />} />
            <Route path="/rules" element={<RulesPage />} />
            <Route path="/scores" element={<ScoresPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes> 
          <Footer />
        </Router>
      </div>
    </>
  )
}

export default App
