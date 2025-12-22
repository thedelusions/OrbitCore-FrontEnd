// src/App.jsx

import { Routes, Route } from 'react-router';
import { useContext } from "react";
import { UserContext } from "./contexts/UserContext";

import NavBar from './components/NavBar/NavBar';
import RegisterForm from './components/Register/Register';
import Login from './components/Login/LoginForm';
import Landing from './components/Landing/Landing';
import Home from './components/Home/Home';
import Projects from './components/Projects/Projects';
import ProjectDetail from './components/ProjectDetail/ProjectDetail';
import CreateProject from './components/CreateProject/CreateProject';
import EditProject from './components/EditProject/EditProject';
import ProjectRequests from './components/ProjectRequests/ProjectRequests';
import MyRequests from './components/MyRequests/MyRequests';
import Team from './components/Team/Team'


const App = () => {
  
  const { user } = useContext(UserContext);

  return (
    <>
      <NavBar />

      <main className="main-content">
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
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/new" element={<CreateProject />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/projects/:id/edit" element={<EditProject />} />
          <Route path="/projects/:id/requests" element={<ProjectRequests />} />
          <Route path="/my/requests" element={<MyRequests />} />
          <Route path="/projects/:id/team" element={<Team />} />
        </Routes>
      </main>
    </>
  );
};

export default App;

