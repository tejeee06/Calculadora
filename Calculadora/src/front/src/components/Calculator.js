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
  const [operand2, setOperand2] = useState(null);
  const [operation, setOperation] = useState(null);
  const [currentInput, setCurrentInput] = useState('0');
  const [isSecondOperand, setIsSecondOperand] = useState(false);

  const handleButtonClick = (label) => {
    if (/[0-9]/.test(label)) {
      const newInput = currentInput === '0' ? label : currentInput + label;
      setCurrentInput(newInput);
      if (operation && operand1 !== null) {
        setIsSecondOperand(true);
        setOperand2(parseFloat(newInput));
        setDisplay(`${operand1} ${operation} ${newInput}`);
      } else {
        setDisplay(newInput);
      }
    } else if (label === '.') {
      if (!currentInput.includes('.')) {
        const newInput = currentInput + '.';
        setCurrentInput(newInput);
        if (operation && operand1 !== null) {
          setIsSecondOperand(true);
          setOperand2(parseFloat(newInput));
          setDisplay(`${operand1} ${operation} ${newInput}`);
        } else {
          setDisplay(newInput);
        }
      }
    } else if (label === 'C') {
      setDisplay('0');
      setExpression('');
      setCurrentInput('0');
      setOperand1(null);
      setOperand2(null);
      setOperation(null);
      setIsSecondOperand(false);
      // No reseteamos ans, para que siga disponible
    } else if (label === '⌫') {
      const newInput = currentInput.length === 1 || currentInput === '0' ? '0' : currentInput.slice(0, -1);
      setCurrentInput(newInput);
      if (operation && operand1 !== null) {
        if (newInput === '0') {
          setIsSecondOperand(false);
          setOperand2(null);
          setDisplay(`${operand1} ${operation}`);
        } else {
          setOperand2(parseFloat(newInput));
          setDisplay(`${operand1} ${operation} ${newInput}`);
        }
      } else {
        setDisplay(newInput);
      }
    } else if (label === 'ANS') {
      if (ans !== null) {
        // Mostrar siempre el resultado anterior
        setCurrentInput(ans.toString());
        if (operation && operand1 !== null) {
          // Si ya hay un operador, usamos ANS como operand2
          setOperand2(ans);
          setDisplay(`${operand1} ${operation} ${ans}`);
          setIsSecondOperand(true);
        } else {
          // Si no hay operador, ANS se convierte en operand1
          setOperand1(ans);
          setDisplay(ans.toString());
        }
        setExpression(ans.toString());
      }
    } else if (['+', '-', '×', '÷', '√', '^'].includes(label)) {
      setOperand1(parseFloat(currentInput));
      setOperation(label);
      setCurrentInput('0');
      setExpression(`${currentInput} ${label}`);
      setDisplay(`${currentInput} ${label}`);
      setIsSecondOperand(false);
    } else if (label === '=') {
      if (operand1 !== null && operation) {
        const finalOperand2 = operand2 !== null ? operand2 : parseFloat(currentInput);
        axios
          .post('http://localhost:8080/api/calculate', {
            operand1,
            operand2: operation === '√' ? 0 : finalOperand2,
            operation,
          })
          .then((response) => {
            const result = response.data;
            setDisplay(result.toString());
            setExpression(`${operand1} ${operation} ${finalOperand2} = ${result}`);
            setAns(result); // Actualizamos ans con el resultado
            setCurrentInput(result.toString());
            setOperand1(null);
            setOperand2(null);
            setOperation(null);
            setIsSecondOperand(false);
          })
          .catch((error) => {
            setDisplay('Error');
            setExpression(`${operand1} ${operation} ${finalOperand2} = Error`);
            setAns(null); // En caso de error, reseteamos ans
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