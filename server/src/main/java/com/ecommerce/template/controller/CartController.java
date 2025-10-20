package com.ecommerce.template.controller;

import com.ecommerce.template.dto.CartDTO;
import com.ecommerce.template.dto.CartItemDTO;
import com.ecommerce.template.service.CartService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    @GetMapping("/{userId}")
    public ResponseEntity<CartDTO> getCart(@PathVariable Long userId) {
        return ResponseEntity.ok(cartService.getCartByUserId(userId));
    }

    @PostMapping("/{userId}/items")
    public ResponseEntity<CartDTO> addItem(
            @PathVariable Long userId,
            @RequestBody CartItemDTO itemDTO) {
        return ResponseEntity.ok(cartService.addItem(userId, itemDTO.getProductId(), itemDTO.getQuantity()));
    }

    @DeleteMapping("/{userId}/items/{productId}/one")
    public ResponseEntity<CartDTO> removeOne(
            @PathVariable Long userId,
            @PathVariable Long productId) {
        return ResponseEntity.ok(cartService.removeOne(userId, productId));
    }

    @DeleteMapping("/{userId}/items/{productId}")
    public ResponseEntity<CartDTO> removeItem(
            @PathVariable Long userId,
            @PathVariable Long productId) {
        return ResponseEntity.ok(cartService.removeItem(userId, productId));
    }
}