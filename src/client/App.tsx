import React from 'react';
import { Navigate, Routes, Route } from 'react-router-dom';
import Display from './containers/Display';
import SignIn from './containers/SignIn';

function App() {
  return (
    <div id='mainApp' className='main'>
      {/* <SignIn /> */}
      <Display />
      {/* <Routes>
        <Route path="/Display/*" element={<Display />} />
        <Route path="/" element={<Setup />} />
        <Route
          path="/Display"
          element={<Navigate to="Display/Overview" />}
        />{' '}
        // removed exact from path
      </Routes> */}
    </div>
  );
}

export default App;
