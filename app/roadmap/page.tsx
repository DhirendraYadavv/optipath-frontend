import Link from "next/link";

export default function ComingSoonPage() {
  return (
    <div className="min-h-screen bg-[#F4F8FC] text-[#0E1726] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white border border-[#D5E1EE] rounded-3xl p-8 text-center space-y-4 shadow-xs">
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#0060AA]">OptiPath Phase 2</span>
        <h1 className="font-heading text-2xl font-bold">Coming soon</h1>
        <p className="text-xs text-[#526173] leading-relaxed">This section is not available yet. You can check your readiness and find openings from the home page.</p>
        <Link href="/" className="inline-block px-6 py-2.5 bg-[#0060AA] hover:bg-[#004D8A] text-white text-xs font-bold rounded-xl transition">
          Back to home
        </Link>
      </div>
    </div>
  );
}
