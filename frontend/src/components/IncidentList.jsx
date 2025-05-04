import { useEffect, useState } from 'react';
import axios from 'axios';

export default function IncidentList() {
  const [incidents, setIncidents] = useState([]);

  const loadData = async () => {
    try {
      const res = await axios.get('/api/incidents');
      setIncidents(res.data);
    } catch (err) {
      console.error('Ошибка загрузки инцидентов:', err);
    }
  };

  const resolveIncident = async (id) => {
    try {
      await axios.post(`/api/resolve/${id}`);
      loadData();
    } catch (err) {
      console.error('Ошибка при завершении инцидента:', err);
    }
  };

  const deleteIncident = async (id) => {
    try {
      await axios.delete(`/api/delete/${id}`);
      loadData();
    } catch (err) {
      console.error('Ошибка при удалении инцидента:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div>
      <h2>Журнал инцидентов</h2>
      {incidents.length === 0 ? (
        <p>Инцидентов пока нет.</p>
      ) : (
        <ul>
          {incidents.map((i) => (
            <li key={i.id}>
              <strong>[{i.type}]</strong> {i.description} —{' '}
              {i.resolved ? '✅ задержан!' : '❗ тревога'}{' '}
              {!i.resolved && (
                <>
                  <button onClick={() => resolveIncident(i.id)}>Задержать!</button>{' '}
                  <button onClick={() => deleteIncident(i.id)}>Удалить</button>
                </>
              )}
              {i.resolved && (
                <button onClick={() => deleteIncident(i.id)}>Удалить</button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
