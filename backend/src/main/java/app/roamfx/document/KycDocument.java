package app.roamfx.document;

import app.roamfx.booking.Booking;
import app.roamfx.common.BaseEntity;
import app.roamfx.common.Enums.DocumentStatus;
import app.roamfx.common.Enums.DocumentType;
import app.roamfx.user.UserAccount;
import jakarta.persistence.*;
import java.util.UUID;

@Entity @Table(name = "kyc_documents")
public class KycDocument extends BaseEntity {
  @Id @GeneratedValue public UUID id;
  @ManyToOne(optional = false) @JoinColumn(name = "user_id") public UserAccount user;
  @ManyToOne @JoinColumn(name = "booking_id") public Booking booking;
  @Enumerated(EnumType.STRING) public DocumentType documentType;
  public String fileName;
  public String fileUrl;
  @Enumerated(EnumType.STRING) public DocumentStatus verificationStatus = DocumentStatus.UPLOADED;
  public String rejectionReason;
}
