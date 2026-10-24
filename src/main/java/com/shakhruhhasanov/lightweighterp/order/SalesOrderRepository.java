package com.shakhruhhasanov.lightweighterp.order;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;


public interface SalesOrderRepository extends JpaRepository<SalesOrder, Long> {

    Optional<SalesOrder> findByOrderNumber(String orderNumber);

    boolean existsByOrderNumber(String orderNumber);
    
}
