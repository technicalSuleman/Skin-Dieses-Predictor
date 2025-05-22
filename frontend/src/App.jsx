import { useState } from 'react'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import Login from './components/login/Login'
import Signup from './components/signup/Signup'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import UserInput from './components/home/UserInput'
import Result from './components/result/Result'
import History from './components/history/History'

function App() {
  

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/user-input" element={<UserInput />} />
        <Route path="/result" element={<Result />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
