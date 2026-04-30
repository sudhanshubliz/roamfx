package app.roamfx.partner;

import app.roamfx.common.BaseEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "partner_inventory", indexes = {
  @Index(name = "idx_partner_inventory_partner_currency", columnList = "partner_id,currency_code")
})
public class PartnerInventory extends BaseEntity {
  @Id @GeneratedValue public UUID id;
  @ManyToOne(optional = false) @JoinColumn(name = "partner_id") public Partner partner;
  @NotBlank @Column(nullable = false) public String branchName;
  @NotBlank @Column(nullable = false, length = 3) public String currencyCode;
  @NotNull @PositiveOrZero @Column(nullable = false, precision = 18, scale = 2) public BigDecimal availableAmount = BigDecimal.ZERO;
  @NotNull @PositiveOrZero @Column(nullable = false, precision = 18, scale = 2) public BigDecimal reservedAmount = BigDecimal.ZERO;
  @NotNull @PositiveOrZero @Column(nullable = false, precision = 18, scale = 2) public BigDecimal reorderLevel = BigDecimal.ZERO;
}
