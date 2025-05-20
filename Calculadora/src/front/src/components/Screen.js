import React from 'react';
import './Screen.css';

const Screen = ({ display }) => {
  return (
    <div className="screen">
      <span className="display">{display}</span>
    </div>
  );
};

export default Screen;