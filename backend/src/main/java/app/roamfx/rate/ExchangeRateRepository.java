package app.roamfx.rate;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ExchangeRateRepository extends JpaRepository<ExchangeRate, UUID> {
  @Query("select r from ExchangeRate r where upper(r.sourceCurrency)=upper(?1) and upper(r.targetCurrency)=upper(?2) and r.partner.verificationStatus='VERIFIED'")
  List<ExchangeRate> searchVerified(String sourceCurrency, String targetCurrency);
  List<ExchangeRate> findByPartnerId(UUID partnerId);
}
