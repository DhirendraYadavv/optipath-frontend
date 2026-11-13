import React from "react";
import Link from "next/link";
import { ArrowRight, Building2, CheckCircle2, GraduationCap, Lock, ShieldCheck, Target, Zap } from "lucide-react";
import { GATEWAY_HEADING, GATEWAY_METRICS, GATEWAY_SUBTITLE, RECRUITER_CARD, STUDENT_CARD, type GatewayCard } from "@/lib/gatewayContent";

const METRIC_ICONS = [GraduationCap, Target, Lock, Zap];

function Card({ card, icon: Icon, tone }: { card: GatewayCard; icon: typeof Building2; tone: "indigo" | "cyan" }) {
  const accent = tone === "indigo" ? "from-indigo-500/15" : "from-cyan-500/15";
  const badge = tone === "indigo" ? "bg-indigo-50 text-indigo-900 border-indigo-200" : "bg-cyan-50 text-cyan-900 border-cyan-200";
  return (
    <article className={`relative flex flex-col rounded-3xl border border-[#D5E1EE] bg-linear-to-br ${accent} via-white to-white p-6 sm:p-8 shadow-lg`}>
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-white border border-[#DCE7F2] shadow-xs flex items-center justify-center shrink-0">
          <Icon className="w-6 h-6 text-[#0060AA]" />
        </div>
        <h3 className="font-heading text-xl sm:text-2xl font-bold leading-tight text-[#0E1726]">{card.title}</h3>
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        {card.badges.map((b) => (
          <span key={b} className={`px-3 py-1 rounded-full border text-[11px] font-bold ${badge}`}>
            {b}
          </span>
        ))}
      </div>

      <ul className="mt-5 space-y-3 flex-1">
        {card.points.map((p) => (
          <li key={p} className="flex items-start gap-2.5 text-sm text-[#334155] leading-relaxed">
            <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-emerald-700" />
            <span>{p}</span>
          </li>
        ))}
      </ul>

      <Link
        href={card.href}
        className="group mt-7 inline-flex items-center justify-center gap-2 w-full sm:w-auto self-stretch sm:self-start px-8 py-4 bg-[#0060AA] hover:bg-[#004D8A] text-white text-sm font-bold tracking-wide rounded-full shadow-md hover:shadow-lg transition"
      >
        <span>{card.cta}</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </Link>
    </article>
  );
}

export default function TalentGateway() {
  return (
    <section id="talent-gateway" aria-labelledby="talent-gateway-heading" className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-20 scroll-mt-24">
      {/* gradient glow border */}
      <div className="rounded-[2rem] bg-linear-to-br from-indigo-500/40 via-[#0060AA]/40 to-cyan-500/40 p-0.5 shadow-2xl shadow-indigo-900/10">
        <div className="relative overflow-hidden rounded-[calc(2rem-2px)] bg-white/90 backdrop-blur-md ring-2 ring-[#0060AA]/10 px-5 sm:px-10 lg:px-14 py-10 sm:py-14">
          <div aria-hidden="true" className="pointer-events-none absolute -top-24 -left-24 w-80 h-80 rounded-full bg-indigo-400/20 blur-3xl" />
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-cyan-400/20 blur-3xl" />

          <div className="relative text-center max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase tracking-wider text-[#0060AA]">
              <ShieldCheck className="w-3.5 h-3.5" /> Talent &amp; Career Gateway
            </span>
            <h2 id="talent-gateway-heading" className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold mt-2 text-[#0E1726] leading-tight">
              {GATEWAY_HEADING}
            </h2>
            <p className="mt-4 text-base sm:text-lg text-[#526173] leading-relaxed">{GATEWAY_SUBTITLE}</p>
          </div>

          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mt-10 sm:mt-12">
            <Card card={RECRUITER_CARD} icon={Building2} tone="indigo" />
            <Card card={STUDENT_CARD} icon={GraduationCap} tone="cyan" />
          </div>

          <ul className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-8 sm:mt-10" aria-label="Platform facts">
            {GATEWAY_METRICS.map((m, i) => {
              const Icon = METRIC_ICONS[i] ?? Zap;
              return (
                <li key={m.title} className="flex items-start gap-3 rounded-2xl border border-[#D5E1EE] bg-[#F4F8FC]/80 px-4 py-3.5">
                  <Icon className="w-5 h-5 mt-0.5 shrink-0 text-[#0060AA]" />
                  <div>
                    <p className="text-sm font-bold text-[#0E1726]">{m.title}</p>
                    <p className="text-xs text-[#526173] mt-0.5">{m.detail}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
