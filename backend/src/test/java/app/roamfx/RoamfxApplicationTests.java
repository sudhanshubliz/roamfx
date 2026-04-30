package app.roamfx;

import static org.assertj.core.api.Assertions.assertThatThrownBy;

import app.roamfx.booking.Booking;
import app.roamfx.booking.BookingService;
import app.roamfx.common.Enums.BookingType;
import app.roamfx.common.Enums.FulfilmentMode;
import app.roamfx.common.Enums.PaymentMode;
import app.roamfx.config.AppProperties;
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

  @Test void quoteBreakdownIncludesTaxesFulfilmentAndKycSignal() {
    var service = new BookingService(null, null, null, null,
      new AppProperties("test-secret-test-secret-test-secret", 60, "http://localhost:3000", 30, 8));
    var quote = service.calculate(BookingType.BUY_FOREX, BigDecimal.valueOf(1000), BigDecimal.valueOf(91.32),
      BigDecimal.valueOf(90.90), BigDecimal.valueOf(0.45), BigDecimal.valueOf(220), PaymentMode.UPI, FulfilmentMode.DELIVERY);

    org.assertj.core.api.Assertions.assertThat(quote.totalPayable()).isEqualByComparingTo("91829.60");
    org.assertj.core.api.Assertions.assertThat(quote.fulfilmentFee()).isEqualByComparingTo("250");
    org.assertj.core.api.Assertions.assertThat(quote.taxes()).isEqualByComparingTo("39.60");
    org.assertj.core.api.Assertions.assertThat(quote.kycRequired()).isTrue();
    org.assertj.core.api.Assertions.assertThat(quote.cashAllowed()).isTrue();
  }

  @Test void sellBackQuoteProducesPayoutInsteadOfPayable() {
    var service = new BookingService(null, null, null, null,
      new AppProperties("test-secret-test-secret-test-secret", 60, "http://localhost:3000", 30, 8));
    var quote = service.calculate(BookingType.SELL_LEFTOVER_FOREX, BigDecimal.valueOf(500), BigDecimal.valueOf(90.50),
      BigDecimal.valueOf(90.90), BigDecimal.valueOf(0.20), BigDecimal.valueOf(150), PaymentMode.BANK_TRANSFER, FulfilmentMode.STORE_VISIT);

    org.assertj.core.api.Assertions.assertThat(quote.totalPayable()).isEqualByComparingTo("0.00");
    org.assertj.core.api.Assertions.assertThat(quote.payoutAmount()).isEqualByComparingTo("45073.00");
    org.assertj.core.api.Assertions.assertThat(quote.kycRequired()).isTrue();
  }
}
