package app.roamfx.auth;

import app.roamfx.common.ApiException;
import app.roamfx.common.Enums.Role;
import app.roamfx.user.UserAccount;
import app.roamfx.user.UserRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController @RequestMapping("/api/auth")
public class AuthController {
  private final UserRepository users;
  private final PasswordEncoder encoder;
  private final AuthenticationManager auth;
  private final JwtService jwt;
  public AuthController(UserRepository users, PasswordEncoder encoder, AuthenticationManager auth, JwtService jwt) {
    this.users = users; this.encoder = encoder; this.auth = auth; this.jwt = jwt;
  }

  public record RegisterRequest(@NotBlank String fullName, @Email String email, @NotBlank String password, String phone, String country) {}
  public record LoginRequest(@Email String email, @NotBlank String password) {}
  public record AuthResponse(String accessToken, UserDto user) {}
  public record UserDto(String id, String fullName, String email, String phone, String country, String role, String kycStatus) {
    public static UserDto from(UserAccount u) { return new UserDto(u.id.toString(), u.fullName, u.email, u.phone, u.country, u.role.name(), u.kycStatus.name()); }
  }

  @PostMapping("/register")
  AuthResponse register(@Valid @RequestBody RegisterRequest req) {
    if (users.existsByEmailIgnoreCase(req.email())) throw ApiException.bad("Email already registered");
    var u = new UserAccount();
    u.fullName = req.fullName(); u.email = req.email().toLowerCase(); u.passwordHash = encoder.encode(req.password());
    u.phone = req.phone(); u.country = req.country(); u.role = Role.TRAVELLER;
    users.save(u);
    return new AuthResponse(jwt.create(u), UserDto.from(u));
  }

  @PostMapping("/login")
  AuthResponse login(@Valid @RequestBody LoginRequest req) {
    Authentication authentication = auth.authenticate(new UsernamePasswordAuthenticationToken(req.email(), req.password()));
    var u = users.findByEmailIgnoreCase(authentication.getName()).orElseThrow();
    return new AuthResponse(jwt.create(u), UserDto.from(u));
  }

  @GetMapping("/me")
  UserDto me(Authentication authentication) {
    return users.findByEmailIgnoreCase(authentication.getName()).map(UserDto::from).orElseThrow();
  }
}
