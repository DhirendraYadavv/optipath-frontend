import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import PlacementDashboard from "@/components/placement/PlacementDashboard";

export const metadata = { title: "Placement Cell | OptiPath" };

export default function PlacementPage() {
  return (
    <main className="min-h-screen bg-[#F4F8FC] text-[#0E1726]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-5">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0060AA] hover:underline">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to home
        </Link>
        <h1 className="font-heading text-3xl font-bold">Placement-cell view</h1>
        <PlacementDashboard />
      </div>
    </main>
  );
}
