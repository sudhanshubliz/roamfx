package app.roamfx.rate;

import app.roamfx.partner.Partner;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity @Table(name = "exchange_rates")
public class ExchangeRate {
  @Id @GeneratedValue public UUID id;
  @ManyToOne(optional = false) @JoinColumn(name = "partner_id") public Partner partner;
  @Column(nullable = false, length = 3) public String sourceCurrency;
  @Column(nullable = false, length = 3) public String targetCurrency;
  @Column(nullable = false, precision = 18, scale = 6) public BigDecimal buyRate;
  @Column(nullable = false, precision = 18, scale = 6) public BigDecimal sellRate;
  @Column(nullable = false, precision = 18, scale = 6) public BigDecimal midMarketRate;
  @Column(nullable = false, precision = 8, scale = 4) public BigDecimal markupPercent;
  @Column(nullable = false, precision = 18, scale = 2) public BigDecimal serviceFee;
  @Column(nullable = false, precision = 18, scale = 2) public BigDecimal availableAmount;
  @Column(nullable = false) public Instant lastUpdatedAt = Instant.now();
}
