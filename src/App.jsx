// src/App.jsx

import { Routes, Route } from 'react-router';
import { useContext } from "react";
import { UserContext } from "./contexts/UserContext";

import NavBar from './components/NavBar/NavBar';
import RegisterForm from './components/Register/Register';
import Login from './components/Login/LoginForm';
import Landing from './components/Landing/Landing';
import Home from './components/Home/Home';



const App = () => {
  
  const { user } = useContext(UserContext);

  return (
    <>
      <NavBar />

      <Routes>
        {user ? (
          <>
            <Route path="/" element={<Home />} />
          </>
        ) : (
          <>
            <Route path="/" element={<Landing />} />
          </>
        )}

        <Route path="/register" element={<RegisterForm />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
};

export default App;

