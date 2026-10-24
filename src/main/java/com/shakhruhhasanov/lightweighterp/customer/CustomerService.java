package com.shakhruhhasanov.lightweighterp.customer;

import org.springframework.stereotype.Service;

@Service 
public class CustomerService {
    private final CustomerRepository customerRepository;

    public CustomerService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    public Customer getCustomerByNumber(String customerNumber){
        return customerRepository.findByCustomerNumber(customerNumber)
            .orElseThrow(() -> new CustomerNotFoundException(customerNumber));
    }
    
}
