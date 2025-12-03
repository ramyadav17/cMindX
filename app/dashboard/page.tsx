"use client";

import React, { useEffect, useState } from "react";

type AnalyticsEvent = {
  sessionId: string;
  eventType: string;
  payload: Record<string, unknown>;
  ts: string;
  variantId?: string;
};

type ApiResponse = {
  count: number;
  events: AnalyticsEvent[];
};

type VariantId = "A" | "B";

type VariantStats = {
  variantId: VariantId;
  totalEvents: number;
  sessions: number;
  scrollEvents: number;
  avgScrollPercent: number | null;
  clickEvents: number;
};

function computeVariantStats(events: AnalyticsEvent[]): VariantStats[] {
  const byVariant: Record<VariantId, AnalyticsEvent[]> = {
    A: [],
    B: []
  };

  for (const e of events) {
    const v = (e.variantId as VariantId | undefined) ?? "A";
    if (v === "A" || v === "B") {
      byVariant[v].push(e);
    }
  }

  const stats: VariantStats[] = [];

  for (const variantId of ["A", "B"] as VariantId[]) {
    const ve = byVariant[variantId];
    if (ve.length === 0) {
      stats.push({
        variantId,
        totalEvents: 0,
        sessions: 0,
        scrollEvents: 0,
        avgScrollPercent: null,
        clickEvents: 0
      });
      continue;
    }

    const sessionSet = new Set(ve.map((e) => e.sessionId));

    const scrollEvents = ve.filter((e) => e.eventType === "scroll");
    const scrollPercents = scrollEvents
      .map((e) => e.payload.scrollPercent as number | undefined)
      .filter((v): v is number => typeof v === "number");
    const avgScroll =
      scrollPercents.length > 0
        ? scrollPercents.reduce((sum, v) => sum + v, 0) /
          scrollPercents.length
        : null;

    const clickEvents = ve.filter((e) => e.eventType === "click").length;

    stats.push({
      variantId,
      totalEvents: ve.length,
      sessions: sessionSet.size,
      scrollEvents: scrollEvents.length,
      avgScrollPercent: avgScroll,
      clickEvents
    });
  }

  return stats;
}

export default function DashboardPage() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      const res = await fetch("/api/analytics");
      const json: ApiResponse = await res.json();
      setData(json);
    } catch (e) {
      console.error("Failed to load analytics", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    const id = setInterval(load, 5000); // refresh every 5s
    return () => clearInterval(id);
  }, []);

  const events = data?.events ?? [];
  const uniqueSessions = new Set(events.map((e) => e.sessionId)).size;
  const variantStats = computeVariantStats(events);

  const winner =
    variantStats.length === 2 &&
    variantStats[0].avgScrollPercent !== null &&
    variantStats[1].avgScrollPercent !== null
      ? variantStats[0].avgScrollPercent > variantStats[1].avgScrollPercent
        ? variantStats[0].variantId
        : variantStats[1].variantId
      : null;

  return (
    <div className="retro-bg min-h-screen text-slate-50">
      <div className="mx-auto max-w-6xl px-4 pb-16 pt-6">
        {/* Top HUD bar */}
        <header className="mb-6 flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-slate-300">
          <div className="flex items-center gap-3">
            <div className="pixel-border flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-amber-500 to-rose-500 text-[10px] font-black">
              HUD
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-semibold text-slate-100">
                cMindX Analytics HUD
              </span>
              <div className="flex gap-2 text-[9px] text-slate-400">
                <span>MODE: LIVE TELEMETRY</span>
                <span className="text-lime-300">
                  EVENTS: {data?.count ?? 0}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 text-[9px]">
            <span className="inline-flex items-center gap-1 text-slate-400">
              <span className="status-led" />
              STREAM: ACTIVE
            </span>
            <a
              href="/"
              className="rounded-sm border border-slate-600 bg-slate-900/60 px-3 py-1 text-[9px] font-semibold text-slate-200 hover:border-amber-400 hover:text-amber-200"
            >
              ⬅ BACK TO AGENT
            </a>
          </div>
        </header>

        {loading && (
          <p className="text-[11px] text-slate-300">Loading telemetry…</p>
        )}

        {!loading && (
          <>
            {/* Top stats row */}
            <section className="mb-8 grid gap-4 md:grid-cols-3 text-[11px]">
              <div className="retro-panel scanline-overlay border border-slate-700/80 p-4">
                <p className="text-[9px] uppercase tracking-[0.22em] text-slate-400">
                  TOTAL EVENTS
                </p>
                <p className="mt-2 text-2xl font-semibold text-amber-300">
                  {data?.count ?? 0}
                </p>
                <p className="mt-1 text-[9px] text-slate-500">
                  Pageviews, clicks and scrolls captured for this build.
                </p>
              </div>

              <div className="retro-panel scanline-overlay border border-slate-700/80 p-4">
                <p className="text-[9px] uppercase tracking-[0.22em] text-slate-400">
                  UNIQUE SESSIONS
                </p>
                <p className="mt-2 text-2xl font-semibold text-lime-300">
                  {uniqueSessions}
                </p>
                <p className="mt-1 text-[9px] text-slate-500">
                  Distinct visitors currently represented in the event log.
                </p>
              </div>

              <div className="retro-panel scanline-overlay hud-pulse border border-amber-500/70 p-4">
                <p className="text-[9px] uppercase tracking-[0.22em] text-slate-400">
                  CURRENT WINNER
                </p>
                <p className="mt-2 text-2xl font-semibold text-amber-200">
                  {winner ? `Variant ${winner}` : "—"}
                </p>
                <p className="mt-1 text-[9px] text-slate-500">
                  Based on higher average scroll depth across sessions.
                </p>
              </div>
            </section>

            {/* Variant performance cards */}
            <section className="mb-8">
              <h2 className="mb-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-slate-400">
                VARIANT PERFORMANCE
              </h2>
              <div className="grid gap-4 md:grid-cols-2 text-[11px]">
                {variantStats.map((vs) => (
                  <div
                    key={vs.variantId}
                    className="retro-panel scanline-overlay border border-slate-700/80 p-4"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-sm font-semibold text-slate-50">
                        Variant {vs.variantId}
                      </p>
                      {winner === vs.variantId && (
                        <span className="rounded-full bg-lime-400/15 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-lime-300">
                          LEADING
                        </span>
                      )}
                    </div>
                    <p className="mb-3 text-[10px] text-slate-400">
                      Hero copy + CTA version {vs.variantId}. Tracked using live
                      scroll and click events.
                    </p>

                    <div className="grid grid-cols-2 gap-3 text-[11px]">
                      <div className="rounded border border-slate-700 bg-slate-950/60 px-3 py-2">
                        <p className="text-[9px] text-slate-400">SESSIONS</p>
                        <p className="text-sm font-semibold text-slate-50">
                          {vs.sessions}
                        </p>
                      </div>
                      <div className="rounded border border-slate-700 bg-slate-950/60 px-3 py-2">
                        <p className="text-[9px] text-slate-400">
                          TOTAL EVENTS
                        </p>
                        <p className="text-sm font-semibold text-slate-50">
                          {vs.totalEvents}
                        </p>
                      </div>
                      <div className="rounded border border-slate-700 bg-slate-950/60 px-3 py-2">
                        <p className="text-[9px] text-slate-400">
                          AVG SCROLL
                        </p>
                        <p className="text-sm font-semibold text-amber-200">
                          {vs.avgScrollPercent !== null
                            ? `${vs.avgScrollPercent.toFixed(1)}%`
                            : "—"}
                        </p>
                      </div>
                      <div className="rounded border border-slate-700 bg-slate-950/60 px-3 py-2">
                        <p className="text-[9px] text-slate-400">
                          CLICK EVENTS
                        </p>
                        <p className="text-sm font-semibold text-rose-200">
                          {vs.clickEvents}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Recent events table */}
            <section>
              <h2 className="mb-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-slate-400">
                LIVE EVENT LOG
              </h2>
              <div className="retro-panel scanline-overlay border border-slate-700/80 p-3">
                <div className="mb-2 flex items-center justify-between text-[9px] text-slate-400">
                  <span>/var/log/cmindx-events.log</span>
                  <span className="hud-scan text-lime-300">
                    STREAM • REFRESHING EVERY 5s
                  </span>
                </div>
                <div className="overflow-auto rounded-md border border-slate-800 bg-black/60">
                  <table className="w-full text-left text-[10px]">
                    <thead className="bg-slate-900/80 text-slate-400">
                      <tr>
                        <th className="px-3 py-2">Time</th>
                        <th className="px-3 py-2">Session</th>
                        <th className="px-3 py-2">Variant</th>
                        <th className="px-3 py-2">Type</th>
                        <th className="px-3 py-2">Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {events
                        .slice()
                        .reverse()
                        .slice(0, 80)
                        .map((e, idx) => (
                          <tr
                            key={`${e.ts}-${idx}`}
                            className="border-t border-slate-800/80"
                          >
                            <td className="px-3 py-2 text-slate-300">
                              {new Date(e.ts).toLocaleTimeString()}
                            </td>
                            <td className="px-3 py-2 text-slate-400">
                              {e.sessionId.slice(0, 8)}…
                            </td>
                            <td className="px-3 py-2 text-slate-300">
                              {e.variantId ?? "—"}
                            </td>
                            <td className="px-3 py-2">
                              <span
                                className={[
                                  "rounded-full px-2 py-0.5 text-[9px] uppercase tracking-wide",
                                  e.eventType === "click"
                                    ? "bg-rose-500/20 text-rose-200"
                                    : e.eventType === "scroll"
                                    ? "bg-amber-500/20 text-amber-200"
                                    : "bg-slate-700/50 text-slate-100"
                                ].join(" ")}
                              >
                                {e.eventType}
                              </span>
                            </td>
                            <td className="px-3 py-2 text-slate-300">
                              {e.eventType === "scroll" &&
                                `Scroll: ${e.payload.scrollPercent}%`}
                              {e.eventType === "click" &&
                                `Click on ${e.payload.tag} "${
                                  (e.payload.text as string) || ""
                                }"`}
                              {e.eventType === "pageview" &&
                                `Path: ${e.payload.path}`}
                            </td>
                          </tr>
                        ))}
                      {events.length === 0 && (
                        <tr>
                          <td
                            colSpan={5}
                            className="px-3 py-4 text-center text-slate-400"
                          >
                            No events yet. Open the main page, scroll and click
                            to generate telemetry.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
