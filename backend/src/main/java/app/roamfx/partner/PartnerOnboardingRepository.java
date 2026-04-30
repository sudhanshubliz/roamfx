package app.roamfx.partner;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PartnerOnboardingRepository extends JpaRepository<PartnerOnboarding, UUID> {
  Optional<PartnerOnboarding> findByPartnerId(UUID partnerId);
}
