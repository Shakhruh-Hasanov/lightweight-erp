package com.shakhruhhasanov.lightweighterp.order;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import com.shakhruhhasanov.lightweighterp.customer.Customer;
import com.shakhruhhasanov.lightweighterp.product.Product;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

@Entity 
@Table(name = "sales_orders")
public class SalesOrder {

    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank 
    @Column(nullable = false, unique = true, length = 50)
    private String orderNumber;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name= "customer_id", nullable = false)
    private Customer customer;

    @Enumerated(EnumType.STRING)
    @NotNull
    @Column(nullable = false)
    private OrderStatus status = OrderStatus.DRAFT;

    @Column(nullable = false)
    @NotNull 
    private LocalDate orderDate = LocalDate.now();

    @NotNull 
    @PositiveOrZero 
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal totalAmount = BigDecimal.ZERO;
    
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SalesOrderLine> lines = new ArrayList<>();

    protected SalesOrder(){}

    public SalesOrder(String orderNumber, Customer customer){
        this.orderNumber = orderNumber;
        this.customer = customer;
    }

    public void addLine(Product product, BigDecimal quantity){
        SalesOrderLine line = new SalesOrderLine(this, product, quantity);

        lines.add(line);

        recalculateTotal();
    }

    private void recalculateTotal(){

        BigDecimal total = BigDecimal.ZERO;

        for(SalesOrderLine line : lines){
            total = total.add(line.getLineTotal());
        }
        this.totalAmount = total;
    }


    public Long getId() {
        return id;
    }

    public String getOrderNumber() {
        return orderNumber;
    }

    public Customer getCustomer() {
        return customer;
    }

    public OrderStatus getStatus() {
        return status;
    }

    public LocalDate getOrderDate() {
        return orderDate;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public List<SalesOrderLine> getLines() {
        return Collections.unmodifiableList(lines);
    }

    
    
    
}
