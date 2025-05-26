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
  const [lastOperator, setLastOperator] = useState(null);
  const [lastOperand, setLastOperand] = useState(null);

  const evaluateExpression = async (currentExpression) => {
    let currentResult = null;
    let currentOperand = '';
    let currentOp = null;

    const tokens = currentExpression.filter(t => t !== '');

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];

      if (/^[0-9.]+$/.test(token) && !isNaN(parseFloat(token))) {
        currentOperand = token;
        if (currentOp && currentResult !== null) {
          const response = await axios.post('http://localhost:8080/api/calculate', {
            operand1: currentResult,
            operand2: parseFloat(currentOperand),
            operation: currentOp,
          });
          currentResult = response.data;
          currentOperand = '';
          currentOp = null;
        } else if (currentResult === null) {
          currentResult = parseFloat(currentOperand);
          currentOperand = '';
        }
      } else if (['+', '-', 'x', '÷', '^'].includes(token)) {
        if (currentOperand !== '') {
          currentResult = parseFloat(currentOperand);
          currentOperand = '';
        }
        currentOp = token;
      } else if (token === '√') {
        if (i + 1 < tokens.length && /^[0-9.]+$/.test(tokens[i + 1]) && !isNaN(parseFloat(tokens[i + 1]))) {
          const operand = parseFloat(tokens[i + 1]);
          const response = await axios.post('http://localhost:8080/api/calculate', {
            operand1: operand,
            operand2: 0,
            operation: '√',
          });
          currentResult = response.data;
          i++;
          currentOperand = '';
        }
      }
    }

    if (currentOperand !== '' && !isNaN(parseFloat(currentOperand))) {
      if (currentResult === null) {
        currentResult = parseFloat(currentOperand);
      } else if (currentOp) {
        const response = await axios.post('http://localhost:8080/api/calculate', {
          operand1: currentResult,
          operand2: parseFloat(currentOperand),
          operation: currentOp,
        });
        currentResult = response.data;
      }
    }

    return currentResult;
  };

  const handleButtonClick = async (label) => {
    if (/[0-9]/.test(label)) {
      const newInput = currentInput === '0' ? label : currentInput + label;
      setCurrentInput(newInput);
      setDisplay([...expression, newInput].join(' '));
    } else if (label === '.') {
      if (!currentInput.includes('.') && currentInput !== '') {
        const newInput = currentInput + '.';
        setCurrentInput(newInput);
        setDisplay([...expression, newInput].join(' '));
      }
    } else if (label === 'C') {
      setDisplay('0');
      setExpression([]);
      setCurrentInput('0');
      setPendingOperation(null);
      setResult(null);
      setAns(null);
      setLastOperator(null);
      setLastOperand(null);
    } else if (label === '⌫') {
      if (currentInput.length === 1 || currentInput === '0') {
        setCurrentInput('0');
        setExpression([]);
        setDisplay('0');
      } else {
        const newInput = currentInput.slice(0, -1);
        setCurrentInput(newInput);
        setDisplay([...expression, newInput].join(' '));
      }
    } else if (label === 'ANS') {
      if (ans !== null) {
        setCurrentInput(ans.toString());
        setExpression([...expression, ans.toString()]);
        setDisplay([...expression, ans.toString()].join(' '));
      }
    } else if (['+', '-', 'x', '÷', '^'].includes(label)) {
      if (currentInput !== '' && !isNaN(parseFloat(currentInput))) {
        const newExpression = [...expression, currentInput, label];
        setExpression(newExpression);
        setDisplay(newExpression.join(' '));
        setCurrentInput('0');
        setPendingOperation(label);
        setLastOperator(label);
        setLastOperand(currentInput);
      }
    } else if (label === '√') {
      const newExpression = expression.length === 0 || ['+', '-', 'x', '÷', '^', '√'].includes(expression[expression.length - 1])
        ? [...expression, '√']
        : [...expression, currentInput, '√'];
      setExpression(newExpression);
      setDisplay(newExpression.join(' '));
      setCurrentInput('0');
      setPendingOperation(label);
      if (currentInput !== '0') {
        setLastOperand(currentInput);
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
          setCurrentInput(newValue);
          setDisplay([...expression, newValue].join(' '));
          if (expression.length > 0 && !['+', '-', 'x', '÷', '^', '√'].includes(expression[expression.length - 1])) {
            setExpression([...expression.slice(0, -1), newValue]);
          } else {
            setExpression([...expression, newValue]);
          }
        } catch (error) {
          setDisplay('Error');
          console.error('Error en ±:', error);
        }
      }
    } else if (label === '=') {
      if (currentInput !== '' && !isNaN(parseFloat(currentInput)) && pendingOperation) {
        try {
          const expressionToEvaluate = [...expression, currentInput];
          setLastExpression(expressionToEvaluate);
          setLastOperand(currentInput);
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
          console.error('Error en cálculo:', error);
        }
      } else if (result !== null && lastOperator && lastOperand) {
        try {
          const newExpression = [result.toString(), lastOperator, lastOperand];
          const finalResult = await evaluateExpression(newExpression);
          setHistory([...history, { expression: newExpression.join(' '), result: finalResult }]);
          setDisplay(finalResult.toString());
          setExpression([finalResult.toString()]);
          setAns(finalResult);
          setResult(finalResult);
          setCurrentInput(finalResult.toString());
        } catch (error) {
          setDisplay('Error');
          setExpression([]);
          setCurrentInput('0');
          setPendingOperation(null);
          setResult(null);
          console.error('Error en cálculo repetido:', error);
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