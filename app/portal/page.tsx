import React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Building2, GraduationCap } from "lucide-react";

export const metadata = { title: "Talent Portal | OptiPath" };

const CARDS = [
  {
    href: "/recruiter",
    icon: Building2,
    title: "For Recruiters & Corporate Partners",
    action: "Access Campus Talent",
    text: "Verified corporate HR only. Search SGT Online candidates by career track and contact them directly.",
    note: "Needs your official company email.",
  },
  {
    href: "/portal/student",
    icon: GraduationCap,
    title: "For SGT Students & Alumni",
    action: "Resume Gap Analysis & Optimization",
    text: "Check your resume against a target role, see Foundation and Production gaps, and choose whether to join the Talent Pool.",
    note: "Needs your SGT registration number and date of birth.",
  },
];

export default function PortalGateway() {
  return (
    <main className="min-h-screen bg-[#FAF8F5] text-[#0E1726]">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#831843] hover:underline">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to home
        </Link>
        <h1 className="font-serif text-3xl font-bold mt-4">OptiPath Talent Portal</h1>
        <p className="text-sm text-[#526173] mt-1">Choose how you want to enter. Each side is separate and protected.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8">
          {CARDS.map(({ href, icon: Icon, title, action, text, note }) => (
            <Link key={href} href={href} className="group bg-white border border-[#E5DFD5] hover:border-[#831843] rounded-3xl p-7 shadow-xs transition flex flex-col">
              <div className="w-11 h-11 rounded-2xl bg-[#FAF8F5] border border-[#EAE4D9] flex items-center justify-center mb-4">
                <Icon className="w-5 h-5 text-[#831843]" />
              </div>
              <h2 className="font-serif text-xl font-bold">{title}</h2>
              <p className="text-xs font-bold text-[#831843] mt-1">{action}</p>
              <p className="text-xs text-[#526173] mt-3 leading-relaxed flex-1">{text}</p>
              <p className="text-[11px] text-[#64748B] mt-3">{note}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-[#831843]">
                Continue <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
