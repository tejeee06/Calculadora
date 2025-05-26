import React, { useState } from 'react';
import axios from 'axios';
import Screen from './Screen';
import ButtonGrid from './ButtonGrid';
import History from './History';
import './Calculator.css';

const Calculator = () => {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState([]);
  const [ans, setAns] = useState(null);
  const [currentInput, setCurrentInput] = useState('0');
  const [pendingOperation, setPendingOperation] = useState(null);
  const [result, setResult] = useState(null);
  const [lastExpression, setLastExpression] = useState([]);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const evaluateExpression = async (currentExpression) => {
    let currentResult = result || 0;
    let currentOperand = '';
    let currentOp = null;

    const tokens = currentExpression.join('').split(' ').filter(t => t !== '');

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];

      if (/^[0-9.]+$/.test(token) && !isNaN(parseFloat(token))) {
        currentOperand = token;
      } else if (['+', '-', 'x', '÷', '^'].includes(token)) {
        if (currentOperand !== '' && !isNaN(parseFloat(currentOperand))) {
          if (currentResult === null) {
            currentResult = parseFloat(currentOperand);
          } else {
            const response = await axios.post('http://localhost:8080/api/calculate', {
              operand1: currentResult,
              operand2: parseFloat(currentOperand),
              operation: currentOp || '+',
            });
            currentResult = response.data;
          }
          currentOperand = '';
          currentOp = token;
        }
      } else if (token === '√') {
        if (i + 1 < tokens.length && /^[0-9.]+$/.test(tokens[i + 1]) && !isNaN(parseFloat(tokens[i + 1]))) {
          const operand = parseFloat(tokens[i + 1]);
          const response = await axios.post('http://localhost:8080/api/calculate', {
            operand1: operand,
            operand2: 0,
            operation: '√',
          });
          currentResult = response.data;
          i++; // Saltar el siguiente operando
          currentOperand = '';
        }
      }
    }

    if (currentOperand !== '' && currentOp && !isNaN(parseFloat(currentOperand))) {
      const response = await axios.post('http://localhost:8080/api/calculate', {
        operand1: currentResult,
        operand2: parseFloat(currentOperand),
        operation: currentOp,
      });
      currentResult = response.data;
    }

    return currentResult;
  };

  const handleButtonClick = async (label) => {
    if (/[0-9]/.test(label)) {
      const newInput = currentInput === '0' ? label : currentInput + label;
      setCurrentInput(newInput);
      setExpression([...expression, label]);
      setDisplay([...expression, label].join(' '));
    } else if (label === '.') {
      if (!currentInput.includes('.') && currentInput !== '') {
        const newInput = currentInput + '.';
        setCurrentInput(newInput);
        setExpression([...expression, '.']);
        setDisplay([...expression, '.'].join(' '));
      }
    } else if (label === 'C') {
      setDisplay('0');
      setExpression([]);
      setCurrentInput('0');
      setPendingOperation(null);
      setResult(null);
      setAns(null);
    } else if (label === '⌫') {
      if (currentInput.length === 1 || currentInput === '0') {
        setCurrentInput('0');
        setExpression([]);
        setDisplay('0');
      } else {
        const newInput = currentInput.slice(0, -1);
        setCurrentInput(newInput);
        const newExpression = expression.slice(0, -1);
        setExpression(newExpression);
        setDisplay(newExpression.join(' ') || '0');
      }
    } else if (label === 'ANS') {
      if (ans !== null) {
        setCurrentInput(ans.toString());
        setExpression([...expression, ans.toString()]);
        setDisplay([...expression, ans.toString()].join(' '));
      }
    } else if (['+', '-', 'x', '÷', '^', '√'].includes(label)) {
      if (label === '√') {
        setExpression([...expression, label, ' ']);
        setDisplay([...expression, label, ' '].join(' '));
        setCurrentInput('0');
      } else {
        setExpression([...expression, ' ', label, ' ']);
        setDisplay([...expression, ' ', label, ' '].join(' '));
        setCurrentInput('0');
        setPendingOperation(label);
      }
    } else if (label === '±') {
      if (currentInput !== '' && !isNaN(parseFloat(currentInput))) {
        try {
          const response = await axios.post('http://localhost:8080/api/calculate', {
            operand1: parseFloat(currentInput),
            operand2: 0,
            operation: '±',
          });
          const newValue = response.data.toString();
          // Reemplazar solo el número actual en la expresión
          const newExpression = [...expression.slice(0, -currentInput.length), ...newValue.split('')];
          setCurrentInput(newValue);
          setExpression(newExpression);
          setDisplay(newExpression.join(' '));
        } catch (error) {
          setDisplay('Error');
          console.error(error);
        }
      }
    } else if (label === '=') {
      if (display === '0' && lastExpression.length > 0) {
        setDisplay(lastExpression.join(' '));
        setExpression([...lastExpression]);
        setCurrentInput(lastExpression[lastExpression.length - 1]);
      } else {
        try {
          const expressionToEvaluate = [...expression, ' ', currentInput];
          setLastExpression(expressionToEvaluate);
          const finalResult = await evaluateExpression(expressionToEvaluate);
          setHistory([...history, { expression: expressionToEvaluate.join(' '), result: finalResult }]);
          setDisplay(finalResult.toString());
          setExpression([finalResult.toString()]);
          setAns(finalResult);
          setResult(finalResult);
          setCurrentInput(finalResult.toString());
          setPendingOperation(null);
        } catch (error) {
          setDisplay('Error');
          setExpression([]);
          setCurrentInput('0');
          setPendingOperation(null);
          setResult(null);
          console.error(error);
        }
      }
    }
  };

  return (
    <div className="calculator">
      <Screen display={display} />
      <ButtonGrid onButtonClick={handleButtonClick} />
      <div className="history-controls">
        <button
          className="history-button"
          onClick={() => setShowHistory(!showHistory)}
        >
          {showHistory ? 'Ocultar Historial' : 'Mostrar Historial'}
        </button>
        <button className="history-button clear" onClick={() => setHistory([])}>
          Borrar Historial
        </button>
      </div>
      {showHistory && <History history={history} clearHistory={() => setHistory([])} />}
    </div>
  );
};

export default Calculator;