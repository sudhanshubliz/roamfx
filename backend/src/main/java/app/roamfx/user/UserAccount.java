package app.roamfx.user;

import app.roamfx.common.BaseEntity;
import app.roamfx.common.Enums.KycStatus;
import app.roamfx.common.Enums.Role;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.util.UUID;

@Entity @Table(name = "users")
public class UserAccount extends BaseEntity {
  @Id @GeneratedValue public UUID id;
  @NotBlank public String fullName;
  @Email @Column(unique = true, nullable = false) public String email;
  @Column(nullable = false) public String passwordHash;
  public String phone;
  public String country;
  @Enumerated(EnumType.STRING) @Column(nullable = false) public KycStatus kycStatus = KycStatus.NOT_STARTED;
  @Enumerated(EnumType.STRING) @Column(nullable = false) public Role role = Role.TRAVELLER;
}
