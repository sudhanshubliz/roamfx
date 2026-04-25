package app.roamfx.admin;

import org.springframework.stereotype.Service;

@Service
public class AuditService {
  private final AuditLogRepository audits;
  public AuditService(AuditLogRepository audits) { this.audits = audits; }
  public void log(String actorEmail, String action, String targetType, String targetId, String metadata) {
    var log = new AuditLog();
    log.actorEmail = actorEmail;
    log.action = action;
    log.targetType = targetType;
    log.targetId = targetId;
    log.metadata = metadata;
    audits.save(log);
  }
}
