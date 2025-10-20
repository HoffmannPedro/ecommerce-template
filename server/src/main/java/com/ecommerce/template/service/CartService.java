package com.ecommerce.template.service;

import com.ecommerce.template.dto.CartDTO;
import com.ecommerce.template.dto.CartItemDTO;
import com.ecommerce.template.model.Cart;
import com.ecommerce.template.model.CartItem;
import com.ecommerce.template.model.Product;
import com.ecommerce.template.repository.CartRepository;
import com.ecommerce.template.repository.CartItemRepository;
import com.ecommerce.template.repository.ProductRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CartService {

    private static final Logger logger = LoggerFactory.getLogger(CartService.class);

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private ProductRepository productRepository;

    public CartDTO getCartByUserId(Long userId) {
        try {
            logger.info("Obteniendo carrito para el usuario con ID: {}", userId);
            Cart cart = cartRepository.findByUserId(userId)
                .orElseGet(() -> {
                    logger.error("Carrito no encontrado, creando uno nuevo para userId: {}", userId);
                    Cart newCart = new Cart(userId);
                    return cartRepository.save(newCart);
                });
            return new CartDTO(
                cart.getId(),
                cart.getUserId(),
                cart.getItems().stream().map(item -> new CartItemDTO (
                        item.getId(),
                        item.getProduct().getId(),
                        item.getProduct().getName(),
                        item.getProduct().getPrice().doubleValue(),
                        item.getQuantity()
                )).collect(Collectors.toList())
            ); 
        } catch (Exception e) {
            logger.error("Error al obtener el carrito para userId {}: {}", userId, e.getMessage());
            throw new RuntimeException("Error al obtener el carrito: " + e.getMessage());
        }               
    }

    public CartDTO addItem(Long userId, Long productId, Integer quantity) {
        try {
            logger.info("Agregando producto con ID: {} y cantidad: {} al carrito del usuario con userId: {}", productId, quantity, userId);
            Cart cart = cartRepository.findByUserId(userId)
                .orElseGet(() -> {
                    logger.info("Carrito no encontrado, creando uno nuevo para userId: {}", userId);
                    return cartRepository.save(new Cart(userId));
                }); 

            Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado con ID: " + productId));
            
            CartItem existingItem = cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .findFirst()
                .orElse(null);
            
            if (existingItem != null) {
                existingItem.setQuantity(existingItem.getQuantity() + quantity);
                cartItemRepository.save(existingItem);
                logger.info("Actualizada la cantidad del producto con ID: {} en carrito: {}", productId, cart.getId());
            } else {
                CartItem newItem = new CartItem(product, quantity, cart);
                cart.getItems().add(newItem);
                cartItemRepository.save(newItem);
                logger.info("Agregado nuevo producto con ID: {} al carrito: {}", productId, cart.getId());
            }

            cart = cartRepository.save(cart); // Persistir los cambios en el carrito
            return new CartDTO(
                cart.getId(),
                cart.getUserId(),
                cart.getItems().stream().map(item -> new CartItemDTO (
                        item.getId(),
                        item.getProduct().getId(),
                        item.getProduct().getName(),
                        item.getProduct().getPrice().doubleValue(),
                        item.getQuantity()
                )).collect(Collectors.toList())
            );
        } catch (Exception e) {
            logger.error("Error al agregar el producto con ID: {} al carrito del usuario con userId {}: {}", productId, userId, e.getMessage());
            throw new RuntimeException("Error al agregar el producto al carrito: " + e.getMessage());
        }
    }

    public CartDTO removeOne(Long userId, Long productId) {
        try {
            logger.info("Removiendo una unidad del producto con ID: {} del carrito del usuario con userId: {}", productId, userId);
            Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Carrito no encontrado para userId: " + userId));

            CartItem item = cart.getItems().stream()
                .filter(i -> i.getProduct().getId().equals(productId))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Producto con ID: " + productId + " no encontrado en el carrito "));
            
            if (item.getQuantity() > 1) {
                item.setQuantity(item.getQuantity() - 1);
                cartItemRepository.save(item);
                logger.info("Disminuida la cantidad del producto con ID: {} en carrito: {}", productId, cart.getId());
            } else {
                cart.getItems().remove(item);
                cartItemRepository.delete(item);
                logger.info("Producto con ID: {} eliminado del carrito con ID: {}", productId, cart.getId());
            }

            cartRepository.save(cart); 
            return new CartDTO(
                cart.getId(),
                cart.getUserId(),
                cart.getItems().stream().map(i -> new CartItemDTO (
                        i.getId(),
                        i.getProduct().getId(),
                        i.getProduct().getName(),
                        i.getProduct().getPrice().doubleValue(),
                        i.getQuantity()
                )).collect(Collectors.toList())
            );
        } catch (Exception e) {
            logger.error("Error al remover una unidad del producto con ID: {} del carrito del usuario con userId {}: {}", productId, userId, e.getMessage());
            throw new RuntimeException("Error al eliminar el producto del carrito: " + e.getMessage()); 
        }
    }

    public CartDTO removeItem(Long userId, Long productId) {
        try {
            logger.info("Removiendo el producto con ID: {} del carrito del usuario con userId: {}", productId, userId);
            Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Carrito no encontrado para userId: " + userId));
            
            CartItem item = cart.getItems().stream()
                .filter(i -> i.getProduct().getId().equals(productId))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Producto con ID: " + productId + " no encontrado en el carrito "));
            
            cart.getItems().remove(item);
            cartItemRepository.delete(item);
            logger.info("Producto con ID: {} eliminado del carrito con ID: {}", productId, cart.getId());

            cartRepository.save(cart);
            return new CartDTO(
                cart.getId(),
                cart.getUserId(),
                cart.getItems().stream().map(i -> new CartItemDTO (
                        i.getId(),
                        i.getProduct().getId(),
                        i.getProduct().getName(),
                        i.getProduct().getPrice().doubleValue(),
                        i.getQuantity()
                )).collect(Collectors.toList())
            );
        } catch (Exception e) {
            logger.error("Error al eliminar el producto con ID: {} del carrito del usuario con userId {}: {}", productId, userId, e.getMessage());
            throw new RuntimeException("Error al eliminar el producto del carrito: " + e.getMessage());
        }
    }

}
