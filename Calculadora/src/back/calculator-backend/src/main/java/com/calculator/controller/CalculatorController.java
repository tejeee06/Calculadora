package com.calculator.controller;

import com.calculator.model.Calculation;
import com.calculator.service.CalculatorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController // API REST QUE CONTROLA HTTP
@RequestMapping("/api")
public class CalculatorController {
    @Autowired
    private CalculatorService calculatorService;

    @PostMapping("/calculate")
    public ResponseEntity<?> calculate(@RequestBody Calculation calculation) {
        try {
            double result = calculatorService.calculate(calculation);
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}