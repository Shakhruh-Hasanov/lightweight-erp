package com.shakhruhhasanov.lightweighterp.order;

import org.springframework.stereotype.Service;

import com.shakhruhhasanov.lightweighterp.customer.CustomerService;
import com.shakhruhhasanov.lightweighterp.product.ProductService;

@Service
public class SalesOrderService {

    private final SalesOrderRepository salesOrderRepository;
    private final CustomerService customerService;

    private final ProductService productService;

    public SalesOrderService(SalesOrderRepository salesOrderRepository, CustomerService customerService, ProductService productService){
        this.salesOrderRepository = salesOrderRepository;
        this.customerService = customerService;
        this.productService = productService;

    }
    
    
}
