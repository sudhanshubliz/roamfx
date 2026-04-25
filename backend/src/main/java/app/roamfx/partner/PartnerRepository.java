package app.roamfx.partner;

import app.roamfx.common.Enums.VerificationStatus;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PartnerRepository extends JpaRepository<Partner, UUID> {
  Page<Partner> findByVerificationStatusAndCityContainingIgnoreCase(VerificationStatus status, String city, Pageable pageable);
  Page<Partner> findByVerificationStatus(VerificationStatus status, Pageable pageable);
}
