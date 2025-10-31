"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useGSAPRegister } from "@/lib/gsapClient";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { WhatsIcon, InstaIcon } from "@/components/ui/BrandIcons";

const SECTIONS = [
  { id: "historia", label: "História", emoji: "📖" },
  { id: "chamada", label: "Chamada", emoji: "📣" },
  { id: "servicos", label: "Serviços", emoji: "🧭" },
  { id: "porque", label: "Por que", emoji: "✨" },
  { id: "depoimentos", label: "Depoimentos", emoji: "🎬" },
  { id: "faq", label: "FAQ", emoji: "❓" },
  { id: "final", label: "Fale Agora", emoji: "" }, // ícone vira WhatsIcon
];

const WHATS_LINK = "https://wa.me/5571982333570";
const INSTA_LINK = "https://instagram.com/sam_creds";

export default function FloatingNav() {
  const wrapperRef = useRef<HTMLDivElement>(null); // <- novo: anima opacidade aqui
  const railRef = useRef<HTMLDivElement>(null);
  const { gsap } = useGSAPRegister();
  const reduce = usePrefersReducedMotion();

  // Micro flutuação (desktop) — igual ao seu
  useEffect(() => {
    if (!railRef.current || reduce) return;
    const items = railRef.current.querySelectorAll(".rail-item");
    const ctx = gsap.context(() => {
      items.forEach((el, i) => {
        gsap.to(el, {
          y: "+=4",
          duration: 2 + i * 0.07,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
        });
      });
    }, railRef);
    return () => ctx.revert();
  }, [gsap, reduce]);

  // Só o efeito desejado: ficar levemente transparente ao rolar para baixo
  useEffect(() => {
    if (!wrapperRef.current || reduce) return;
    let lastY = window.scrollY;
    let idleTimer: any;

    const setOpacity = (to: number) => {
      gsap.to(wrapperRef.current, {
        opacity: to,
        duration: 0.2,
        ease: "power2.out",
      });
    };

    const onScroll = () => {
      const y = window.scrollY;
      const goingDown = y > lastY;
      lastY = y;

      if (goingDown && y > 20) {
        setOpacity(0.65); // mais “lavado” enquanto desce
        clearTimeout(idleTimer);
        idleTimer = setTimeout(() => setOpacity(1), 180); // voltou a ficar parado → volta ao normal
      } else {
        setOpacity(1); // subindo ou no topo → opaco normal
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(idleTimer);
    };
  }, [gsap, reduce]);

  return (
    <>
      {/* DESKTOP */}
      <aside
        aria-label="Navegação rápida"
        className="pointer-events-none fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 xl:block"
      >
        <div
          ref={wrapperRef}
          className="pointer-events-auto flex flex-col items-center gap-3 transition-opacity" // <- transição suave
        >
          <div className="mb-2 flex flex-col items-center gap-2">
            <div className="flex items-center gap-2">
              <Link
                aria-label="WhatsApp da Sam_Creds"
                href={WHATS_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/10 transition hover:bg-white/15"
              >
                <WhatsIcon
                  size={18}
                  className="opacity-90 group-hover:opacity-100"
                />
              </Link>
              <Link
                aria-label="Instagram da Sam_Creds"
                href={INSTA_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/10 transition hover:bg-white/15"
              >
                <InstaIcon
                  size={18}
                  className="opacity-90 group-hover:opacity-100"
                />
              </Link>
            </div>
          </div>

          <nav ref={railRef} className="flex flex-col items-center gap-2">
            {SECTIONS.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="rail-item group relative inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/10 transition hover:bg-white/15"
                aria-label={s.label}
              >
                {s.id === "final" ? (
                  <WhatsIcon size={18} />
                ) : (
                  <span className="text-base">{s.emoji}</span>
                )}
                <span className="pointer-events-none absolute right-[130%] top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md bg-black/70 px-2 py-1 text-xs opacity-0 shadow transition group-hover:opacity-100">
                  {s.label}
                </span>
              </a>
            ))}
          </nav>
        </div>
      </aside>

      {/* MOBILE permanece igual */}
      <MobileSheet />
    </>
  );
}

/* —————————————————————————————— */
/* Mobile sheet SEM <dialog> (fix iOS) */
/* —————————————————————————————— */
function MobileSheet() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const body = document.body;
    const prevOverflow = body.style.overflow;
    let touchHandler: any = null;

    if (open) {
      body.style.overflow = "hidden";
      touchHandler = (e: TouchEvent) => e.preventDefault();
      document.addEventListener("touchmove", touchHandler, { passive: false });

      const onEsc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
      window.addEventListener("keydown", onEsc);

      history.pushState({ sheet: true }, "");
      const onPop = () => setOpen(false);
      window.addEventListener("popstate", onPop);

      return () => {
        window.removeEventListener("keydown", onEsc);
        window.removeEventListener("popstate", onPop);
        document.removeEventListener("touchmove", touchHandler as any);
        body.style.overflow = prevOverflow || "";
        if (history.state?.sheet) history.back();
      };
    } else {
      body.style.overflow = prevOverflow || "";
      if (touchHandler) document.removeEventListener("touchmove", touchHandler);
    }
  }, [open]);

  const onBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) setOpen(false);
  };
  const closeAnd = (fn?: () => void) => () => {
    setOpen(false);
    fn?.();
  };

  return (
    <>
      <button
        aria-label={open ? "Fechar navegação" : "Abrir navegação"}
        onClick={() => setOpen((v) => !v)}
        className="fixed right-[max(1rem,env(safe-area-inset-right))] top-[max(1rem,env(safe-area-inset-top))] z-40 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/10 backdrop-blur transition hover:bg-white/15 xl:hidden"
      >
        <span className="relative block h-4 w-5" aria-hidden>
          <span
            className={`absolute left-0 top-0 h-[2px] w-5 bg-white transition-transform ${
              open ? "translate-y-[6px] rotate-45" : ""
            }`}
          />
          <span
            className={`absolute left-0 top-[6px] h-[2px] w-5 bg-white transition-opacity ${
              open ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`absolute left-0 top-[12px] h-[2px] w-5 bg-white transition-transform ${
              open ? "-translate-y-[6px] -rotate-45" : ""
            }`}
          />
        </span>
      </button>

      <div
        role="dialog"
        aria-modal="true"
        aria-hidden={!open}
        className={`fixed inset-0 z-40 xl:hidden ${
          open ? "pointer-events-auto" : "pointer-events-none"
        }`}
        onClick={onBackdropClick}
      >
        <div
          className={`absolute inset-0 bg-black/60 transition-opacity ${
            open ? "opacity-100" : "opacity-0"
          }`}
        />
        <div
          className={`absolute right-0 top-0 flex h-full w-[88%] max-w-[320px] flex-col bg-primary-900 shadow-2xl transition-transform duration-300 ease-out
                      pt-[calc(1rem+env(safe-area-inset-top))] 
                      pb-[calc(6.5rem+env(safe-area-inset-bottom))] 
                      px-6 ${open ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-bold">Navegação</h2>
            <button
              onClick={() => setOpen(false)}
              className="rounded-full bg-white/10 p-2 ring-1 ring-white/10 transition hover:bg-white/15"
              aria-label="Fechar"
            >
              ✕
            </button>
          </div>

          <nav className="space-y-4">
            {SECTIONS.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                onClick={closeAnd()}
                className="block rounded-md px-2 py-2 text-base transition hover:bg-white/10"
              >
                {s.label}
              </a>
            ))}
          </nav>

          <div className="mt-8 border-t border-white/10 pt-6">
            <p className="mb-3 text-sm text-white/80">Redes sociais</p>
            <div className="flex items-center gap-3">
              <Link
                href={WHATS_LINK}
                target="_blank"
                rel="noopener noreferrer"
                onClick={closeAnd()}
                aria-label="Abrir WhatsApp"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/10 transition hover:bg-white/15"
              >
                <WhatsIcon size={18} />
              </Link>
              <Link
                href={INSTA_LINK}
                target="_blank"
                rel="noopener noreferrer"
                onClick={closeAnd()}
                aria-label="Abrir Instagram"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/10 transition hover:bg-white/15"
              >
                <InstaIcon size={18} />
              </Link>
            </div>
          </div>

          <div className="mt-auto pt-6 pl-1 pr-[env(safe-area-inset-right)] text-left text-[11px] text-white/60">
            <span>Desenvolvido por </span>
            <a
              href="https://www.debuguei.com.br/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-white"
            >
              Debuguei
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
