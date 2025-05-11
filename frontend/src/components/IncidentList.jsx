import { useEffect, useState } from 'react';
import axios from 'axios';
import './IncidentList.css';

export default function IncidentList() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(false); //  Спиннер
  const [error, setError] = useState(''); //  Сообщения об ошибке
  const role = localStorage.getItem('role');
  const token = localStorage.getItem('token');

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      await new Promise(resolve => setTimeout(resolve, 2000)); //  тестовая задержка
  
      const res = await axios.get('http://localhost:5000/api/incidents');
      setIncidents(res.data);
    } catch (err) {
      const status = err.response?.status;
      console.error('Ошибка загрузки данных:', err);
      setError(`Ошибка загрузки данных (код ${status || 'неизвестен'})`);
    } finally {
      setLoading(false);
    }
  };
  

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/incidents/${id}`,
        { status: newStatus },
        {
          headers: { Authorization: token },
        }
      );
      loadData();
    } catch (err) {
      const status = err.response?.status;
      console.error('Ошибка при обновлении статуса:', err);
      setError(`Ошибка обновления статуса (код ${status || 'неизвестен'})`);
    }
  };

  const resolveIncident = async (id) => {
    try {
      await axios.post(
        `http://localhost:5000/api/resolve/${id}`,
        {},
        {
          headers: { Authorization: token },
        }
      );
      loadData();
    } catch (err) {
      const status = err.response?.status;
      console.error('Ошибка при задержании инцидента:', err);
      setError(`Ошибка при задержании (код ${status || 'неизвестен'})`);
    }
  };

  const deleteIncident = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/delete/${id}`, {
        headers: { Authorization: token },
      });
      loadData();
    } catch (err) {
      const status = err.response?.status;
      console.error('Ошибка при удалении инцидента:', err);
      setError(`Ошибка при удалении (код ${status || 'неизвестен'})`);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="incident-list">
      <h2>📋 Журнал инцидентов</h2>

      {/* Сообщение об ошибке */}
      {error && <div className="error-message">⚠ {error}</div>}

      {/* Спиннер загрузки */}
      {loading ? (
        <p>🔄 Загрузка инцидентов...</p>
      ) : incidents.length === 0 ? (
        <p>Инцидентов пока нет.</p>
      ) : (
        incidents.map((i) => (
          <div
            key={i.id}
            className={`incident-card ${
              i.status === 'отпущен'
                ? 'released'
                : i.resolved
                ? 'resolved'
                : 'unresolved'
            }`}
          >
            <div className="incident-description">
              <strong>[{i.type}]</strong> {i.description}
              <br />
              <strong>Статус:</strong> {i.status || 'новый'} —{' '}
              {i.status === 'отпущен' ? (
                <span className="status-released">🚪 Отпущен</span>
              ) : i.resolved ? (
                <span className="status-ok">✅ задержан!</span>
              ) : (
                <span className="status-alert">❗ тревога</span>
              )}
            </div>

            {role === 'admin' && (
              <div className="buttons">
                {(!i.status || i.status === 'новый') && (
                  <>
                    <button onClick={() => updateStatus(i.id, 'на проверке')}>🕵 На проверке</button>
                    <button className="delete" onClick={() => deleteIncident(i.id)}>
                      Удалить
                    </button>
                  </>
                )}

                {i.status === 'на проверке' && (
                  <>
                    <button onClick={() => updateStatus(i.id, 'подтверждён')}>✅ Подтверждён</button>
                    <button onClick={() => updateStatus(i.id, 'ложная тревога')}>⚠ Ложная тревога</button>
                  </>
                )}

                {i.status === 'подтверждён' && !i.resolved && (
                  <>
                    <button onClick={() => resolveIncident(i.id)}>Задержать!</button>
                    <button className="delete" onClick={() => deleteIncident(i.id)}>
                      Удалить
                    </button>
                  </>
                )}

                {i.status === 'ложная тревога' && (
                  <>
                    <button onClick={() => updateStatus(i.id, 'отпущен')}>🚪 Отпустить</button>
                    <button className="delete" onClick={() => deleteIncident(i.id)}>
                      Удалить
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
