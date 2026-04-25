package app.roamfx.review;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PartnerReviewRepository extends JpaRepository<PartnerReview, UUID> {
  List<PartnerReview> findByPartnerIdOrderByCreatedAtDesc(UUID partnerId);
  boolean existsByBookingId(UUID bookingId);
}
