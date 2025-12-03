"use client";

import React, { useState, useEffect } from "react";
import { useAnalytics } from "../hooks/useAnalytics";

type FeatureCardProps = {
  tag: string;
  title: string;
  desc: string;
};

function FeatureCard({ tag, title, desc }: FeatureCardProps) {
  return (
    <div className="retro-panel scanline-overlay relative h-full border border-amber-500/40 p-4 text-[11px] uppercase tracking-[0.12em] text-slate-200">
      <div className="mb-3 flex items-center justify-between">
        <span className="rounded-sm bg-amber-500/10 px-2 py-1 text-[9px] font-semibold text-amber-300">
          {tag}
        </span>
        <span className="text-[9px] text-slate-400">MODULE READY</span>
      </div>
      <h3 className="mb-2 text-xs font-semibold text-slate-50">{title}</h3>
      <p className="text-[10px] leading-relaxed normal-case text-slate-300">
        {desc}
      </p>
    </div>
  );
}

type VariantId = "A" | "B";

const VARIANTS: Record<
  VariantId,
  {
    heroTitle: string;
    heroSubtitle: string;
    primaryCta: string;
    secondaryCta: string;
    badge: string;
  }
> = {
  A: {
    heroTitle: "SELF-EVOLVING WEBSITE // BUILD A",
    heroSubtitle:
      "cMindX tracks scrolls, clicks and exits, then mutates your landing page in real time to keep the attention meter full.",
    primaryCta: "▶ Start Optimization Run",
    secondaryCta: "▢ View Live Telemetry",
    badge: "AGENT MODE • ANALYZE"
  },
  B: {
    heroTitle: "AUTONOMOUS GROWTH AGENT // BUILD B",
    heroSubtitle:
      "Stop shipping static pages. cMindX treats your site like a strategy game: test, rank and evolve everything on real player data.",
    primaryCta: "▶ Deploy Growth Agent",
    secondaryCta: "◎ Watch Experiments",
    badge: "AGENT MODE • EVOLVE"
  }
};

export default function Home() {
  const [variantId, setVariantId] = useState<VariantId>("A");

  useEffect(() => {
    const v: VariantId = Math.random() < 0.5 ? "A" : "B";
    setVariantId(v);
  }, []);

  const variant = VARIANTS[variantId];

  useAnalytics(variantId);

  return (
    <div className="retro-bg min-h-screen text-slate-50">
      <div className="mx-auto max-w-6xl px-4 pb-16 pt-6">
        {/* Top HUD bar */}
        <header className="mb-6 flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-slate-300">
          <div className="flex items-center gap-3">
            <div className="pixel-border flex h-9 w-9 items-center justify-center rounded-md bg-gradient-to-br from-amber-500 to-rose-500 text-[11px] font-black">
              cX
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-semibold text-slate-100">
                cMindX // WebMind Agent
              </span>
              <div className="flex gap-2 text-[9px] text-slate-400">
                <span>MODE: LIVE TRAFFIC</span>
                <span className="text-amber-300">VARIANT: {variantId}</span>
              </div>
            </div>
          </div>

          <nav className="flex items-center gap-4 text-[9px]">
            <a href="#how" className="hover:text-amber-300">
              HOW IT WORKS
            </a>
            <a href="#features" className="hover:text-amber-300">
              MODULES
            </a>
            <a href="#cta" className="hover:text-amber-300">
              DEPLOY
            </a>
            <a
              href="/dashboard"
              className="rounded-sm border border-lime-400/70 bg-lime-400/10 px-3 py-1 text-[9px] font-semibold text-lime-300 hover:bg-lime-400/20"
            >
              DASHBOARD HUD
            </a>
          </nav>
        </header>

        {/* Main grid */}
        <main className="grid gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          {/* Left: hero with XP + combo */}
          <section className="scanline-overlay retro-panel relative flex flex-col justify-between border border-amber-500/60 px-6 py-6">
            {/* top status row */}
            <div className="mb-4 flex items-center justify-between text-[9px] uppercase tracking-[0.18em] text-slate-300">
              <div className="inline-flex items-center gap-2">
                <span className="status-led" />
                <span>AGENTIC AI FOR WEB</span>
              </div>
              <span className="text-slate-500">
                BUILD: CMX-0.1.0 • SESSION LIVE
              </span>
            </div>

            {/* hero text */}
            <div className="space-y-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-amber-300">
                {variant.badge}
              </p>

              <h1 className="crt-glow text-2xl font-semibold leading-tight sm:text-3xl lg:text-4xl">
                {variant.heroTitle}
              </h1>

              <p className="max-w-xl text-[11px] leading-relaxed text-slate-300">
                {variant.heroSubtitle}
              </p>

              {/* XP bar + combo meter */}
              <div className="mt-3 space-y-3">
                {/* XP bar */}
                <div>
                  <div className="mb-1 flex items-center justify-between text-[9px] text-slate-400">
                    <span>ATTENTION XP</span>
                    <span className="text-amber-300">LEVEL 03</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-800">
                    <div className="h-2 w-2/3 rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 shadow-[0_0_12px_rgba(248,181,64,0.8)]" />
                  </div>
                  <p className="mt-1 text-[9px] text-slate-400">
                    XP increases as users scroll deeper and interact more.
                  </p>
                </div>

                {/* combo + live stats */}
                <div className="grid max-w-xl grid-cols-3 gap-3 text-[10px]">
                  <div className="rounded border border-slate-700 bg-slate-950/60 px-3 py-2">
                    <p className="text-[9px] text-slate-400">COMBO METER</p>
                    <p className="font-semibold text-rose-300">x3 INTERACTIONS</p>
                    <p className="mt-1 text-[9px] text-slate-500">
                      Chain clicks + scrolls without bouncing.
                    </p>
                  </div>
                  <div className="rounded border border-slate-700 bg-slate-950/60 px-3 py-2">
                    <p className="text-[9px] text-slate-400">EXPERIMENT SLOT</p>
                    <p className="font-semibold text-amber-300">
                      A/B HERO ACTIVE
                    </p>
                    <p className="mt-1 text-[9px] text-slate-500">
                      Variant {variantId} currently served.
                    </p>
                  </div>
                  <div className="rounded border border-slate-700 bg-slate-950/60 px-3 py-2">
                    <p className="text-[9px] text-slate-400">AGENT FOCUS</p>
                    <p className="font-semibold text-lime-300">
                      COPY + LAYOUT
                    </p>
                    <p className="mt-1 text-[9px] text-slate-500">
                      Optimizing fold content and CTAs.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href="#cta"
                className="pixel-border inline-flex items-center justify-center rounded-md bg-amber-400 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-950 hover:bg-amber-300"
              >
                {variant.primaryCta}
              </a>
              <a
                href="#how"
                className="inline-flex items-center justify-center rounded-md border border-slate-600 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-200 hover:border-amber-400 hover:text-amber-200"
              >
                {variant.secondaryCta}
              </a>
            </div>
          </section>

          {/* Right: console / how it works */}
          <section className="space-y-4 text-[11px]">
            <div className="retro-panel scanline-overlay border border-rose-500/50 p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-rose-300">
                  SESSION CONSOLE
                </span>
                <span className="text-[9px] text-slate-400">
                  STATUS: <span className="text-lime-300">STREAMING</span>
                </span>
              </div>
              <p className="text-[10px] text-slate-300">
                Every scroll, click and exit is logged as an event. cMindX uses
                this stream as its game loop to evolve copy, layout and CTAs
                toward higher scores.
              </p>
              <ul className="mt-3 space-y-1 text-[10px] text-slate-300">
                <li>▹ TRACK: scroll%, click trails, drop-off points</li>
                <li>▹ TEST: A/B hero variants and CTA wording</li>
                <li>▹ EVOLVE: keep only the winning patterns live</li>
              </ul>
            </div>

            <div
              id="how"
              className="retro-panel scanline-overlay border border-slate-600/70 p-4"
            >
              <h2 className="mb-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-slate-300">
                HOW IT WORKS
              </h2>
              <p className="text-[10px] text-slate-300">
                Drop cMindX in front of your marketing site. It becomes the game
                master for your UX: watching players, running experiments and
                evolving layouts. You just watch the HUD on the dashboard.
              </p>
            </div>
          </section>
        </main>

        {/* Feature grid */}
        <section id="features" className="mt-10 space-y-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-slate-400">
            SYSTEM MODULES
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <FeatureCard
              tag="OBSERVE"
              title="Telemetry Engine"
              desc="Captures scroll depth, click paths and exits as structured events for every session."
            />
            <FeatureCard
              tag="REWRITE"
              title="Copy Mutation Core"
              desc="Continuously generates new headlines, value props and CTAs tuned for conversion."
            />
            <FeatureCard
              tag="EVOLVE"
              title="Experiment Orchestrator"
              desc="Runs A/B trials, promotes winners and retires losing layouts automatically."
            />
            <FeatureCard
              tag="RANK"
              title="SEO & Content Agent"
              desc="Spins up keyword-aware sections and blog posts that plug into the same feedback loop."
            />
          </div>
        </section>

        {/* CTA / mission briefing */}
        <section
          id="cta"
          className="mt-10 retro-panel scanline-overlay border border-lime-500/60 p-5 text-[11px]"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <p className="text-[9px] uppercase tracking-[0.25em] text-lime-300">
                MISSION BRIEFING
              </p>
              <h2 className="text-sm font-semibold text-slate-50">
                Plug cMindX into your site and let the agent play for you.
              </h2>
              <p className="text-[10px] text-slate-300">
                No more guessing. Treat your website like a live game that
                rebalances itself on real traffic instead of your gut.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href="/dashboard"
                className="pixel-border inline-flex items-center justify-center rounded-md bg-lime-400 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-950 hover:bg-lime-300"
              >
                OPEN DASHBOARD HUD
              </a>
              <a
                href="#"
                className="inline-flex items-center justify-center rounded-md border border-slate-500 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-100 hover:border-lime-300"
              >
                JOIN EARLY ACCESS
              </a>
            </div>
          </div>
        </section>

        {/* Terminal strip */}
        <section className="mt-6 rounded-md border border-slate-800 bg-black/70 px-3 py-2 text-[10px] font-mono text-amber-200">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#22c55e]" />
            <span className="text-slate-400">/var/log/cmindx.log</span>
          </div>
          <div className="mt-1 space-y-0.5 text-[10px]">
            <p>[OK] agent.spawn() → variant {variantId} deployed.</p>
            <p>[OK] telemetry.stream() → scroll / click events flowing.</p>
            <p>[..] awaiting next experiment cycle…</p>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-6 border-t border-slate-800 pt-3 text-[10px] text-slate-500">
          <div className="flex items-center justify-between">
            <span>© {new Date().getFullYear()} cMindX / WebMind Agent.</span>
            <span>BUILD TYPE: EXPERIMENTAL • PLAYER 1 READY</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
