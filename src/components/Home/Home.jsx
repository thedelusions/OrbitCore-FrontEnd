import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../contexts/UserContext';
import { useNavigate } from 'react-router';
import Footer from '../Footer/Footer';
import './Home.css';

const Home = () => {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

  return (
    <>
    <div className="home-container">
        <section className="hero-section">
        <h1>Welcome back, {user?.username}</h1>
        <p className="hero-subtitle">Ready to start building?</p>

        <div className='hero-actions'>
          <button className='btn btn-primary' onClick={() => navigate('/projects')}>Browse Projects</button>
          <button className='btn btn-secondary' onClick={() => navigate('/ideas/new')}>Post an Idea</button>
        </div>
        </section>
    </div>
        <Footer />
    </>
  );
};

export default Home;
