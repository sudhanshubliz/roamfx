package app.roamfx.admin;

import app.roamfx.booking.BookingRepository;
import app.roamfx.document.KycDocumentRepository;
import app.roamfx.partner.PartnerRepository;
import app.roamfx.rate.CurrencyRepository;
import app.roamfx.user.UserRepository;
import app.roamfx.waitlist.WaitlistRepository;
import java.util.Map;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController @RequestMapping("/api/admin")
public class AdminController {
  private final UserRepository users; private final PartnerRepository partners; private final BookingRepository bookings;
  private final KycDocumentRepository documents; private final CurrencyRepository currencies; private final AuditLogRepository audits;
  private final WaitlistRepository waitlist;
  public AdminController(UserRepository users, PartnerRepository partners, BookingRepository bookings, KycDocumentRepository documents, CurrencyRepository currencies, AuditLogRepository audits, WaitlistRepository waitlist) {
    this.users = users; this.partners = partners; this.bookings = bookings; this.documents = documents; this.currencies = currencies; this.audits = audits;
    this.waitlist = waitlist;
  }
  @GetMapping("/users") Object users(Pageable pageable) { return users.findAll(pageable); }
  @GetMapping("/bookings") Object bookings(Pageable pageable) { return bookings.findAll(pageable); }
  @GetMapping("/audit-logs") Object audits() { return audits.findAll(); }
  @GetMapping("/documents") Object documents() { return documents.findAll(); }
  @GetMapping("/currencies") Object currencies() { return currencies.findAll(); }
  @GetMapping("/waitlist") Object waitlist(Pageable pageable) { return waitlist.findAll(pageable); }
  @GetMapping("/dashboard/summary")
  Map<String, Object> summary() {
    return Map.of("users", users.count(), "partners", partners.count(), "bookings", bookings.count(), "documents", documents.count(),
      "commissionSummary", "Demo MVP placeholder: connect settlement ledger in next iteration.");
  }
}
