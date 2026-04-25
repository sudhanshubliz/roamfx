package app.roamfx.admin;

import app.roamfx.common.BaseEntity;
import jakarta.persistence.*;
import java.util.UUID;

@Entity @Table(name = "audit_logs")
public class AuditLog extends BaseEntity {
  @Id @GeneratedValue public UUID id;
  public String actorEmail;
  public String action;
  public String targetType;
  public String targetId;
  @Column(length = 1200) public String metadata;
}
