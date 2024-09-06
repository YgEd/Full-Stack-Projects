import React from 'react';
import { useState } from 'react'
import {Route, Routes} from 'react-router-dom';
import './App.css'
import Landing from './Landing'
import Collection from './Collection'
import Collection_Spec from './Collection_Spec'
import NotFound from './NotFound'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='App'>
      <Routes>
        <Route path='/' element={<Landing />} />
        <Route path='/collection/page/:page' element={<Collection />} />
        <Route path='/collection/:id' element={<Collection_Spec />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default App;
