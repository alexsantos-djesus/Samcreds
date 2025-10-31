"use client";
import { useCallback } from "react";

export default function GoHomeFab() {
  const goHome = useCallback(() => {
    // início = HeroSamuel (#chamada)
    const el = document.getElementById("chamada");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <button
      onClick={goHome}
      aria-label="Ir para o início"
      className="fixed left-[max(1rem,env(safe-area-inset-left))] bottom-[max(1rem,env(safe-area-inset-bottom))] z-40
                 inline-flex h-11 w-11 items-center justify-center rounded-full
                 bg-white/10 ring-1 ring-white/10 backdrop-blur
                 hover:bg-white/15 transition"
    >
      {/* ícone 'home' minimalista */}
      <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
        <path fill="currentColor" d="M12 3l9 8h-3v8h-5v-5H11v5H6v-8H3l9-8z" />
      </svg>
    </button>
  );
}
