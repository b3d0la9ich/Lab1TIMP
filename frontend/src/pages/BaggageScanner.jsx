import React, { useState } from 'react';
import axios from 'axios';

const allowedItems = ['одежда', 'книги', 'зубная щётка', 'наушники', 'ноутбук', 'бутылка воды', 'вилка', 'пауэрбанк', 'плед'];
const forbiddenItems = ['нож', 'пистолет', 'взрывчатка'];

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function getRandomBaggage() {
  const items = [...allowedItems];
  shuffle(items);

  let selected = items.slice(0, Math.floor(Math.random() * 4) + 2);

  if (Math.random() < 0.1) {
    const forbidden = forbiddenItems[Math.floor(Math.random() * forbiddenItems.length)];
    selected.splice(Math.floor(Math.random() * selected.length), 0, forbidden);
  }

  return selected.join(', ');
}

export default function BaggageScanner() {
  const [result, setResult] = useState('');
  const [baggage, setBaggage] = useState('');
  const [history, setHistory] = useState([]);

  const handleScan = async () => {
    const generated = getRandomBaggage();
    setBaggage(generated);
    try {
      const res = await axios.post('http://217.71.129.139:5496/api/scan_baggage', {
        contents: generated,
      });
      setResult(res.data.result);

      const newEntry = {
        contents: generated,
        result: res.data.result,
        timestamp: new Date().toLocaleTimeString(),
      };
      setHistory(prev => [newEntry, ...prev.slice(0, 4)]); // максимум 5
    } catch (err) {
      console.error(err);
      setResult('Ошибка при сканировании багажа');
    }
  };

  return (
    <div>
      <h2>Сканер багажа</h2>
      <button onClick={handleScan}>Сканировать</button>
      {result && <p><strong>Результат:</strong> {result}</p>}

      <h3>Последние сканирования</h3>
      <ul>
        {history.map((item, idx) => (
          <li key={idx}>
            [{item.timestamp}] <strong>{item.contents}</strong> → {item.result}
          </li>
        ))}
      </ul>
    </div>
  );
}
