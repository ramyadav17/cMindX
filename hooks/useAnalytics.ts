"use client";

import { useEffect } from "react";
import { db } from "../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export function useAnalytics(variantId?: string) {
  useEffect(() => {
    // Session ID (unique w.r.t user)
    const sessionId =
      crypto.randomUUID?.() ?? `sess_${Date.now()}_${Math.random()}`;

    // Helper function to send events
    async function send(
      eventType: string,
      payload: Record<string, unknown> = {}
    ) {
      try {
        await addDoc(collection(db, "events"), {
          sessionId,
          eventType,
          payload,
          ts: new Date().toISOString(), // readable timestamp
          createdAt: serverTimestamp(), // firestore timestamp
          variantId
        });
      } catch (e) {
        console.error("Error writing analytics event:", e);
      }
    }

    // Log FIRST event → pageview
    send("pageview", { path: window.location.pathname });

    // CLICK Tracking
    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLElement;

      const text = target.innerText?.slice(0, 80) ?? "";
      send("click", {
        x: e.clientX,
        y: e.clientY,
        tag: target.tagName,
        text
      });
    }

    // SCROLL Tracking
    function handleScroll() {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;

      const docHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;

      const scrollPercent =
        docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0;

      send("scroll", { scrollPercent });
    }

    // Attach event listeners
    window.addEventListener("click", handleClick);
    window.addEventListener("scroll", handleScroll);

    // Remove listeners on unmount
    return () => {
      window.removeEventListener("click", handleClick);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [variantId]);
}
