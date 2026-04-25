package app.roamfx.partner;

import app.roamfx.admin.AuditService;
import app.roamfx.common.ApiException;
import app.roamfx.common.Enums.VerificationStatus;
import jakarta.validation.Valid;
import java.security.Principal;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
public class PartnerController {
  private final PartnerRepository partners;
  private final AuditService audits;
  public PartnerController(PartnerRepository partners, AuditService audits) { this.partners = partners; this.audits = audits; }

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
}
