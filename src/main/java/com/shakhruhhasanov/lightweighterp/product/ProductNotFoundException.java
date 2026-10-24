package com.shakhruhhasanov.lightweighterp.product;

public class ProductNotFoundException extends RuntimeException {

    public ProductNotFoundException(String sku) {
        super("Product with SKU " + sku + " not found");
    }
    
}
