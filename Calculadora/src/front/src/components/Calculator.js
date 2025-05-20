import React, { useState } from 'react';
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
        let result;
        switch (operation) {
          case '+': result = operand1 + operand2; break;
          case '-': result = operand1 - operand2; break;
          case 'x': result = operand1 * operand2; break;
          case '÷': result = operand1 / operand2; break;
          case '√': result = Math.sqrt(operand1); break;
          case '^': result = Math.pow(operand1, operand2); break;
          default: result = 0;
        }
        setDisplay(result.toString());
        setAns(result);
        setOperand1(null);
        setOperation(null);
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