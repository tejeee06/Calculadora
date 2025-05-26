package com.calculator.service;

import com.calculator.model.Calculation;
import org.springframework.stereotype.Service;

@Service
public class CalculatorService {
    public double calculate(Calculation calculation) {
        String operation = calculation.getOperation();
        double operand1 = calculation.getOperand1();
        double operand2 = calculation.getOperand2();

        switch (operation) {
            case "+": return operand1 + operand2;
            case "-": return operand1 - operand2;
            case "x": return operand1 * operand2;
            case "÷":
                if (operand2 == 0) throw new IllegalArgumentException("Division by zero");
                return operand1 / operand2;
            case "^": return Math.pow(operand1, operand2);
            case "√":
                if (operand1 < 0) throw new IllegalArgumentException("Square root of negative number");
                return Math.sqrt(operand1);
            case "±": return -operand1; // Cambiar signo
            default: throw new IllegalArgumentException("Invalid operation: " + operation);
        }
    }
}