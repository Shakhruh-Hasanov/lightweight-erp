package com.shakhruhhasanov.lightweighterp.customer;

public class CustomerNotFoundException extends RuntimeException {

    public CustomerNotFoundException(String customerNumber) {
        super("Customer with number " + customerNumber + " not found");
    }
}
