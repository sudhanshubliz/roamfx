package app.roamfx.review;

import app.roamfx.booking.Booking;
import app.roamfx.common.BaseEntity;
import app.roamfx.partner.Partner;
import app.roamfx.user.UserAccount;
import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import java.util.UUID;

@Entity @Table(name = "partner_reviews")
public class PartnerReview extends BaseEntity {
  @Id @GeneratedValue public UUID id;
  @ManyToOne(optional = false) @JoinColumn(name = "partner_id") public Partner partner;
  @ManyToOne(optional = false) @JoinColumn(name = "user_id") public UserAccount user;
  @OneToOne(optional = false) @JoinColumn(name = "booking_id") public Booking booking;
  @Min(1) @Max(5) public int rating;
  @Column(length = 1200) public String comment;
}
