package app.roamfx.notification;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class EmailNotificationService {
  private static final Logger log = LoggerFactory.getLogger(EmailNotificationService.class);

  public void sendWaitlistConfirmation(String email, String name) {
    // TODO: Integrate SES, SendGrid, Postmark, or another transactional email provider.
    log.info("Email placeholder: waitlist confirmation queued for {}", email);
  }
}
