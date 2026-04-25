"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
export function Select({ className, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={cn("h-10 w-full rounded-md border bg-background px-3 text-sm focus-visible:outline focus-visible:outline-2", className)} {...props} />;
}
