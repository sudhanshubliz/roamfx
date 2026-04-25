package app.roamfx.waitlist;

import app.roamfx.common.BaseEntity;
import app.roamfx.common.Enums.WaitlistInterest;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "waitlist_entries")
public class WaitlistEntry extends BaseEntity {
  @Id @GeneratedValue public UUID id;
  @Column(nullable = false) public String name;
  @Column(nullable = false) public String email;
  public String phone;
  @Column(nullable = false) public String city;
  @Column(nullable = false) public String nextTravelDestination;
  public LocalDate expectedTravelDate;
  @Enumerated(EnumType.STRING) @Column(nullable = false) public WaitlistInterest interestedIn;
}
