package app.roamfx.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app")
public record AppProperties(
  String jwtSecret,
  long jwtExpiryMinutes,
  String allowedOrigins,
  long rateLockMinutes,
  double suspiciousDeviationPercent
) {}
