package app.roamfx.partner;

import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PartnerInventoryRepository extends JpaRepository<PartnerInventory, UUID> {
  Page<PartnerInventory> findByPartnerId(UUID partnerId, Pageable pageable);
}
