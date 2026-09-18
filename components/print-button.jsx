"use client";

import { Button } from "@/components/ui/button";

export default function PrintButton() {
  return (
    <Button
      type="button"
      variant="outline"
      className="print:hidden"
      onClick={() => window.print()}
      aria-label="Open print dialog to save report as PDF"
    >
      Save as PDF
    </Button>
  );
}
