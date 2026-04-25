package app.roamfx.community;

import app.roamfx.booking.BookingService;
import app.roamfx.common.Enums.CommunityPostStatus;
import app.roamfx.common.Enums.CommunityPostType;
import app.roamfx.user.UserRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.security.Principal;
import java.util.Map;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
public class CommunityController {
  private final CommunityPostRepository posts;
  private final UserRepository users;
  private final BookingService bookings;
  public CommunityController(CommunityPostRepository posts, UserRepository users, BookingService bookings) { this.posts = posts; this.users = users; this.bookings = bookings; }

  @GetMapping("/api/community/posts") Page<CommunityPost> list(Pageable pageable) { return posts.findByStatusOrderByCreatedAtDesc(CommunityPostStatus.ACTIVE, pageable); }
  @PostMapping("/api/community/posts")
  Object create(@Valid @RequestBody PostRequest req, Principal principal) {
    if (req.postType() == CommunityPostType.LEFTOVER_CURRENCY_REQUEST && req.sellBooking() != null) {
      return Map.of(
        "warning", "RoamFX does not support unlicensed peer-to-peer currency exchange. Transactions must be completed through verified authorised partners.",
        "booking", bookings.create(principal.getName(), req.sellBooking()));
    }
    var p = new CommunityPost();
    p.user = users.findByEmailIgnoreCase(principal.getName()).orElseThrow();
    p.postType = req.postType(); p.destinationCountry = req.destinationCountry(); p.currencyCode = req.currencyCode(); p.content = req.content();
    return posts.save(p);
  }
  @PostMapping("/api/community/posts/{id}/flag") CommunityPost flag(@PathVariable UUID id) {
    var p = posts.findById(id).orElseThrow(); p.status = CommunityPostStatus.FLAGGED; return posts.save(p);
  }
  public record PostRequest(@NotNull CommunityPostType postType, String destinationCountry, String currencyCode, @NotBlank String content,
    BookingService.CreateBookingRequest sellBooking) {}
}
