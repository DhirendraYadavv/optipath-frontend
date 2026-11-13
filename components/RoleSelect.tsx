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
      className="w-full p-3 bg-[#F4F8FC] border border-[#C8D7E8] rounded-xl text-xs outline-none focus:border-[#0060AA]"
    >
      <option value="">{placeholder}</option>
      {tracks.flatMap((t) =>
        Array.from(new Set(GOAL_ROLES.filter((r) => r.track === t).map((r) => r.category))).map((cat) => (
          <optgroup key={`${t}-${cat}`} label={`${TRACK_LABELS[t].split(" (")[0]}: ${cat}`}>
            {GOAL_ROLES.filter((r) => r.track === t && r.category === cat).map((r) => (
              <option key={r.title} value={r.title}>
                {r.title}
              </option>
            ))}
          </optgroup>
        )),
      )}
    </select>
  );
}
