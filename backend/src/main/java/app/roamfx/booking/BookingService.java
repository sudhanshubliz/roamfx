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
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
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
    java.time.LocalDate travelDate, String purposeOfTravel, String notes, @Size(max = 120) String idempotencyKey) {}

  public record QuoteRequest(@NotNull UUID partnerId, @NotNull BookingType bookingType, @NotBlank String sourceCurrency, @NotBlank String targetCurrency,
    @NotNull @Positive BigDecimal sourceAmount, @NotNull PaymentMode paymentMode, @NotNull FulfilmentMode fulfilmentMode) {}

  public record PriceBreakdown(BigDecimal lockedRate, BigDecimal midMarketRate, BigDecimal fxAmount, BigDecimal spreadAmount,
    BigDecimal markupAmount, BigDecimal serviceFee, BigDecimal taxes, BigDecimal fulfilmentFee, BigDecimal totalPayable,
    BigDecimal payoutAmount, boolean kycRequired, boolean cashAllowed, Instant rateLockExpiresAt, Instant payoutEta,
    String complianceNotice) {}

  public PriceBreakdown quote(QuoteRequest req) {
    var partner = partners.findById(req.partnerId()).orElseThrow(() -> ApiException.notFound("Partner not found"));
    if (partner.verificationStatus != VerificationStatus.VERIFIED) throw ApiException.bad("Quotes are allowed only through verified authorised partners");
    var rate = rates.searchVerified(req.sourceCurrency(), req.targetCurrency()).stream()
      .filter(r -> r.partner.id.equals(partner.id)).findFirst().orElseThrow(() -> ApiException.bad("No verified partner rate available"));
    var lockedRate = req.bookingType() == BookingType.BUY_FOREX ? rate.sellRate : rate.buyRate;
    return calculate(req.bookingType(), req.sourceAmount(), lockedRate, rate.midMarketRate, rate.markupPercent, rate.serviceFee, req.paymentMode(), req.fulfilmentMode());
  }

  @Transactional
  public Booking create(String email, CreateBookingRequest req) {
    if (req.idempotencyKey() != null && !req.idempotencyKey().isBlank()) {
      var existing = bookings.findByIdempotencyKey(req.idempotencyKey());
      if (existing.isPresent()) return existing.get();
    }
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
    var breakdown = calculate(req.bookingType(), req.sourceAmount(), b.lockedRate, rate.midMarketRate, rate.markupPercent, rate.serviceFee, req.paymentMode(), req.fulfilmentMode());
    b.midMarketRate = breakdown.midMarketRate();
    b.targetAmountEstimate = breakdown.fxAmount();
    b.spreadAmount = breakdown.spreadAmount();
    b.markupAmount = breakdown.markupAmount();
    b.serviceFee = breakdown.serviceFee();
    b.taxes = breakdown.taxes();
    b.fulfilmentFee = breakdown.fulfilmentFee();
    b.totalPayable = breakdown.totalPayable();
    b.payoutAmount = breakdown.payoutAmount();
    b.paymentMode = req.paymentMode(); b.fulfilmentMode = req.fulfilmentMode();
    b.travelCountry = req.travelCountry(); b.travelDate = req.travelDate(); b.purposeOfTravel = req.purposeOfTravel(); b.notes = req.notes();
    b.rateLockExpiresAt = breakdown.rateLockExpiresAt();
    b.payoutEta = breakdown.payoutEta();
    b.idempotencyKey = req.idempotencyKey();
    b.settlementState = req.bookingType() == BookingType.SELL_LEFTOVER_FOREX ? SettlementState.PENDING : SettlementState.NOT_REQUIRED;
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

  public PriceBreakdown calculate(BookingType bookingType, BigDecimal sourceAmount, BigDecimal lockedRate, BigDecimal midMarketRate,
      BigDecimal markupPercent, BigDecimal serviceFee, PaymentMode paymentMode, FulfilmentMode fulfilmentMode) {
    var fxAmount = sourceAmount.multiply(lockedRate).setScale(2, RoundingMode.HALF_UP);
    var spreadAmount = sourceAmount.multiply(lockedRate.subtract(midMarketRate).abs()).setScale(2, RoundingMode.HALF_UP);
    var markupAmount = fxAmount.multiply(markupPercent).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
    var taxes = serviceFee.multiply(BigDecimal.valueOf(0.18)).setScale(2, RoundingMode.HALF_UP);
    var fulfilmentFee = fulfilmentMode == FulfilmentMode.DELIVERY ? BigDecimal.valueOf(250) : BigDecimal.ZERO;
    var totalPayable = fxAmount.add(serviceFee).add(taxes).add(fulfilmentFee).setScale(2, RoundingMode.HALF_UP);
    var payoutAmount = bookingType == BookingType.SELL_LEFTOVER_FOREX
      ? fxAmount.subtract(serviceFee).subtract(taxes).subtract(fulfilmentFee).max(BigDecimal.ZERO).setScale(2, RoundingMode.HALF_UP)
      : BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);
    var cashAllowed = paymentMode != PaymentMode.CASH || totalPayable.compareTo(BigDecimal.valueOf(50_000)) < 0;
    var pseudoBooking = new Booking();
    pseudoBooking.bookingType = bookingType;
    pseudoBooking.paymentMode = paymentMode;
    pseudoBooking.targetCurrency = "INR";
    pseudoBooking.targetAmountEstimate = fxAmount;
    pseudoBooking.totalPayable = totalPayable;
    var kycRequired = requiresKyc(pseudoBooking);
    var notice = cashAllowed
      ? "Quote is indicative until rate lock. All exchange flows must be completed through verified authorised partners."
      : "INR equivalent >= 50000 cannot use cash. Select UPI, card, or bank transfer.";
    return new PriceBreakdown(lockedRate, midMarketRate, fxAmount, spreadAmount, markupAmount, serviceFee, taxes, fulfilmentFee,
      bookingType == BookingType.BUY_FOREX ? totalPayable : BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP), payoutAmount,
      kycRequired, cashAllowed, Instant.now().plusSeconds(props.rateLockMinutes() * 60L), Instant.now().plus(2, ChronoUnit.DAYS), notice);
  }
}
