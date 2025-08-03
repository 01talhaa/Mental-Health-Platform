
import React, { Suspense } from "react";
import TherapistDetailClient from "@/components/Therapists/TherapistDetailClient";

export default function TherapistDetail() {
  return (
    <Suspense fallback={<div className="text-center mt-20">Loading...</div>}>
      <TherapistDetailClient />
    </Suspense>
  );
}