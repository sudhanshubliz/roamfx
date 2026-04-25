package app.roamfx.review;

import app.roamfx.booking.BookingRepository;
import app.roamfx.common.ApiException;
import app.roamfx.common.Enums.BookingStatus;
import app.roamfx.user.UserRepository;
import java.security.Principal;
import java.util.List;
import java.util.UUID;
import org.springframework.web.bind.annotation.*;

@RestController
public class ReviewController {
  private final PartnerReviewRepository reviews;
  private final BookingRepository bookings;
  private final UserRepository users;
  public ReviewController(PartnerReviewRepository reviews, BookingRepository bookings, UserRepository users) { this.reviews = reviews; this.bookings = bookings; this.users = users; }
  public record ReviewRequest(UUID bookingId, int rating, String comment) {}
  @PostMapping("/api/reviews")
  PartnerReview create(@RequestBody ReviewRequest req, Principal principal) {
    var user = users.findByEmailIgnoreCase(principal.getName()).orElseThrow();
    var b = bookings.findById(req.bookingId()).orElseThrow(() -> ApiException.notFound("Booking not found"));
    if (!b.traveller.id.equals(user.id) || b.status != BookingStatus.COMPLETED) throw ApiException.forbidden("Only completed booking users can review partner");
    if (reviews.existsByBookingId(b.id)) throw ApiException.bad("Booking already reviewed");
    var r = new PartnerReview(); r.booking = b; r.partner = b.partner; r.user = user; r.rating = req.rating(); r.comment = req.comment();
    return reviews.save(r);
  }
  @GetMapping("/api/partners/{id}/reviews") List<PartnerReview> list(@PathVariable UUID id) { return reviews.findByPartnerIdOrderByCreatedAtDesc(id); }
}
