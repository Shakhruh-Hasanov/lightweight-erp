package com.shakhruhhasanov.lightweighterp.product;

import org.springframework.stereotype.Service;
import java.util.List;

@Service 
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository){
        this.productRepository = productRepository;
    }

    public Product createProduct(Product product){

        if (productRepository.existsBySku(product.getSku())) {
        throw new DuplicateSkuException(product.getSku());
        }
        

        return productRepository.save(product);
    }

    public Product getProductBySku(String sku){
        return productRepository.findBySku(sku).orElseThrow(() -> new ProductNotFoundException(sku));
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product deactiveProduct(String sku) {
        Product product = getProductBySku(sku);
        product.setActive(false);
        return productRepository.save(product);
    }
    
    
   public Product updateProductBySku(String sku, ProductUpdateRequest updateRequest) {
        Product product = getProductBySku(sku);
        // Update product fields with values from updateRequest

        product.setName(updateRequest.name());
        product.setDescription(updateRequest.description());
        product.setUnitOfMeasure(updateRequest.unitOfMeasure());
        product.setCostPrice(updateRequest.costPrice());
        product.setSellingPrice(updateRequest.sellingPrice());
        product.setColor(updateRequest.color());
        product.setSize(updateRequest.size());
        return productRepository.save(product);
    }

}
