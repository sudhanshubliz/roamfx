package app.roamfx.booking;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookingRepository extends JpaRepository<Booking, UUID> {
  Page<Booking> findByTravellerIdOrderByCreatedAtDesc(UUID travellerId, Pageable pageable);
  Page<Booking> findByPartnerIdOrderByCreatedAtDesc(UUID partnerId, Pageable pageable);
  Optional<Booking> findByIdAndTravellerId(UUID id, UUID travellerId);
  Optional<Booking> findByIdempotencyKey(String idempotencyKey);
}
