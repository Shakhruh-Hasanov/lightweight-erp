package com.shakhruhhasanov.lightweighterp.order;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.math.BigDecimal;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.shakhruhhasanov.lightweighterp.customer.Customer;
import com.shakhruhhasanov.lightweighterp.customer.CustomerType;
import com.shakhruhhasanov.lightweighterp.product.Product;
import com.shakhruhhasanov.lightweighterp.product.UnitOfMeasure;

public class SalesOrderTest {

    private Customer customer;

    private Product tape;

    @BeforeEach 
    void setUp(){
        customer = new Customer(
        "CUST-0001",
        "John Adams",
        CustomerType.INDIVIDUAL,
        "john@gmail.com",
        "555-555-5555"
        );

        tape = new Product(
            "TAPE-100",
            "Medium Shipping Tape",
            UnitOfMeasure.EACH,
            new BigDecimal("1.50"),   // cost price
            new BigDecimal("3.99")    // selling price

        );
    }

    @Test 
    void newOrderShouldStartAsDraftWithZeroTotal(){
        //Arrange + Act: create the brand new order
        SalesOrder order = new SalesOrder("SO-0001", customer);

        //Assert: it starts empty, as DRAFT, with $0 total.
        assertEquals(OrderStatus.DRAFT, order.getStatus());
        assertEquals(0, BigDecimal.ZERO.compareTo(order.getTotalAmount()));
        assertTrue(order.getLines().isEmpty());


    }

    @Test 
    void addLineShouldCopyProductPriceAndCalculateLineTotal(){
        //Arrange: create an order
        SalesOrder order = new SalesOrder("SO-0001", customer);

        //Act: add 5 tape
        order.addLine(tape, new BigDecimal("5"));

        //Assert: 
        //   1. get the first line → order.getLines().get(0)
        //   2. its unit price should be 3.99
        //   3. its line total should be 19.95   (5 × 3.99)

        SalesOrderLine line = order.getLines().get(0);

        assertEquals(0, new BigDecimal("3.99").compareTo(line.getUnitPrice()));
        assertEquals(0, new BigDecimal("19.95").compareTo(line.getLineTotal()));



    }

    @Test 
    void addingTwoLinesShouldSumTheTotal(){
        //arrange: setting up the second product and order

        SalesOrder order = new SalesOrder("SO-0001", customer);

        Product box = new Product(
            "BX-100", 
            "Medium shiiping box",
            UnitOfMeasure.BOX, 
            new BigDecimal("2.50"), 
            new BigDecimal("4.99") );
        
            //act: adding 5 tapes and 10 box 
        order.addLine(tape, new BigDecimal("5"));
        order.addLine(box, new BigDecimal("10"));

        assertEquals(2, order.getLines().size());
        assertEquals(0, new BigDecimal("69.85").compareTo(order.getTotalAmount()));


    }

    @Test 
    void lineShouldKeepOldPriceWhenProductPriceChanges(){

        // Arrange: an order with one line of tape at 3.99
        // Act: the store raises the tape price
        // Assert: the existing line still has the old price

        SalesOrder order = new SalesOrder("SO-0001", customer);

        order.addLine(tape, new BigDecimal("5"));

        tape.setSellingPrice(new BigDecimal("9.99"));

        SalesOrderLine line = order.getLines().get(0);
        
        assertEquals(0, new BigDecimal("3.99").compareTo(line.getUnitPrice()));
    }

    @Test 
    void getLinesShouldNotAllowDirectChanges(){
        //Arrange: an order with one line 

        SalesOrder order = new SalesOrder("SO-0001", customer);

        order.addLine((tape), new BigDecimal("5"));

        //Act and Assert: changing the list from outside is blocked

        assertThrows(UnsupportedOperationException.class, () -> order.getLines().clear());
    }
    
}
