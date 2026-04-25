package app.roamfx.booking;

import app.roamfx.admin.AuditService;
import app.roamfx.common.ApiException;
import app.roamfx.common.Enums.BookingStatus;
import jakarta.validation.Valid;
import java.security.Principal;
import java.time.Instant;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
public class BookingController {
  private final BookingService service;
  private final BookingRepository bookings;
  private final AuditService audits;
  public BookingController(BookingService service, BookingRepository bookings, AuditService audits) { this.service = service; this.bookings = bookings; this.audits = audits; }

  @PostMapping("/api/bookings")
  Booking create(@Valid @RequestBody BookingService.CreateBookingRequest req, Principal principal) { return service.create(principal.getName(), req); }

  @GetMapping("/api/bookings/my")
  Page<Booking> my(Principal principal, app.roamfx.user.UserRepository users, Pageable pageable) {
    var u = users.findByEmailIgnoreCase(principal.getName()).orElseThrow();
    return bookings.findByTravellerIdOrderByCreatedAtDesc(u.id, pageable);
  }

  @GetMapping("/api/bookings/{id}")
  Booking get(@PathVariable UUID id) {
    var b = bookings.findById(id).orElseThrow(() -> ApiException.notFound("Booking not found"));
    expireIfNeeded(b);
    return b;
  }
  @PutMapping("/api/bookings/{id}/cancel")
  Booking cancel(@PathVariable UUID id, Principal principal) {
    var b = bookings.findById(id).orElseThrow(() -> ApiException.notFound("Booking not found"));
    if (b.status == BookingStatus.CONFIRMED || b.status == BookingStatus.COMPLETED) throw ApiException.bad("Cannot cancel after confirmation");
    b.status = BookingStatus.CANCELLED;
    var saved = bookings.save(b);
    audits.log(principal.getName(), "BOOKING_CANCELLED", "BOOKING", saved.id.toString(), saved.bookingReference);
    return saved;
  }
  @PutMapping("/api/partner/bookings/{id}/confirm") Booking confirm(@PathVariable UUID id, Principal principal) { return status(id, BookingStatus.CONFIRMED, principal); }
  @PutMapping("/api/partner/bookings/{id}/reject") Booking reject(@PathVariable UUID id, Principal principal) { return status(id, BookingStatus.REJECTED, principal); }
  @PutMapping("/api/partner/bookings/{id}/complete") Booking complete(@PathVariable UUID id, Principal principal) { return status(id, BookingStatus.COMPLETED, principal); }
  private Booking status(UUID id, BookingStatus status, Principal principal) {
    var b = bookings.findById(id).orElseThrow(() -> ApiException.notFound("Booking not found"));
    expireIfNeeded(b);
    var previous = b.status;
    b.status = status;
    var saved = bookings.save(b);
    audits.log(principal.getName(), "BOOKING_STATUS_CHANGED", "BOOKING", saved.id.toString(), previous + " -> " + status);
    return saved;
  }
  private void expireIfNeeded(Booking b) {
    if (b.rateLockExpiresAt != null && Instant.now().isAfter(b.rateLockExpiresAt) && b.status == BookingStatus.RATE_LOCKED) {
      b.status = BookingStatus.EXPIRED; bookings.save(b);
    }
  }
}
