import { useState } from 'react'
import './App.css'
import {Route, Routes} from 'react-router-dom'
import Landing from './Landing.jsx'
import Comics_list from './Comics_list.jsx'
import Comic from './Comic.jsx'
import Collections from './Collections.jsx'
// Joshua Meharg, I pledge my honor I have abided by the Stevens honor system


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
        <Routes>
          <Route path="/" element={<Landing/>} />
          <Route path="/marvel-comics/page/:pagenum" element={<Comics_list/>} />
          <Route path="/marvel-comics/:id" element={<Comic/>} />
          <Route path="/marvel-comics/collections" element={<Collections/>} />
        </Routes>
    </>
  )
}

export default App
