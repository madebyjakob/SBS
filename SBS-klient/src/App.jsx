import React from 'react'
import './App.css'
import { HashRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Homepage from './pages/Homepage'
import Books from './pages/Books'
import Admin from './pages/Admin'

function App() {

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Hem" element={<Homepage />} />
        <Route path="/Böcker" element={<Books />} />
        <Route path="/Admin" element={<Admin />} />
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </HashRouter>
  )
}

export default App