import React from 'react';
import { Navigate, Routes, Route } from 'react-router-dom';
import Display from './containers/Display';
import SignIn from './containers/SignIn';
import SignUp from './containers/SignUp';

function App() {
  return (
    <div id='mainApp'>
      <Routes>
        <Route path='/dashboard' element={<Display />} />
        <Route path='/signin' element={<SignIn />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/' element={<SignIn />} />
      </Routes>
    </div>
  );
}

export default App;
