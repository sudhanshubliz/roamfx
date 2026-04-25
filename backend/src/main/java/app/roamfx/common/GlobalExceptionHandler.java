package app.roamfx.common;

import jakarta.validation.ConstraintViolationException;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice(basePackages = "app.roamfx")
public class GlobalExceptionHandler {
  @ExceptionHandler(ApiException.class)
  ResponseEntity<ApiResponse<Void>> api(ApiException ex) {
    return ResponseEntity.status(ex.status).body(ApiResponse.error(ex.getMessage(), ex.errorCode));
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  ResponseEntity<ApiResponse<Void>> validation(MethodArgumentNotValidException ex) {
    var message = ex.getBindingResult().getFieldErrors().stream()
      .map(err -> err.getField() + ": " + err.getDefaultMessage())
      .collect(Collectors.joining("; "));
    return ResponseEntity.badRequest().body(ApiResponse.error(message.isBlank() ? "Validation failed" : message, "VALIDATION_FAILED"));
  }

  @ExceptionHandler(ConstraintViolationException.class)
  ResponseEntity<ApiResponse<Void>> constraint(ConstraintViolationException ex) {
    return ResponseEntity.badRequest().body(ApiResponse.error(ex.getMessage(), "VALIDATION_FAILED"));
  }

  @ExceptionHandler(BadCredentialsException.class)
  ResponseEntity<ApiResponse<Void>> badCredentials() {
    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error("Invalid email or password", "AUTH_INVALID_CREDENTIALS"));
  }

  @ExceptionHandler(AccessDeniedException.class)
  ResponseEntity<ApiResponse<Void>> denied() {
    return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ApiResponse.error("You do not have permission to perform this action", "ACCESS_DENIED"));
  }

  @ExceptionHandler(Exception.class)
  ResponseEntity<ApiResponse<Void>> unexpected(Exception ex) {
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.error("Unexpected server error", "INTERNAL_SERVER_ERROR"));
  }
}
