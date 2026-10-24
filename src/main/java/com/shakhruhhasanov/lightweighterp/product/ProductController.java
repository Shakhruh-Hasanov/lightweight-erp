package com.shakhruhhasanov.lightweighterp.product;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PutMapping;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;




@RestController 
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }


    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Product createProduct(@Valid @RequestBody Product product) {
        return productService.createProduct(product);
    }

    @GetMapping("/{sku}")
    @ResponseStatus (HttpStatus.OK)
    public Product getProductBySku(@PathVariable String sku) {
        return productService.getProductBySku(sku);
    }

    @GetMapping
    @ResponseStatus (HttpStatus.OK)
    public List<Product> getAllProducts() {
        return productService.getAllProducts(); 
    }

    @PatchMapping("/{sku}/deactivate")
    public Product deactivateProduct(@PathVariable String sku) {
        return productService.deactiveProduct(sku);
    }

    @PutMapping("/{sku}")
    public Product updateProductBySku(@PathVariable String sku, @Valid @RequestBody ProductUpdateRequest updateRequest) {
        return productService.updateProductBySku(sku, updateRequest);
        
    }

}
