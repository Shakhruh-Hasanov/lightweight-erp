package com.shakhruhhasanov.lightweighterp.exception;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.shakhruhhasanov.lightweighterp.customer.CustomerNotFoundException;
import com.shakhruhhasanov.lightweighterp.order.InvalidOrderException;
import com.shakhruhhasanov.lightweighterp.product.DuplicateSkuException;
import com.shakhruhhasanov.lightweighterp.product.ProductNotFoundException;

@RestControllerAdvice 
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationErrors(MethodArgumentNotValidException exception) {
        
        Map<String, String> errors = new HashMap<>();

        exception.getBindingResult().getFieldErrors().forEach(error -> {
            errors.put(error.getField(), error.getDefaultMessage());
        });

        return  ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
    }

    @ExceptionHandler(ProductNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleProductNotFoundException(ProductNotFoundException exception){

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", exception.getMessage()));
    }


    @ExceptionHandler (DuplicateSkuException.class)
    public ResponseEntity<Map<String, String>> handleDuplicateSkuException(DuplicateSkuException exception){

        return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", exception.getMessage()));
    }

    @ExceptionHandler(CustomerNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleCustomerNotFoundException(CustomerNotFoundException exception){
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", exception.getMessage()));
    }

    @ExceptionHandler(InvalidOrderException.class)
    public ResponseEntity<Map<String, String>> handleInvalidOrderException(InvalidOrderException exception){
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", exception.getMessage()));
    }


    
}
