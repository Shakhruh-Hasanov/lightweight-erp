package com.shakhruhhasanov.lightweighterp.product;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;


import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

@ExtendWith(MockitoExtension.class)
public class ProductServiceTest {

    @Mock 
    private ProductRepository productRepository;

    private ProductService productService;

    @BeforeEach 
    void setUp(){
        this.productService = new ProductService(productRepository);
    }

    @Test 
    void shouldCreateProductWhenSkuDoesNotExist(){
        //arrange: Create the product 
        Product product = new Product(
        "TAPE-100",
        "Medium Shipping Tape",
        UnitOfMeasure.EACH,
        new BigDecimal("1.50"),
        new BigDecimal("3.99"));

        when(productRepository.existsBySku(product.getSku())).thenReturn(false);
        when(productRepository.save(product)).thenReturn(product);

        // act
        Product savedProduct = productService.createProduct(product);


       

        //assert

        assertEquals("TAPE-100", savedProduct.getSku());

        verify(productRepository).existsBySku(product.getSku());
        verify(productRepository).save(product);

    }

    @Test 
    void shouldThrowExceptionWhenSkuAlreadyExists(){

        //arrange: create the product

        Product product = new Product(
        "TAPE-100",
        "Medium Shipping Tape",
        UnitOfMeasure.EACH,
        new BigDecimal("1.50"),
        new BigDecimal("3.99")
    );

        when(productRepository.existsBySku(product.getSku())).thenReturn(true);


        //act :
        assertThrows(DuplicateSkuException.class,() -> productService.createProduct(product) );

        // assert: 
        verify(productRepository, never()).save(product);

    }

    @Test
    void shouldReturnProductWhenSkuExists(){

        //arrange: create the product

        Product product = new Product(
        "TAPE-100",
        "Medium Shipping Tape",
        UnitOfMeasure.EACH,
        new BigDecimal("1.50"),
        new BigDecimal("3.99")
    );

        when(productRepository.findBySku("TAPE-100"))
        .thenReturn(Optional.of(product));

        Product foundProduct = productService.getProductBySku("TAPE-100");

        assertEquals("TAPE-100", foundProduct.getSku());

        verify(productRepository).findBySku("TAPE-100");

    

    }

    @Test 
    void shouldReturnNotFoundExceptionWhenSkuDoesNotExist(){

        //arrange: create the product

 

        when(productRepository.findBySku("MISSING-100"))
        .thenReturn(Optional.empty());

        assertThrows(ProductNotFoundException.class, () -> productService.getProductBySku("MISSING-100"));

        verify(productRepository).findBySku("MISSING-100");

    }

    @Test 
    void shouldReturnAllProducts(){

        //arrange: create the product

        Product product = new Product(
        "TAPE-100",
        "Medium Shipping Tape",
        UnitOfMeasure.EACH,
        new BigDecimal("1.50"),
        new BigDecimal("3.99")
    );

        Product secondProduct = new Product(
        "BOX-100",
        "Medium Shipping Box",
        UnitOfMeasure.BOX,
        new BigDecimal("2.50"),
        new BigDecimal("4.99")
    );

        List<Product> expectedProducts = List.of(product, secondProduct);

        when(productRepository.findAll()).thenReturn(expectedProducts);

        List<Product> actualProducts = productService.getAllProducts();

        assertEquals(2, actualProducts.size());
        assertEquals("TAPE-100", actualProducts.get(0).getSku());

        verify(productRepository).findAll();
    }

    @Test
    void shouldDeactivateExistingProduct(){

        //arrange: create the product

        Product product = new Product(
        "TAPE-100",
        "Medium Shipping Tape",
        UnitOfMeasure.EACH,
        new BigDecimal("1.50"),
        new BigDecimal("3.99")
    );
        product.setActive(true);

        when(productRepository.findBySku("TAPE-100"))
        .thenReturn(Optional.of(product));

        when(productRepository.save(product)).thenReturn(product);
        
        Product deactivatedProduct = productService.deactiveProduct("TAPE-100");
        
        //act
        
       

        //assert

        verify(productRepository).findBySku("TAPE-100");
        verify(productRepository).save(product);
       
    }

    @Test 
    void shouldUpdateProductWhenSkuExists(){
        //arrange
        Product product = new Product(
            "TAPE-100",
            "Medium Shipping Tape",
            UnitOfMeasure.EACH,
            new BigDecimal("1.50"),
            new BigDecimal("3.99")
        );

        when(productRepository.findBySku("TAPE-100")).thenReturn(Optional.of(product));

        when(productRepository.save(product)).thenReturn(product);
    
        ProductUpdateRequest updateRequest = new ProductUpdateRequest(
            "Updated Tape",
            "Updated Description",
            UnitOfMeasure.BOX,
            new BigDecimal("2.00"),
            new BigDecimal("4.99"),
            "Blue",
            "Medium"
        );

        //act

        Product updatedProduct = productService.updateProductBySku("TAPE-100", updateRequest);
        //assert

        assertEquals("Updated Tape", updatedProduct.getName());
        assertEquals("Updated Description", updatedProduct.getDescription());
        assertEquals(UnitOfMeasure.BOX, updatedProduct.getUnitOfMeasure());
        assertEquals(new BigDecimal("2.00"), updatedProduct.getCostPrice());
        assertEquals(new BigDecimal("4.99"), updatedProduct.getSellingPrice());
        assertEquals("Blue", updatedProduct.getColor());
        assertEquals("Medium", updatedProduct.getSize());


        verify(productRepository).findBySku("TAPE-100");
        verify(productRepository).save(product);
       
    }

    @Test 
    void shouldThrowProductNotFoundExceptionWhenUpdatingSkuDoesNotExist(){
        //arrange
        String sku = "MISSING-100";

        when(productRepository.findBySku(sku)).thenReturn(Optional.empty());


        ProductUpdateRequest updateRequest = new ProductUpdateRequest(
            "Updated Tape",
            "Updated Description",
            UnitOfMeasure.BOX,
            new BigDecimal("2.00"),
            new BigDecimal("4.99"),
            "Blue",
            "Medium"
        );

        //act & assert
        assertThrows(ProductNotFoundException.class, () -> productService.updateProductBySku(sku, updateRequest));
        verify(productRepository, never()).save(any(Product.class));
    }

}
