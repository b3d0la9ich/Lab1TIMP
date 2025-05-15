import { Routes, Route, Navigate } from 'react-router-dom';
import React, { useContext } from 'react';
import HomePage from './pages/HomePage';
import Navbar from './components/Navbar';
import BaggageScanner from './pages/BaggageScanner';
import PersonScanner from './pages/PersonScanner';
import IncidentPage from './pages/IncidentPage'; 
import LoginForm from './components/LoginForm';
import { AuthContext } from './components/AuthContext';


function App() {
  const { role } = useContext(AuthContext);

  return (
    <div style={{ padding: '1rem', fontFamily: 'Arial, sans-serif' }}>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/baggage" element={<BaggageScanner />} />
        <Route path="/person" element={<PersonScanner />} />
        <Route path="/incidents" element={
          role === 'admin' ? <IncidentPage /> : <Navigate to="/baggage" />
        } />
        <Route path="/login" element={<LoginForm />} />
      </Routes>
    </div>
  );
}


export default App;