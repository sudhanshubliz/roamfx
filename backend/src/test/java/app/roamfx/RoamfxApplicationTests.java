package app.roamfx;

import static org.assertj.core.api.Assertions.assertThatThrownBy;

import app.roamfx.booking.Booking;
import app.roamfx.booking.BookingService;
import app.roamfx.common.Enums.PaymentMode;
import java.math.BigDecimal;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class RoamfxApplicationTests {
  @Test void contextLoads() {}

  @Test void cashPaymentIsBlockedAtThreshold() {
    var b = new Booking();
    b.paymentMode = PaymentMode.CASH;
    b.targetCurrency = "INR";
    b.targetAmountEstimate = BigDecimal.valueOf(50_000);
    assertThatThrownBy(() -> new BookingService(null, null, null, null, null).enforceCashRule(b))
      .hasMessageContaining("cannot use CASH");
  }
}
