package app.roamfx.waitlist;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WaitlistRepository extends JpaRepository<WaitlistEntry, UUID> {}
