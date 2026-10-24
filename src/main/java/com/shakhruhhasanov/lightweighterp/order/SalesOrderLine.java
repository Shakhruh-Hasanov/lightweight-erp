package com.shakhruhhasanov.lightweighterp.order;

import java.math.BigDecimal;
import java.math.RoundingMode;

import com.shakhruhhasanov.lightweighterp.product.Product;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;

@Entity 
@Table(name = "sales_order_lines")
public class SalesOrderLine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private SalesOrder order;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @NotNull 
    @Positive
    @Column(precision = 12, scale = 3, nullable = false)
    private BigDecimal quantity; 

    @NotNull 
    @PositiveOrZero
    @Column(precision = 12, scale = 2, nullable = false)
    private BigDecimal unitPrice;

    @NotNull 
    @PositiveOrZero
    @Column(precision = 12, scale = 2, nullable = false)
    private BigDecimal lineTotal;


    protected SalesOrderLine(){}

    public SalesOrderLine(SalesOrder order, Product product, BigDecimal quantity){
        this.order = order;
        this.product = product;
        this.quantity = quantity;

        // price snapshot

        this.unitPrice = product.getSellingPrice();
        
        // calculated from the two values above

        this.lineTotal = quantity.multiply(this.unitPrice).setScale(2, RoundingMode.HALF_UP);
    }

 

    public Long getId() {
        return id;
    }

    public SalesOrder getOrder() {
        return order;
    }

    public Product getProduct() {
        return product;
    }

    public BigDecimal getQuantity() {
        return quantity;
    }

    public BigDecimal getUnitPrice() {
        return unitPrice;
    }

    public BigDecimal getLineTotal() {
        return lineTotal;
    }
    
    
}
