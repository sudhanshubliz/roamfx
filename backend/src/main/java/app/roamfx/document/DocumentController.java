package app.roamfx.document;

import app.roamfx.admin.AuditService;
import app.roamfx.booking.BookingRepository;
import app.roamfx.common.ApiException;
import app.roamfx.common.Enums.DocumentStatus;
import app.roamfx.common.Enums.DocumentType;
import app.roamfx.user.UserRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.security.Principal;
import java.util.List;
import java.util.UUID;
import org.springframework.web.bind.annotation.*;

@RestController
public class DocumentController {
  private final KycDocumentRepository documents;
  private final UserRepository users;
  private final BookingRepository bookings;
  private final AuditService audits;
  public DocumentController(KycDocumentRepository documents, UserRepository users, BookingRepository bookings, AuditService audits) {
    this.documents = documents; this.users = users; this.bookings = bookings; this.audits = audits;
  }
  public record UploadDocumentRequest(UUID bookingId, @NotNull DocumentType documentType, @NotBlank String fileName, @NotBlank String fileUrl) {}
  public record DocumentView(UUID id, UUID bookingId, DocumentType documentType, String fileName, String fileUrl, DocumentStatus verificationStatus,
    String rejectionReason, java.time.Instant createdAt, String nextAction) {
    static DocumentView from(KycDocument d) {
      var nextAction = switch (d.verificationStatus) {
        case VERIFIED -> "Verified. Keep original document ready for partner fulfilment checks.";
        case REJECTED -> d.rejectionReason == null ? "Rejected. Upload corrected metadata." : "Rejected: " + d.rejectionReason;
        case UNDER_REVIEW -> "Partner/admin compliance team is reviewing this metadata.";
        case UPLOADED -> "Queued for review. Do not share raw sensitive values in notes or filenames.";
      };
      return new DocumentView(d.id, d.booking == null ? null : d.booking.id, d.documentType, d.fileName, d.fileUrl, d.verificationStatus, d.rejectionReason, d.createdAt, nextAction);
    }
  }

  @PostMapping("/api/documents")
  KycDocument upload(@Valid @RequestBody UploadDocumentRequest req, Principal principal) {
    var d = new KycDocument();
    d.user = users.findByEmailIgnoreCase(principal.getName()).orElseThrow();
    if (req.bookingId() != null) d.booking = bookings.findById(req.bookingId()).orElseThrow(() -> ApiException.notFound("Booking not found"));
    d.documentType = req.documentType(); d.fileName = req.fileName(); d.fileUrl = req.fileUrl();
    return documents.save(d);
  }
  @GetMapping("/api/documents/my")
  List<DocumentView> my(Principal principal) {
    var user = users.findByEmailIgnoreCase(principal.getName()).orElseThrow();
    return documents.findByUserIdOrderByCreatedAtDesc(user.id).stream().map(DocumentView::from).toList();
  }
  @GetMapping("/api/bookings/{id}/documents") List<KycDocument> byBooking(@PathVariable UUID id) { return documents.findByBookingId(id); }
  @PutMapping("/api/admin/documents/{id}/verify") KycDocument verify(@PathVariable UUID id, Principal principal) { return status(id, DocumentStatus.VERIFIED, null, principal); }
  @PutMapping("/api/admin/documents/{id}/reject") KycDocument reject(@PathVariable UUID id, @RequestParam String reason, Principal principal) { return status(id, DocumentStatus.REJECTED, reason, principal); }
  private KycDocument status(UUID id, DocumentStatus status, String reason, Principal principal) {
    var d = documents.findById(id).orElseThrow(() -> ApiException.notFound("Document not found"));
    d.verificationStatus = status; d.rejectionReason = reason;
    var saved = documents.save(d);
    audits.log(principal.getName(), "KYC_DOCUMENT_" + status, "KYC_DOCUMENT", saved.id.toString(), reason);
    return saved;
  }
}
