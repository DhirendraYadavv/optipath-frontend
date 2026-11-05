"use client";

import React from "react";
import { GOAL_ROLES, TRACK_LABELS, type GoalTrack } from "@/data/goalRoles";

const tracks = Object.keys(TRACK_LABELS) as GoalTrack[];

/** Dropdown limited to the SGT goal roles in data/goalRoles.ts. */
export default function RoleSelect({ id, value, onChange, placeholder = "Select a role" }: { id: string; value: string; onChange: (role: string) => void; placeholder?: string }) {
  return (
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full p-3 bg-[#FAF8F5] border border-[#DDD8CE] rounded-xl text-xs outline-none focus:border-[#831843]"
    >
      <option value="">{placeholder}</option>
      {tracks.map((t) => (
        <optgroup key={t} label={TRACK_LABELS[t]}>
          {GOAL_ROLES.filter((r) => r.track === t).map((r) => (
            <option key={r.title} value={r.title}>
              {r.title}
            </option>
          ))}
        </optgroup>
      ))}
    </select>
  );
}
