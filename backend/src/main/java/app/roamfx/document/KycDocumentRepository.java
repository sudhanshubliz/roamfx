package app.roamfx.document;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface KycDocumentRepository extends JpaRepository<KycDocument, UUID> {
  List<KycDocument> findByBookingId(UUID bookingId);
  List<KycDocument> findByUserIdOrderByCreatedAtDesc(UUID userId);
}
