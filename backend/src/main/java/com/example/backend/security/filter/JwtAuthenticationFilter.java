package com.example.backend.security.filter;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.example.backend.security.handler.SecurityExceptionConfig;
import com.example.backend.security.jwt.JwtService;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.SignatureException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;
    private final SecurityExceptionConfig securityExceptionConfig;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain) throws ServletException, IOException {

            final String authHeader = request.getHeader("Authorization");

            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                filterChain.doFilter(request, response);
                return;
            }

            final String jwt = authHeader.substring(7);

            try {
                final String username = jwtService.extractUsername(jwt);

                if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                        UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);
                        
                        
                        if (jwtService.isTokenValid(jwt, userDetails.getUsername())) {
                            UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities()
                            );

                            authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                            SecurityContextHolder.getContext().setAuthentication(authToken);
                        }
                }
                filterChain.doFilter(request, response);

            } catch (ExpiredJwtException e) {
                request.setAttribute("jwt_error", "token_expired");
                SecurityContextHolder.clearContext();
                securityExceptionConfig.commence(request, response, 
                    new org.springframework.security.core.AuthenticationException("token_expired") {});

            } catch (SignatureException e) {
                request.setAttribute("jwt_error", "token_signature_invalid");
                SecurityContextHolder.clearContext();
                securityExceptionConfig.commence(request, response,
                    new org.springframework.security.core.AuthenticationException("token_signature_invalid") {});

            } catch (MalformedJwtException e) {
                request.setAttribute("jwt_error", "token_malformed");
                SecurityContextHolder.clearContext();
                securityExceptionConfig.commence(request, response,
                    new org.springframework.security.core.AuthenticationException("token_malformed") {});

            } catch (UnsupportedJwtException e) {
                request.setAttribute("jwt_error", "token_unsupported");
                SecurityContextHolder.clearContext();
                securityExceptionConfig.commence(request, response,
                    new org.springframework.security.core.AuthenticationException("token_unsupported") {});
            }
    }
}
