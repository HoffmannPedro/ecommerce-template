package com.ecommerce.template.security;

import com.ecommerce.template.model.User;
import com.ecommerce.template.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        System.out.println("=== JWT FILTER EJECUTADO ===");
        System.out.println("URL: " + request.getRequestURI());
        System.out.println("Method: " + request.getMethod());

        String authHeader = request.getHeader("Authorization");
        System.out.println("Authorization Header: " + authHeader);

        String token = null;
        String username = null;

        // 1. Buscar el token en el header
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7); // Quitar "Bearer "
            username = jwtUtil.extractUsername(token);
        }

        // 2. Si hay username y NO está autenticado aún
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {

            // 3. Buscar el usuario en la DB
            User user = userRepository.findByUsername(username).orElse(null);

            // 4. Validar token
            if (user != null && jwtUtil.validateToken(token, username)) {

                // 5. CREAR AUTENTICACIÓN Y GUARDARLA
                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(
                                user,                    // principal (el usuario)
                                null,                    // credentials (no necesitamos)
                                user.getAuthorities()    // roles/permisos
                        );
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // 6. ¡GUARDAR EN SECURITY CONTEXT!
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        // 7. Continuar con la cadena de filtros
        filterChain.doFilter(request, response);
    }
}