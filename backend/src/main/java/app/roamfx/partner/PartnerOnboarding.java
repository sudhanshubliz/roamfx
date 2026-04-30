package app.roamfx.partner;

import app.roamfx.common.BaseEntity;
import app.roamfx.common.Enums.PartnerOnboardingStatus;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "partner_onboarding")
public class PartnerOnboarding extends BaseEntity {
  @Id @GeneratedValue public UUID id;
  @OneToOne(optional = false) @JoinColumn(name = "partner_id") public Partner partner;
  @Enumerated(EnumType.STRING) @Column(nullable = false) public PartnerOnboardingStatus status = PartnerOnboardingStatus.DRAFT;
  @Column(length = 4000) public String kybChecklistJson;
  public Instant submittedAt;
  public Instant reviewedAt;
  public String reviewerEmail;
  @Column(length = 1200) public String notes;
}
