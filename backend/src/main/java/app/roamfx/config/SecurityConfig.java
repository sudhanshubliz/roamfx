package app.roamfx.config;

import app.roamfx.auth.JwtAuthFilter;
import app.roamfx.user.UserRepository;
import java.util.List;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableConfigurationProperties(AppProperties.class)
public class SecurityConfig {
  @Bean PasswordEncoder passwordEncoder() { return new BCryptPasswordEncoder(); }

  @Bean UserDetailsService userDetailsService(UserRepository users) {
    return email -> users.findByEmailIgnoreCase(email)
      .map(u -> org.springframework.security.core.userdetails.User
        .withUsername(u.email).password(u.passwordHash).roles(u.role.name()).build())
      .orElseThrow(() -> new UsernameNotFoundException("User not found"));
  }

  @Bean AuthenticationManager authenticationManager(UserDetailsService uds, PasswordEncoder encoder) {
    var provider = new DaoAuthenticationProvider();
    provider.setUserDetailsService(uds);
    provider.setPasswordEncoder(encoder);
    return new ProviderManager(provider);
  }

  @Bean SecurityFilterChain security(HttpSecurity http, JwtAuthFilter jwt) throws Exception {
    return http.csrf(csrf -> csrf.disable())
      .cors(cors -> {})
      .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
      .authorizeHttpRequests(auth -> auth
        .requestMatchers("/swagger-ui.html", "/swagger-ui/**", "/v3/api-docs/**", "/actuator/health").permitAll()
        .requestMatchers(HttpMethod.POST, "/api/auth/register", "/api/auth/login", "/api/ai/travel-money-plan", "/api/waitlist").permitAll()
        .requestMatchers(HttpMethod.GET, "/api/partners/**", "/api/rates/**", "/api/community/posts", "/api/partners/*/reviews").permitAll()
        .requestMatchers("/api/admin/**").hasRole("PLATFORM_ADMIN")
        .requestMatchers("/api/partner/**").hasRole("PARTNER_ADMIN")
        .anyRequest().authenticated())
      .addFilterBefore(jwt, UsernamePasswordAuthenticationFilter.class)
      .build();
  }

  @Bean CorsConfigurationSource corsConfigurationSource(AppProperties props) {
    var cfg = new CorsConfiguration();
    cfg.setAllowedOrigins(List.of(props.allowedOrigins().split(",")));
    cfg.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    cfg.setAllowedHeaders(List.of("*"));
    cfg.setAllowCredentials(true);
    var source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", cfg);
    return source;
  }
}
