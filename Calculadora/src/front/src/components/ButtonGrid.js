import React from 'react';
import Button from './Button';
import './ButtonGrid.css';

const ButtonGrid = ({ onButtonClick }) => {
  const buttons = [
    { label: 'C', className: 'special' },
    { label: '⌫', className: 'special' },
    { label: '√', className: 'special' },
    { label: '^', className: 'special' }, // Botón de potencia
    { label: '÷', className: 'operator' },
    { label: '7', className: '' },
    { label: '8', className: '' },
    { label: '9', className: '' },
    { label: 'x', className: 'operator' },
    { label: '4', className: '' },
    { label: '5', className: '' },
    { label: '6', className: '' },
    { label: '-', className: 'operator' },
    { label: '1', className: '' },
    { label: '2', className: '' },
    { label: '3', className: '' },
    { label: '+', className: 'operator' },
    { label: 'ANS', className: 'special' },
    { label: '0', className: '' },
    { label: '.', className: '' },
    { label: '=', className: 'equals' },
    { label: '±', className: 'special' }, // Botón de cambio de signo
  ];

  return (
    <div className="button-grid">
      {buttons.map((btn, index) => (
        <Button
          key={index}
          label={btn.label}
          className={btn.className}
          onClick={() => onButtonClick(btn.label)}
        />
      ))}
    </div>
  );
};

export default ButtonGrid;