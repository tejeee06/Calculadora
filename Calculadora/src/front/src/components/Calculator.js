import React, { useState } from 'react';
import axios from 'axios';
import Screen from './Screen';
import ButtonGrid from './ButtonGrid';
import './Calculator.css';

const Calculator = () => {
  const [display, setDisplay] = useState('0');
  const [ans, setAns] = useState(null);
  const [operand1, setOperand1] = useState(null);
  const [operation, setOperation] = useState(null);

  const handleButtonClick = (label) => {
    if (/[0-9]/.test(label)) {
      setDisplay((prev) => (prev === '0' ? label : prev + label));
    } else if (label === '.') {
      if (!display.includes('.')) {
        setDisplay((prev) => prev + '.');
      }
    } else if (label === 'C') {
      setDisplay('0');
      setOperand1(null);
      setOperation(null);
    } else if (label === '⌫') {
      setDisplay((prev) => {
        if (prev.length === 1 || prev === '0') return '0';
        return prev.slice(0, -1);
      });
    } else if (label === 'ANS') {
      if (ans !== null) {
        setDisplay(ans.toString());
      }
    } else if (['+', '-', 'x', '÷', '√', '^'].includes(label)) {
      setOperand1(parseFloat(display));
      setOperation(label);
      setDisplay('0');
    } else if (label === '=') {
      if (operand1 !== null && operation) {
        const operand2 = parseFloat(display);
        axios
          .post('http://localhost:8080/api/calculate', {
            operand1,
            operand2: operation === '√' ? 0 : operand2,
            operation,
          })
          .then((response) => {
            const result = response.data;
            setDisplay(result.toString());
            setAns(result);
            setOperand1(null);
            setOperation(null);
          })
          .catch((error) => {
            setDisplay('Error');
            console.error(error);
          });
      }
    }
  };

  return (
    <div className="calculator">
      <Screen display={display} />
      <ButtonGrid onButtonClick={handleButtonClick} />
    </div>
  );
};

export default Calculator;