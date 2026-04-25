package app.roamfx.auth;

import app.roamfx.config.AppProperties;
import app.roamfx.user.UserAccount;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import javax.crypto.SecretKey;
import org.springframework.stereotype.Service;

@Service
public class JwtService {
  private final AppProperties props;
  public JwtService(AppProperties props) { this.props = props; }
  private SecretKey key() { return Keys.hmacShaKeyFor(props.jwtSecret().getBytes(StandardCharsets.UTF_8)); }
  public String create(UserAccount user) {
    var now = Instant.now();
    return Jwts.builder()
      .subject(user.email)
      .claim("role", user.role.name())
      .claim("userId", user.id.toString())
      .issuedAt(Date.from(now))
      .expiration(Date.from(now.plusSeconds(props.jwtExpiryMinutes() * 60)))
      .signWith(key())
      .compact();
  }
  public String subject(String token) {
    return Jwts.parser().verifyWith(key()).build().parseSignedClaims(token).getPayload().getSubject();
  }
}
