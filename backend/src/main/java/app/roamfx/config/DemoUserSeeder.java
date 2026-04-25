package app.roamfx.config;

import app.roamfx.common.Enums.Role;
import app.roamfx.user.UserAccount;
import app.roamfx.user.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
class DemoUserSeeder {
  @Bean CommandLineRunner seedDemoUsers(UserRepository users, PasswordEncoder encoder) {
    return args -> {
      create(users, encoder, "Traveller Demo", "traveller@roamfx.app", Role.TRAVELLER);
      create(users, encoder, "Partner Demo", "partner@roamfx.app", Role.PARTNER_ADMIN);
      create(users, encoder, "Admin Demo", "admin@roamfx.app", Role.PLATFORM_ADMIN);
    };
  }
  private void create(UserRepository users, PasswordEncoder encoder, String name, String email, Role role) {
    if (users.existsByEmailIgnoreCase(email)) return;
    var u = new UserAccount();
    u.fullName = name; u.email = email; u.passwordHash = encoder.encode("password123"); u.phone = "+91-9999999999"; u.country = "India"; u.role = role;
    users.save(u);
  }
}
