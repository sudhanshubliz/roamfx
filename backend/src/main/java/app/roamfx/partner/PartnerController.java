package app.roamfx.partner;

import app.roamfx.admin.AuditService;
import app.roamfx.common.ApiException;
import app.roamfx.common.Enums.PartnerOnboardingStatus;
import app.roamfx.common.Enums.VerificationStatus;
import jakarta.validation.Valid;
import java.security.Principal;
import java.time.Instant;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
public class PartnerController {
  private final PartnerRepository partners;
  private final PartnerInventoryRepository inventory;
  private final PartnerOnboardingRepository onboarding;
  private final AuditService audits;
  public PartnerController(PartnerRepository partners, PartnerInventoryRepository inventory, PartnerOnboardingRepository onboarding, AuditService audits) {
    this.partners = partners; this.inventory = inventory; this.onboarding = onboarding; this.audits = audits;
  }

  @GetMapping("/api/partners")
  Page<Partner> list(@RequestParam(required = false, defaultValue = "") String city, Pageable pageable) {
    if (city.isBlank()) return partners.findByVerificationStatus(VerificationStatus.VERIFIED, pageable);
    return partners.findByVerificationStatusAndCityContainingIgnoreCase(VerificationStatus.VERIFIED, city, pageable);
  }

  @GetMapping("/api/partners/{id}")
  Partner get(@PathVariable UUID id) {
    var p = partners.findById(id).orElseThrow(() -> ApiException.notFound("Partner not found"));
    if (p.verificationStatus != VerificationStatus.VERIFIED) throw ApiException.notFound("Partner not found");
    return p;
  }

  @PostMapping("/api/admin/partners")
  Partner create(@Valid @RequestBody Partner partner, Principal principal) {
    partner.id = null;
    var saved = partners.save(partner);
    audits.log(principal.getName(), "PARTNER_CREATED", "PARTNER", saved.id.toString(), saved.businessName);
    return saved;
  }

  @PutMapping("/api/admin/partners/{id}/verify")
  Partner verify(@PathVariable UUID id, @RequestParam(defaultValue = "VERIFIED") VerificationStatus status, Principal principal) {
    var p = partners.findById(id).orElseThrow(() -> ApiException.notFound("Partner not found"));
    p.verificationStatus = status;
    var saved = partners.save(p);
    audits.log(principal.getName(), "PARTNER_VERIFICATION_" + status, "PARTNER", saved.id.toString(), "verificationStatus=" + status);
    return saved;
  }

  @PutMapping("/api/partner/profile")
  Partner updateProfile(@Valid @RequestBody Partner partner) {
    return partners.save(partner);
  }

  @GetMapping("/api/partner/inventory")
  Page<PartnerInventory> inventory(@RequestParam UUID partnerId, Pageable pageable) {
    return inventory.findByPartnerId(partnerId, pageable);
  }

  @PutMapping("/api/partner/inventory/{id}")
  PartnerInventory updateInventory(@PathVariable UUID id, @Valid @RequestBody PartnerInventory req, Principal principal) {
    var row = inventory.findById(id).orElseThrow(() -> ApiException.notFound("Inventory row not found"));
    row.branchName = req.branchName;
    row.currencyCode = req.currencyCode;
    row.availableAmount = req.availableAmount;
    row.reservedAmount = req.reservedAmount;
    row.reorderLevel = req.reorderLevel;
    var saved = inventory.save(row);
    audits.log(principal.getName(), "PARTNER_INVENTORY_UPDATED", "PARTNER_INVENTORY", saved.id.toString(), saved.currencyCode + " available=" + saved.availableAmount);
    return saved;
  }

  @GetMapping("/api/admin/partners/{id}/onboarding")
  PartnerOnboarding onboarding(@PathVariable UUID id) {
    return onboarding.findByPartnerId(id).orElseThrow(() -> ApiException.notFound("Partner onboarding not found"));
  }

  public record OnboardingReviewRequest(PartnerOnboardingStatus status, String notes) {}

  @PutMapping("/api/admin/partners/{id}/onboarding")
  PartnerOnboarding reviewOnboarding(@PathVariable UUID id, @RequestBody OnboardingReviewRequest req, Principal principal) {
    var partner = partners.findById(id).orElseThrow(() -> ApiException.notFound("Partner not found"));
    var record = onboarding.findByPartnerId(id).orElseGet(() -> {
      var created = new PartnerOnboarding();
      created.partner = partner;
      created.submittedAt = Instant.now();
      return created;
    });
    record.status = req.status() == null ? PartnerOnboardingStatus.KYB_REVIEW : req.status();
    record.reviewedAt = Instant.now();
    record.reviewerEmail = principal.getName();
    record.notes = req.notes();
    if (record.status == PartnerOnboardingStatus.APPROVED) partner.verificationStatus = VerificationStatus.VERIFIED;
    if (record.status == PartnerOnboardingStatus.REJECTED) partner.verificationStatus = VerificationStatus.REJECTED;
    partners.save(partner);
    var saved = onboarding.save(record);
    audits.log(principal.getName(), "PARTNER_ONBOARDING_" + saved.status, "PARTNER", partner.id.toString(), saved.notes);
    return saved;
  }
}
