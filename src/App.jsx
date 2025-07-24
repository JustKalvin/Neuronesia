import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './style/style.css'
import { Routes, Route } from "react-router-dom";
import Landing from './components/Landing'
<<<<<<< Updated upstream
import Home from './pages/Home';
import Login from './pages/login';
=======
import Chatbot from './pages/Chatbot';
>>>>>>> Stashed changes

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
<<<<<<< Updated upstream
      <Route path="/login" element={<Login />} />
=======
      <Route path="/chatbot" element={<Chatbot/>} />
>>>>>>> Stashed changes
    </Routes>
  )
}

export default App
