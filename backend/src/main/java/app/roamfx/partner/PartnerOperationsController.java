package app.roamfx.partner;

import app.roamfx.booking.BookingRepository;
import app.roamfx.common.ApiException;
import app.roamfx.config.AppProperties;
import app.roamfx.document.KycDocumentRepository;
import app.roamfx.rate.ExchangeRate;
import app.roamfx.rate.ExchangeRateRepository;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/partner/operations")
public class PartnerOperationsController {
  private final PartnerRepository partners;
  private final BookingRepository bookings;
  private final KycDocumentRepository documents;
  private final ExchangeRateRepository rates;
  private final PartnerInventoryRepository inventory;
  private final AppProperties props;

  public PartnerOperationsController(PartnerRepository partners, BookingRepository bookings, KycDocumentRepository documents,
      ExchangeRateRepository rates, PartnerInventoryRepository inventory, AppProperties props) {
    this.partners = partners;
    this.bookings = bookings;
    this.documents = documents;
    this.rates = rates;
    this.inventory = inventory;
    this.props = props;
  }

  public record RateWarning(UUID rateId, String pair, BigDecimal sellRate, BigDecimal midMarketRate, BigDecimal deviationPercent, boolean suspicious) {}
  public record InventoryWarning(UUID inventoryId, String branchName, String currencyCode, BigDecimal availableAmount, BigDecimal reservedAmount, BigDecimal reorderLevel, boolean lowStock) {}
  public record PartnerOperationsSummary(UUID partnerId, String partnerName, long totalBookings, long pendingKycDocuments,
    long lowStockCurrencies, long suspiciousRates, List<InventoryWarning> inventory, List<RateWarning> rates) {}

  @GetMapping("/summary")
  PartnerOperationsSummary summary(@RequestParam UUID partnerId) {
    var partner = partners.findById(partnerId).orElseThrow(() -> ApiException.notFound("Partner not found"));
    var partnerBookings = bookings.findByPartnerIdOrderByCreatedAtDesc(partnerId, PageRequest.of(0, 50));
    var inventoryRows = inventory.findByPartnerId(partnerId, PageRequest.of(0, 100)).stream()
      .map(row -> new InventoryWarning(row.id, row.branchName, row.currencyCode, row.availableAmount, row.reservedAmount, row.reorderLevel,
        row.availableAmount.subtract(row.reservedAmount).compareTo(row.reorderLevel) <= 0))
      .toList();
    var rateRows = rates.findByPartnerId(partnerId).stream().map(this::warning).toList();
    var pendingKyc = documents.findAll().stream()
      .filter(doc -> doc.booking != null && doc.booking.partner != null && partnerId.equals(doc.booking.partner.id))
      .filter(doc -> doc.verificationStatus != app.roamfx.common.Enums.DocumentStatus.VERIFIED)
      .count();
    return new PartnerOperationsSummary(partner.id, partner.businessName, partnerBookings.getTotalElements(), pendingKyc,
      inventoryRows.stream().filter(InventoryWarning::lowStock).count(), rateRows.stream().filter(RateWarning::suspicious).count(), inventoryRows, rateRows);
  }

  private RateWarning warning(ExchangeRate rate) {
    var deviation = rate.midMarketRate.signum() == 0 ? BigDecimal.ZERO : rate.sellRate.subtract(rate.midMarketRate).abs()
      .multiply(BigDecimal.valueOf(100)).divide(rate.midMarketRate, 2, RoundingMode.HALF_UP);
    return new RateWarning(rate.id, rate.sourceCurrency + "/" + rate.targetCurrency, rate.sellRate, rate.midMarketRate, deviation,
      deviation.doubleValue() > props.suspiciousDeviationPercent());
  }
}
