package app.roamfx.common;

import org.springframework.http.HttpStatus;

public class ApiException extends RuntimeException {
  public final HttpStatus status;
  public final String errorCode;
  public ApiException(HttpStatus status, String message) {
    this(status, message, status.name());
  }
  public ApiException(HttpStatus status, String message, String errorCode) {
    super(message);
    this.status = status;
    this.errorCode = errorCode;
  }
  public static ApiException bad(String message) { return new ApiException(HttpStatus.BAD_REQUEST, message); }
  public static ApiException forbidden(String message) { return new ApiException(HttpStatus.FORBIDDEN, message); }
  public static ApiException notFound(String message) { return new ApiException(HttpStatus.NOT_FOUND, message); }
}
