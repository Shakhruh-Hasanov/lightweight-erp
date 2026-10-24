package com.shakhruhhasanov.lightweighterp.customer;

import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import java.util.Optional;
import static org.mockito.Mockito.when;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;


@ExtendWith(MockitoExtension.class)
public class CustomerServiceTest {

    @Mock 
    private CustomerRepository customerRepository;

    private CustomerService customerService;

    private Customer customer;

    @BeforeEach
    void setUp(){
        this.customerService = new CustomerService(customerRepository);

         this.customer = new Customer(
            "CUST-0001",
            "John Adams",    
            CustomerType.INDIVIDUAL, 
            "john@gmail.com", 
            "555-555-5555"
        );
    }

    @Test 
    void shouldReturnCustomerWhenCustomerExists(){

        //arrange: Build the Customer and stub the repository to return it for "CUST-0001"

        /* Customer customer = new Customer(
            "CUST-0001",
            "John Adams",    
            CustomerType.INDIVIDUAL, 
            "john@gmail.com", 
            "555-555-5555"
        );
        */
        when(customerRepository.findByCustomerNumber("CUST-0001")).thenReturn(Optional.of(customer));

        // Act: ask the service for the customer by number
        Customer foundCustomer = customerService.getCustomerByNumber("CUST-0001");


        // Assert:  the returned customer has the expected number, and the repository was quiried once. Verify by default check the call exactly once.
        assertEquals("CUST-0001", foundCustomer.getCustomerNumber());

        verify(customerRepository).findByCustomerNumber("CUST-0001");

    }

    @Test 
    void shouldThrowCustomerNotFoundExceptionWhenNumberDoesNotExists(){

         //arrange: Build the Customer and stub the repository to return it for "CUST-0001"


         // Act + Assert: calling the service throws CustomerNotFoundException

         when(customerRepository.findByCustomerNumber("MISSING-0001")).thenReturn(Optional.empty());

         // Assert:  the repository was quiried once. Verify by default check the call exactly once.

         assertThrows(CustomerNotFoundException.class, () -> customerService.getCustomerByNumber("MISSING-0001"));

         verify(customerRepository).findByCustomerNumber("MISSING-0001");



    }



    
}
