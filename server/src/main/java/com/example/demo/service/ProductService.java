package com.example.demo.service;

import com.example.demo.dto.ProductDTO;
import com.example.demo.model.Category;
import com.example.demo.model.Product;
import com.example.demo.repository.CategoryRepository;
import com.example.demo.repository.ProductRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {

    private static final Logger logger = LoggerFactory.getLogger(ProductService.class);

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    public List<ProductDTO> getAllProducts() {
        logger.info("Obteniendo todos los productos, total: {}", productRepository.findAll().size());
        return productRepository.findAll().stream()
                .map(product -> new ProductDTO(
                        product.getId(),
                        product.getName(),
                        product.getPrice(),
                        product.getCategory() != null ? product.getCategory().getName() : "Sin categoría",
                        product.getCategory() != null ? product.getCategory().getId() : null
                ))
                .collect(Collectors.toList());
    }

    public ProductDTO createProduct(ProductDTO productDTO) {
        try {
            logger.info("Creando producto: {}", productDTO.getName());
            Category category = null;
            if (productDTO.getCategoryId() != null) {
                category = categoryRepository.findById(productDTO.getCategoryId())
                        .orElseThrow(() -> new IllegalArgumentException("Categoría no encontrada: " + productDTO.getCategoryId()));
            }
            Product product = new Product(
                    productDTO.getName(),
                    productDTO.getPrice(),
                    category
            );
            product = productRepository.save(product);
            logger.info("Producto creado con ID: {}", product.getId());
            return new ProductDTO(
                    product.getId(),
                    product.getName(),
                    product.getPrice(),
                    product.getCategory() != null ? product.getCategory().getName() : "Sin categoría",
                    product.getCategory() != null ? product.getCategory().getId() : null
            );
        } catch (Exception e) {
            logger.error("Error al crear producto: {}", e.getMessage());
            throw new RuntimeException("Error al crear producto: " + e.getMessage());
        }
    }

    public void deleteProduct(Long id) {
        try {
            logger.info("Eliminando productos con id {}", id);
            Product product = productRepository.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado" + id));
            productRepository.delete(product);
            logger.info("Producto eliminado con id {}", id);
        } catch (RuntimeException e) {
            logger.error("Error al eliminar producto: {}", e.getMessage());
            throw new RuntimeException("Error al eliminar producto: " + e.getMessage());
        }
    }
}