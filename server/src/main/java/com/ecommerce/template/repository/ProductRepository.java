package com.ecommerce.template.repository;

import com.ecommerce.template.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {}