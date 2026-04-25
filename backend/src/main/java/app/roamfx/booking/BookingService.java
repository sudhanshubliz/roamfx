package app.roamfx.booking;

import app.roamfx.common.ApiException;
import app.roamfx.common.Enums.*;
import app.roamfx.config.AppProperties;
import app.roamfx.partner.PartnerRepository;
import app.roamfx.rate.ExchangeRateRepository;
import app.roamfx.user.UserRepository;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class BookingService {
  private final BookingRepository bookings;
  private final UserRepository users;
  private final PartnerRepository partners;
  private final ExchangeRateRepository rates;
  private final AppProperties props;
  public BookingService(BookingRepository bookings, UserRepository users, PartnerRepository partners, ExchangeRateRepository rates, AppProperties props) {
    this.bookings = bookings; this.users = users; this.partners = partners; this.rates = rates; this.props = props;
  }

  public record CreateBookingRequest(@NotNull UUID partnerId, @NotNull BookingType bookingType, @NotBlank String sourceCurrency, @NotBlank String targetCurrency,
    @NotNull @Positive BigDecimal sourceAmount, @NotNull PaymentMode paymentMode, @NotNull FulfilmentMode fulfilmentMode, String travelCountry,
    java.time.LocalDate travelDate, String purposeOfTravel, String notes) {}

  @Transactional
  public Booking create(String email, CreateBookingRequest req) {
    var traveller = users.findByEmailIgnoreCase(email).orElseThrow();
    var partner = partners.findById(req.partnerId()).orElseThrow(() -> ApiException.notFound("Partner not found"));
    if (partner.verificationStatus != VerificationStatus.VERIFIED) throw ApiException.bad("Bookings are allowed only through verified authorised partners");
    var rate = rates.searchVerified(req.sourceCurrency(), req.targetCurrency()).stream()
      .filter(r -> r.partner.id.equals(partner.id)).findFirst().orElseThrow(() -> ApiException.bad("No verified partner rate available"));

    var b = new Booking();
    b.bookingReference = "RFX-" + Instant.now().toEpochMilli();
    b.traveller = traveller; b.partner = partner; b.bookingType = req.bookingType();
    b.sourceCurrency = req.sourceCurrency(); b.targetCurrency = req.targetCurrency(); b.sourceAmount = req.sourceAmount();
    b.lockedRate = req.bookingType() == BookingType.BUY_FOREX ? rate.sellRate : rate.buyRate;
    b.serviceFee = rate.serviceFee;
    b.targetAmountEstimate = req.sourceAmount().multiply(b.lockedRate).setScale(2, RoundingMode.HALF_UP);
    b.totalPayable = b.targetAmountEstimate.add(b.serviceFee);
    b.paymentMode = req.paymentMode(); b.fulfilmentMode = req.fulfilmentMode();
    b.travelCountry = req.travelCountry(); b.travelDate = req.travelDate(); b.purposeOfTravel = req.purposeOfTravel(); b.notes = req.notes();
    b.rateLockExpiresAt = Instant.now().plusSeconds(props.rateLockMinutes() * 60);
    enforceCashRule(b);
    b.status = requiresKyc(b) ? BookingStatus.PENDING_KYC : BookingStatus.RATE_LOCKED;
    return bookings.save(b);
  }

  public void enforceCashRule(Booking b) {
    var inrEquivalent = "INR".equalsIgnoreCase(b.targetCurrency) ? b.targetAmountEstimate : b.totalPayable;
    if (b.paymentMode == PaymentMode.CASH && inrEquivalent.compareTo(BigDecimal.valueOf(50_000)) >= 0) {
      throw new ApiException(HttpStatus.UNPROCESSABLE_ENTITY, "INR equivalent >= 50000 cannot use CASH payment. Use UPI, card, or bank transfer.");
    }
  }

  public boolean requiresKyc(Booking b) {
    var inrEquivalent = "INR".equalsIgnoreCase(b.targetCurrency) ? b.targetAmountEstimate : b.totalPayable;
    return inrEquivalent.compareTo(BigDecimal.valueOf(50_000)) >= 0 || b.bookingType == BookingType.SELL_LEFTOVER_FOREX;
  }
}
