package com.shakhruhhasanov.lightweighterp.product;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.NotBlank;

@Entity 
@Table(name = "products") 
public class Product {

    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank 
    @Column(nullable = false, unique = true, length = 50)
    private String sku;

    @NotBlank 
    @Column(nullable = false)
    private String name;

    @Column
    private String description;

    @NotNull 
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UnitOfMeasure unitOfMeasure;

    @NotNull 
    @PositiveOrZero 
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal costPrice;

    @NotNull 
    @PositiveOrZero 
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal sellingPrice;

    @Column
    private String color;

    @Column
    private String size;

    @Column(nullable = false)
    private boolean isActive = false;

    

    protected  Product() {
    }

    public Product(@NotBlank String sku, @NotBlank String name, @NotNull UnitOfMeasure unitOfMeasure,
            @NotNull @PositiveOrZero BigDecimal costPrice, @NotNull @PositiveOrZero BigDecimal sellingPrice) {
        this.sku = sku;
        this.name = name;
        this.unitOfMeasure = unitOfMeasure;
        this.costPrice = costPrice;
        this.sellingPrice = sellingPrice;
    }

    public Long getId() {
        return id;
    }

    public String getSku() {
        return sku;
    }

    public void setSku(String sku) {
        this.sku = sku;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public UnitOfMeasure getUnitOfMeasure() {
        return unitOfMeasure;
    }

    public void setUnitOfMeasure(UnitOfMeasure unitOfMeasure) {
        this.unitOfMeasure = unitOfMeasure;
    }

    public BigDecimal getCostPrice() {
        return costPrice;
    }

    public void setCostPrice(BigDecimal costPrice) {
        this.costPrice = costPrice;
    }

    public BigDecimal getSellingPrice() {
        return sellingPrice;
    }

    public void setSellingPrice(BigDecimal sellingPrice) {
        this.sellingPrice = sellingPrice;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public String getSize() {
        return size;
    }

    public void setSize(String size) {
        this.size = size;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean isActive) {
        this.isActive = isActive;
    }

    @Override
    public String toString() {
        return "Product [id=" + id + ", sku=" + sku + ", name=" + name + ", description=" + description
                + ", unitOfMeasure=" + unitOfMeasure + ", costPrice=" + costPrice + ", sellingPrice=" + sellingPrice
                + ", color=" + color + ", size=" + size + ", isActive=" + isActive + "]";
    }


}
