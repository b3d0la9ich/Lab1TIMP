import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import BaggageScanner from './pages/BaggageScanner';
import PersonScanner from './pages/PersonScanner';
import IncidentPage from './pages/IncidentPage'; 

function App() {
  return (
    <div style={{ padding: '1rem', fontFamily: 'Arial, sans-serif' }}>
      <Navbar />
      <Routes>
        <Route path="/baggage" element={<BaggageScanner />} />
        <Route path="/person" element={<PersonScanner />} />
        <Route path="/incidents" element={<IncidentPage />} /> 
      </Routes>
    </div>
  );
}

export default App;