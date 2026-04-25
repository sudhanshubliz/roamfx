package app.roamfx.rate;

import app.roamfx.admin.AuditService;
import app.roamfx.common.ApiException;
import app.roamfx.config.AppProperties;
import app.roamfx.partner.PartnerRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import java.security.Principal;
import org.springframework.web.bind.annotation.*;

@RestController
public class RateController {
  private final ExchangeRateRepository rates;
  private final PartnerRepository partners;
  private final AppProperties props;
  private final AuditService audits;
  public RateController(ExchangeRateRepository rates, PartnerRepository partners, AppProperties props, AuditService audits) {
    this.rates = rates; this.partners = partners; this.props = props; this.audits = audits;
  }
  public record RateView(UUID id, UUID partnerId, String partnerName, String sourceCurrency, String targetCurrency, BigDecimal buyRate,
    BigDecimal sellRate, BigDecimal midMarketRate, BigDecimal serviceFee, BigDecimal availableAmount, Instant lastUpdatedAt,
    boolean suspicious, String freshness) {
    static RateView from(ExchangeRate r, boolean suspicious) {
      long mins = java.time.Duration.between(r.lastUpdatedAt, Instant.now()).toMinutes();
      return new RateView(r.id, r.partner.id, r.partner.businessName, r.sourceCurrency, r.targetCurrency, r.buyRate, r.sellRate,
        r.midMarketRate, r.serviceFee, r.availableAmount, r.lastUpdatedAt, suspicious, mins < 60 ? mins + "m ago" : (mins / 60) + "h ago");
    }
  }

  @GetMapping("/api/rates/search")
  List<RateView> search(@RequestParam(defaultValue = "USD") String sourceCurrency,
                        @RequestParam(defaultValue = "INR") String targetCurrency,
                        @RequestParam(defaultValue = "best-rate") String sort) {
    Comparator<ExchangeRate> comparator = switch (sort) {
      case "rating" -> Comparator.comparing((ExchangeRate r) -> r.partner.rating).reversed();
      case "delivery" -> Comparator.comparing((ExchangeRate r) -> r.partner.supportsDelivery).reversed();
      default -> Comparator.comparing(r -> r.sellRate);
    };
    return rates.searchVerified(sourceCurrency, targetCurrency).stream().sorted(comparator)
      .map(r -> RateView.from(r, suspicious(r))).toList();
  }

  @PostMapping("/api/partner/rates")
  ExchangeRate create(@Valid @RequestBody RateRequest req, Principal principal) {
    var p = partners.findById(req.partnerId()).orElseThrow(() -> ApiException.notFound("Partner not found"));
    var r = new ExchangeRate();
    r.partner = p; apply(r, req);
    var saved = rates.save(r);
    audits.log(principal.getName(), "RATE_CREATED", "EXCHANGE_RATE", saved.id.toString(), saved.sourceCurrency + "/" + saved.targetCurrency);
    return saved;
  }
  @PutMapping("/api/partner/rates/{id}")
  ExchangeRate update(@PathVariable UUID id, @Valid @RequestBody RateRequest req, Principal principal) {
    var r = rates.findById(id).orElseThrow(() -> ApiException.notFound("Rate not found"));
    apply(r, req);
    var saved = rates.save(r);
    audits.log(principal.getName(), "RATE_UPDATED", "EXCHANGE_RATE", saved.id.toString(), saved.sourceCurrency + "/" + saved.targetCurrency);
    return saved;
  }
  @DeleteMapping("/api/partner/rates/{id}") void delete(@PathVariable UUID id, Principal principal) {
    rates.deleteById(id);
    audits.log(principal.getName(), "RATE_DELETED", "EXCHANGE_RATE", id.toString(), null);
  }

  public record RateRequest(@NotNull UUID partnerId, @NotBlank String sourceCurrency, @NotBlank String targetCurrency,
    @NotNull @PositiveOrZero BigDecimal buyRate, @NotNull @PositiveOrZero BigDecimal sellRate,
    @NotNull @PositiveOrZero BigDecimal midMarketRate, @NotNull @PositiveOrZero BigDecimal markupPercent,
    @NotNull @PositiveOrZero BigDecimal serviceFee, @NotNull @PositiveOrZero BigDecimal availableAmount) {}

  private void apply(ExchangeRate r, RateRequest req) {
    r.sourceCurrency = req.sourceCurrency(); r.targetCurrency = req.targetCurrency(); r.buyRate = req.buyRate(); r.sellRate = req.sellRate();
    r.midMarketRate = req.midMarketRate(); r.markupPercent = req.markupPercent(); r.serviceFee = req.serviceFee();
    r.availableAmount = req.availableAmount(); r.lastUpdatedAt = Instant.now();
  }
  private boolean suspicious(ExchangeRate r) {
    if (r.midMarketRate.signum() == 0) return false;
    var deviation = r.sellRate.subtract(r.midMarketRate).abs().multiply(BigDecimal.valueOf(100))
      .divide(r.midMarketRate, 4, RoundingMode.HALF_UP);
    return deviation.doubleValue() > props.suspiciousDeviationPercent();
  }
}
