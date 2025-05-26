import React from 'react';
import './History.css';

const History = ({ history, clearHistory }) => {
  return (
    <div className="history">
      <h3>Historial</h3>
      {history.length === 0 ? (
        <p>No hay operaciones en el historial.</p>
      ) : (
        <ul>
          {history.map((item, index) => (
            <li key={index}>
              {item.expression} = {item.result}
            </li>
          ))}
        </ul>
      )}
      <button className="history-button clear" onClick={clearHistory}>
        Borrar Historial
      </button>
    </div>
  );
};

export default History;