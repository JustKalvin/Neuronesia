import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './style/style.css'
import { Routes, Route } from "react-router-dom";
import Landing from './components/Landing'
import Home from './pages/Home';
import Login from './pages/login';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  )
}

export default App
