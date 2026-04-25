package app.roamfx.community;

import app.roamfx.common.Enums.CommunityPostStatus;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommunityPostRepository extends JpaRepository<CommunityPost, UUID> {
  Page<CommunityPost> findByStatusOrderByCreatedAtDesc(CommunityPostStatus status, Pageable pageable);
}
