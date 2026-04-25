package app.roamfx.community;

import app.roamfx.common.BaseEntity;
import app.roamfx.common.Enums.CommunityPostStatus;
import app.roamfx.common.Enums.CommunityPostType;
import app.roamfx.user.UserAccount;
import jakarta.persistence.*;
import java.util.UUID;

@Entity @Table(name = "community_posts")
public class CommunityPost extends BaseEntity {
  @Id @GeneratedValue public UUID id;
  @ManyToOne(optional = false) @JoinColumn(name = "user_id") public UserAccount user;
  @Enumerated(EnumType.STRING) public CommunityPostType postType;
  public String destinationCountry;
  public String currencyCode;
  @Column(length = 1600) public String content;
  @Enumerated(EnumType.STRING) public CommunityPostStatus status = CommunityPostStatus.ACTIVE;
}
