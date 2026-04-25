"use client";
import { useQuery } from "@tanstack/react-query";
import { IndianRupee, ShieldCheck } from "lucide-react";
import { api, RateView } from "@/lib/api";
import { trackEvent } from "@/lib/analytics";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import * as React from "react";

export function RateComparison() {
  const [source, setSource] = React.useState("USD");
  const [sort, setSort] = React.useState("best-rate");
  const { data, isLoading, error } = useQuery({ queryKey: ["rates", source, sort], queryFn: () => {
    trackEvent("rate_search_started", { sourceCurrency: source, targetCurrency: "INR", sort });
    return api<RateView[]>(`/api/rates/search?sourceCurrency=${source}&targetCurrency=INR&sort=${sort}`);
  } });
  return <Card>
    <CardHeader>
      <CardTitle>Compare verified partner rates</CardTitle>
      <CardDescription>Live buy/sell rates with fee visibility, freshness, and suspicious-rate warnings.</CardDescription>
    </CardHeader>
    <CardContent className="flex flex-col gap-4">
      <div className="grid gap-3 md:grid-cols-4">
        <Select value={source} onChange={(e) => setSource(e.target.value)}>{["USD","EUR","GBP","AED","SGD","THB","JPY"].map(c => <option key={c}>{c}</option>)}</Select>
        <Input value="INR" readOnly />
        <Select value={sort} onChange={(e) => setSort(e.target.value)}><option value="best-rate">Best rate</option><option value="rating">Rating</option><option value="delivery">Delivery</option></Select>
        <Button><IndianRupee data-icon="inline-start" /> Reserve rate</Button>
      </div>
      {isLoading ? <div className="rounded-lg border p-6 text-sm text-muted-foreground">Loading rates...</div> : null}
      {error ? <div className="rounded-lg border p-6 text-sm text-destructive">Could not load rates. Start the backend or try again.</div> : null}
      {data?.length === 0 ? <div className="rounded-lg border p-6 text-sm text-muted-foreground">No verified partner rates found.</div> : null}
      {data?.length ? <Table><TableHeader><TableRow><TableHead>Partner</TableHead><TableHead>Sell</TableHead><TableHead>Fee</TableHead><TableHead>Freshness</TableHead><TableHead>Trust</TableHead></TableRow></TableHeader><TableBody>
        {data.map(rate => <TableRow key={rate.id}><TableCell className="font-medium">{rate.partnerName}</TableCell><TableCell>₹{Number(rate.sellRate).toFixed(2)}</TableCell><TableCell>₹{Number(rate.serviceFee).toFixed(0)}</TableCell><TableCell>{rate.freshness}</TableCell><TableCell><div className="flex flex-wrap gap-2"><Badge variant="outline"><ShieldCheck data-icon="inline-start" /> Verified</Badge>{rate.suspicious ? <Badge variant="destructive">Check markup</Badge> : <Badge variant="secondary">Fair band</Badge>}</div></TableCell></TableRow>)}
      </TableBody></Table> : null}
    </CardContent>
  </Card>;
}
