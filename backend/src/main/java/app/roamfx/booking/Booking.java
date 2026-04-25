package app.roamfx.booking;

import app.roamfx.common.BaseEntity;
import app.roamfx.common.Enums.*;
import app.roamfx.partner.Partner;
import app.roamfx.user.UserAccount;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Entity @Table(name = "bookings")
public class Booking extends BaseEntity {
  @Id @GeneratedValue public UUID id;
  @Column(unique = true, nullable = false) public String bookingReference;
  @ManyToOne(optional = false) @JoinColumn(name = "traveller_id") public UserAccount traveller;
  @ManyToOne(optional = false) @JoinColumn(name = "partner_id") public Partner partner;
  @Enumerated(EnumType.STRING) @Column(nullable = false) public BookingType bookingType;
  public String sourceCurrency;
  public String targetCurrency;
  public BigDecimal sourceAmount;
  public BigDecimal targetAmountEstimate;
  public BigDecimal lockedRate;
  public BigDecimal serviceFee;
  public BigDecimal totalPayable;
  @Enumerated(EnumType.STRING) public PaymentMode paymentMode;
  @Enumerated(EnumType.STRING) public FulfilmentMode fulfilmentMode;
  @Enumerated(EnumType.STRING) @Column(nullable = false) public BookingStatus status = BookingStatus.DRAFT;
  public String travelCountry;
  public LocalDate travelDate;
  public String purposeOfTravel;
  @Column(length = 1200) public String notes;
  public Instant rateLockExpiresAt;
}
