package app.roamfx.partner;

import app.roamfx.common.BaseEntity;
import app.roamfx.common.Enums.LicenseType;
import app.roamfx.common.Enums.VerificationStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.math.BigDecimal;
import java.util.UUID;

@Entity @Table(name = "partners")
public class Partner extends BaseEntity {
  @Id @GeneratedValue public UUID id;
  @NotBlank public String businessName;
  @Enumerated(EnumType.STRING) @Column(nullable = false) public LicenseType licenseType;
  @Column(nullable = false) public String licenseNumber;
  @Enumerated(EnumType.STRING) @Column(nullable = false) public VerificationStatus verificationStatus = VerificationStatus.PENDING;
  public String address;
  public String city;
  public String state;
  public String country;
  public BigDecimal latitude;
  public BigDecimal longitude;
  public String contactPhone;
  public String contactEmail;
  public String openingHours;
  public boolean supportsPickup;
  public boolean supportsDelivery;
  public boolean supportsCashPayment;
  public boolean supportsDigitalPayment;
  public BigDecimal rating = BigDecimal.ZERO;
}
