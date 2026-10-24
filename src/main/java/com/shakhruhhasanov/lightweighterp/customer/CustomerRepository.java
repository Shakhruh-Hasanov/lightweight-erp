package com.shakhruhhasanov.lightweighterp.customer;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;


public interface CustomerRepository extends JpaRepository<Customer, Long> {

    
    Optional<Customer> findByCustomerNumber(String customerNumber);

    
    boolean existsByCustomerNumber(String customerNumber);

}
