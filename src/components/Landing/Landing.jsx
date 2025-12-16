import { useNavigate } from 'react-router';
import Footer from '../Footer/Footer';
import './Landing.css';


const Landing = () => {
  const navigate = useNavigate();
  
  return (
    <>
    <main className='home-container'>
      <section className='hero-section'>
        <h1>Build Together</h1>
        <p>A collaboration hub for developers, designers, and creatives to share ideas and find teammates.</p>
        <p>Post your project idea, specify the roles you need, and connect with makers who want to build with you.</p>
        
        <div className='hero-actions'>
          <button className='btn btn-primary' onClick={() => navigate('/register')}>
            Get Started
          </button>
          <button className='btn btn-secondary' onClick={() => navigate('/login')}>
            Sign In
          </button>
        </div>
      </section>
    </main>
    <Footer />
    </>
  );
};

export default Landing;