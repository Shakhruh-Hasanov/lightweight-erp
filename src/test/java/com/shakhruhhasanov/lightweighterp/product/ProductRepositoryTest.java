package com.shakhruhhasanov.lightweighterp.product;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.boot.jdbc.test.autoconfigure.AutoConfigureTestDatabase;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.math.BigDecimal;
import java.util.Optional;

@DataJpaTest 
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)

public class ProductRepositoryTest {

    private final ProductRepository productRepository;

    @Autowired 
    public ProductRepositoryTest(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Test 
    void shouldSaveAndFindProductBySku(){
        //arrange

        Product product = new Product(
        "BOX-100",
        "Medium Shipping Box",
        UnitOfMeasure.BOX,
        new BigDecimal("2.50"),
        new BigDecimal("4.99"));

        //act

        productRepository.save(product);

        Optional<Product> foundProduct = productRepository.findBySku("BOX-100");

        //assert

        Product saveProduct = foundProduct.orElseThrow();

        assertEquals("Medium Shipping Box", saveProduct.getName());
    }

    @Test 
    void shouldReturnTrueWhenSkuExists (){

        Product product = new Product(
        "TAPE-100",
        "Medium Shipping Tape",
        UnitOfMeasure.EACH,
        new BigDecimal("1.50"),
        new BigDecimal("3.99"));

        productRepository.save(product);

      
        boolean exists = productRepository.existsBySku("TAPE-100");

        assertTrue(exists);
    }

    
    
}
