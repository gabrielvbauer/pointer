import React from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import {SignIn} from './pages/SignIn';
import {SignUp} from './pages/SignUp';
import {PasswordRedefinitionEmail} from './pages/PasswordRedefinition/Email';
import {PasswordRedefinition} from './pages/PasswordRedefinition/Redefinition';
import {Dashboard} from './pages/Dashboard';
import {MarkingsProvider} from 'hooks/useMarkings';
import {ToastContainer} from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <MarkingsProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Dashboard />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgotpassword" element={<PasswordRedefinitionEmail />} />
          <Route path="/newpassword" element={<PasswordRedefinition />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer autoClose={5000} theme='dark' />
    </MarkingsProvider>
  );
}

export default App;
