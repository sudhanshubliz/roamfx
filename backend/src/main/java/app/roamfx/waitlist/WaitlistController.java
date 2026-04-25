package app.roamfx.waitlist;

import app.roamfx.analytics.AnalyticsService;
import app.roamfx.common.Enums.AnalyticsEventType;
import app.roamfx.common.Enums.WaitlistInterest;
import app.roamfx.notification.EmailNotificationService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.Map;
import org.springframework.web.bind.annotation.*;

@RestController
public class WaitlistController {
  private final WaitlistRepository waitlist;
  private final EmailNotificationService email;
  private final AnalyticsService analytics;

  public WaitlistController(WaitlistRepository waitlist, EmailNotificationService email, AnalyticsService analytics) {
    this.waitlist = waitlist;
    this.email = email;
    this.analytics = analytics;
  }

  public record WaitlistRequest(
    @NotBlank String name,
    @Email @NotBlank String email,
    String phone,
    @NotBlank String city,
    @NotBlank String nextTravelDestination,
    LocalDate expectedTravelDate,
    @NotNull WaitlistInterest interestedIn
  ) {}

  @PostMapping("/api/waitlist")
  WaitlistEntry join(@Valid @RequestBody WaitlistRequest req) {
    var entry = new WaitlistEntry();
    entry.name = req.name();
    entry.email = req.email().toLowerCase();
    entry.phone = req.phone();
    entry.city = req.city();
    entry.nextTravelDestination = req.nextTravelDestination();
    entry.expectedTravelDate = req.expectedTravelDate();
    entry.interestedIn = req.interestedIn();
    var saved = waitlist.save(entry);
    email.sendWaitlistConfirmation(saved.email, saved.name);
    analytics.track(AnalyticsEventType.WAITLIST_JOINED, Map.of("city", saved.city, "interestedIn", saved.interestedIn.name()));
    return saved;
  }
}
