import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import TalentGateway from "@/components/TalentGateway";

export const metadata = { title: "Talent & Career Gateway | OptiPath" };

export default function PortalGateway() {
  return (
    <main className="min-h-screen bg-[#FAF8F5] text-[#0E1726]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#831843] hover:underline">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to home
        </Link>
      </div>
      <TalentGateway />
    </main>
  );
}
