"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, CheckCircle2, FileText, ShieldCheck, UploadCloud } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { ComplianceBanner } from "@/components/compliance-banner";
import { RoleGuard } from "@/components/role-guard";
import { api, type KycDocumentView } from "@/lib/api";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

const checklist = [
  { type: "PASSPORT", title: "Passport", rule: "Usually required for foreign travel forex." },
  { type: "PAN", title: "PAN", rule: "Required for KYC and higher-value INR transactions." },
  { type: "VISA", title: "Visa", rule: "Required when destination requires visa proof." },
  { type: "FLIGHT_TICKET", title: "Flight ticket", rule: "Helps partner verify travel purpose and date." },
  { type: "CURRENCY_DECLARATION_FORM", title: "Declaration form", rule: "Often required for leftover currency sell-back." }
] as const;

export default function Page() {
  const queryClient = useQueryClient();
  const [documentType, setDocumentType] = useState<KycDocumentView["documentType"]>("PASSPORT");
  const [fileName, setFileName] = useState("passport-metadata.pdf");
  const [bookingId, setBookingId] = useState("bkg_10482");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const docs = useQuery({ queryKey: ["documents-my"], queryFn: () => api<KycDocumentView[]>("/api/documents/my") });

  async function upload() {
    setSubmitting(true);
    setMessage("");
    try {
      await api<KycDocumentView>("/api/documents", {
        method: "POST",
        body: JSON.stringify({
          bookingId,
          documentType,
          fileName,
          fileUrl: `local://${fileName}`
        })
      });
      setMessage("Document metadata uploaded. Keep originals ready for authorised partner verification.");
      await queryClient.invalidateQueries({ queryKey: ["documents-my"] });
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not upload document metadata");
    } finally {
      setSubmitting(false);
    }
  }

  return <AppShell>
    <RoleGuard allow={["TRAVELLER"]}>
      <main className="mx-auto grid max-w-7xl gap-5 px-4 py-6 lg:grid-cols-[0.85fr_1.15fr]">
        <section className="flex flex-col gap-5">
          <div>
            <Badge variant="secondary"><ShieldCheck data-icon="inline-start" /> KYC metadata</Badge>
            <h1 className="mt-3 text-3xl font-semibold">Documents and KYC status</h1>
            <p className="mt-2 text-muted-foreground">Upload document metadata for partner review. Do not put sensitive raw numbers in notes or filenames.</p>
          </div>
          <ComplianceBanner />

          <Card>
            <CardHeader>
              <CardTitle>Upload metadata</CardTitle>
              <CardDescription>Local file storage can be replaced with secure object storage later; this screen keeps the workflow usable now.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              <label className="grid gap-1 text-sm font-medium">Booking reference or ID<Input value={bookingId} onChange={(event) => setBookingId(event.target.value)} /></label>
              <label className="grid gap-1 text-sm font-medium">Document type<Select value={documentType} onChange={(event) => setDocumentType(event.target.value as KycDocumentView["documentType"])}>{checklist.map((item) => <option key={item.type} value={item.type}>{item.title}</option>)}</Select></label>
              <label className="grid gap-1 text-sm font-medium">File name<Input value={fileName} onChange={(event) => setFileName(event.target.value)} placeholder="passport-metadata.pdf" /></label>
              <Button onClick={upload} disabled={submitting || !fileName.trim()}><UploadCloud data-icon="inline-start" /> {submitting ? "Uploading..." : "Upload metadata"}</Button>
              {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
            </CardContent>
          </Card>

          <Alert className="border-amber-300 bg-amber-50">
            <AlertTriangle data-icon="inline-start" />
            <AlertTitle>Privacy guardrail</AlertTitle>
            <AlertDescription>RoamFX should store only required metadata and secure document links. Never log passport, PAN, or ticket raw data.</AlertDescription>
          </Alert>
        </section>

        <section className="flex flex-col gap-5">
          <Card>
            <CardHeader><CardTitle>KYC checklist</CardTitle><CardDescription>Actionable document status for buying forex or selling leftovers.</CardDescription></CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-2">
              {checklist.map((item) => {
                const uploaded = docs.data?.find((doc) => doc.documentType === item.type);
                return <div key={item.type} className="rounded-lg border p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div><div className="font-semibold">{item.title}</div><div className="mt-1 text-sm text-muted-foreground">{item.rule}</div></div>
                    <StatusBadge status={uploaded?.verificationStatus} />
                  </div>
                  <div className="mt-3 text-sm text-muted-foreground">{uploaded?.nextAction ?? "Upload metadata when requested by booking flow or partner review."}</div>
                </div>;
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Uploaded documents</CardTitle><CardDescription>Review status, rejection feedback, and next action.</CardDescription></CardHeader>
            <CardContent className="grid gap-3">
              {docs.isLoading ? <div className="rounded-lg border p-4 text-sm text-muted-foreground">Loading document metadata...</div> : null}
              {docs.error ? <div className="rounded-lg border p-4 text-sm text-destructive">Could not load documents.</div> : null}
              {docs.data?.length === 0 ? <div className="rounded-lg border p-4 text-sm text-muted-foreground">No documents uploaded yet.</div> : null}
              {docs.data?.map((doc) => <article key={doc.id} className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex gap-3">
                  <span className="grid size-10 place-items-center rounded-md bg-teal-50 text-teal-800"><FileText /></span>
                  <div>
                    <div className="font-semibold">{doc.documentType.replaceAll("_", " ")}</div>
                    <div className="text-sm text-muted-foreground">{doc.fileName} · {doc.bookingId ?? "Profile-level"}</div>
                    {doc.rejectionReason ? <div className="mt-1 text-sm text-destructive">{doc.rejectionReason}</div> : null}
                  </div>
                </div>
                <StatusBadge status={doc.verificationStatus} />
              </article>)}
            </CardContent>
          </Card>
        </section>
      </main>
    </RoleGuard>
  </AppShell>;
}

function StatusBadge({ status }: { status?: KycDocumentView["verificationStatus"] }) {
  if (status === "VERIFIED") return <Badge variant="secondary"><CheckCircle2 data-icon="inline-start" /> Verified</Badge>;
  if (status === "REJECTED") return <Badge variant="destructive">Rejected</Badge>;
  if (status === "UNDER_REVIEW") return <Badge variant="outline">Under review</Badge>;
  if (status === "UPLOADED") return <Badge>Uploaded</Badge>;
  return <Badge variant="outline">Needed</Badge>;
}
