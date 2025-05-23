import React, { useState } from 'react';
import axios from 'axios';
import Screen from './Screen';
import ButtonGrid from './ButtonGrid';
import './Calculator.css';

const Calculator = () => {
  const [display, setDisplay] = useState('0'); 
  const [expression, setExpression] = useState(''); 
  const [ans, setAns] = useState(null);
  const [operand1, setOperand1] = useState(null);
  const [operation, setOperation] = useState(null);
  const [currentInput, setCurrentInput] = useState('0'); 

  const handleButtonClick = (label) => {
    if (/[0-9]/.test(label)) {
      setCurrentInput((prev) => (prev === '0' ? label : prev + label));
      setDisplay((prev) => {
        if (operation && operand1 !== null) {
          return `${operand1} ${operation} ${currentInput === '0' ? label : currentInput + label}`;
        }
        return currentInput === '0' ? label : currentInput + label;
      });
    } else if (label === '.') {
      if (!currentInput.includes('.')) {
        setCurrentInput((prev) => prev + '.');
        setDisplay((prev) => {
          if (operation && operand1 !== null) {
            return `${operand1} ${operation} ${currentInput + '.'}`;
          }
          return currentInput + '.';
        });
      }
    } else if (label === 'C') {
      setDisplay('0');
      setExpression('');
      setCurrentInput('0');
      setOperand1(null);
      setOperation(null);
      setAns(null);
    } else if (label === '⌫') {
      setCurrentInput((prev) => {
        if (prev.length === 1 || prev === '0') return '0';
        return prev.slice(0, -1);
      });
      setDisplay((prev) => {
        if (operation && operand1 !== null) {
          const newInput = currentInput.length === 1 || currentInput === '0' ? '0' : currentInput.slice(0, -1);
          return `${operand1} ${operation} ${newInput}`;
        }
        return currentInput.length === 1 || currentInput === '0' ? '0' : currentInput.slice(0, -1);
      });
    } else if (label === 'ANS') {
      if (ans !== null) {
        setCurrentInput(ans.toString());
        setDisplay(ans.toString());
        setExpression(ans.toString());
      }
    } else if (['+', '-', 'x', '÷', '√', '^'].includes(label)) {
      setOperand1(parseFloat(currentInput));
      setOperation(label);
      setCurrentInput('0');
      setExpression(`${currentInput} ${label}`);
      setDisplay(`${currentInput} ${label} 0`);
    } else if (label === '=') {
      if (operand1 !== null && operation) {
        const operand2 = parseFloat(currentInput);
        axios
          .post('http://localhost:8080/api/calculate', {
            operand1,
            operand2: operation === '√' ? 0 : operand2,
            operation,
          })
          .then((response) => {
            const result = response.data;
            setDisplay(result.toString());
            setExpression(`${operand1} ${operation} ${operand2} = ${result}`);
            setAns(result);
            setCurrentInput(result.toString());
            setOperand1(null);
            setOperation(null);
          })
          .catch((error) => {
            setDisplay('Error');
            setExpression(`${operand1} ${operation} ${operand2} = Error`);
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