import React, { useState } from 'react';
import axios from 'axios';

export default function PersonScanner() {
  const [result, setResult] = useState('');
  const [scanning, setScanning] = useState(false);
  const [statusColor, setStatusColor] = useState('gray');

  const handleScan = async () => {
    setResult('');
    setStatusColor('gray');
    setScanning(true);

    setTimeout(async () => {
      try {
        const res = await axios.post('http://localhost:5000/api/scan_person');
        setResult(res.data.result);
        setStatusColor(res.data.incident ? 'red' : 'green');
      } catch (err) {
        console.error(err);
        setResult('Ошибка при сканировании');
        setStatusColor('black');
      }
      setScanning(false);
    }, 1500);
  };

  return (
    <div>
      <h2>Сканер человека</h2>
      <button onClick={handleScan} disabled={scanning}>
        {scanning ? 'Сканирую...' : 'Сканировать'}
      </button>

      <div style={{
        marginTop: '20px',
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        backgroundColor: statusColor,
        transition: 'background-color 0.5s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: 'bold'
      }}>
        {scanning ? '...' : result ? (statusColor === 'red' ? '🚨' : '✅') : ''}
      </div>

      {result && (
        <p style={{ marginTop: '10px' }}><strong>Результат:</strong> {result}</p>
      )}
    </div>
  );
}
