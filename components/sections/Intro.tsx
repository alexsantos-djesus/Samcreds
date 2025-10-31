"use client";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useGSAPRegister } from "@/lib/gsapClient";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

/**
 * Intro v2 (corrigida)
 * - Mesmo visual/efeitos da sua versão
 * - Fundo opaco SEM flicker
 * - Scroll lock do primeiro paint ao fim
 * - Canvas DPR-aware + cleanup robusto
 */
export default function Intro() {
  const root = useRef<HTMLDivElement>(null);
  const shineRef = useRef<HTMLSpanElement>(null);
  const flareRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [done, setDone] = useState(false);
  const { gsap } = useGSAPRegister();
  const reduce = usePrefersReducedMotion();

  // —————————————————————————————————————
  // 1) Trava o scroll ANTES do primeiro paint
  //    e garante fundo opaco (anti-flicker)
  // —————————————————————————————————————
  useLayoutEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prevHtmlBG = html.style.backgroundColor;
    const prevOverflow = body.style.overflow;

    html.style.backgroundColor = "#0b1226"; // opaco já no primeiro frame
    body.style.overflow = "hidden"; // bloqueia scroll

    return () => {
      html.style.backgroundColor = prevHtmlBG;
      body.style.overflow = prevOverflow;
    };
  }, []);

  // —————————————————————————————————————
  // 2) Starfield (canvas) — mesma estética,
  //    agora com devicePixelRatio e cleanup
  // —————————————————————————————————————
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || reduce) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let W = 0,
      H = 0,
      DPR = 1;
    let mouseX = 0.5,
      mouseY = 0.5;

    const stars: { x: number; y: number; r: number; v: number }[] = [];
    const init = () => {
      DPR = Math.max(1, window.devicePixelRatio || 1);
      const cssW = window.innerWidth;
      const cssH = window.innerHeight;
      W = Math.floor(cssW * DPR);
      H = Math.floor(cssH * DPR);
      canvas.width = W;
      canvas.height = H;
      canvas.style.width = cssW + "px";
      canvas.style.height = cssH + "px";
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

      stars.length = 0;
      const count = Math.min(220, Math.floor((cssW * cssH) / 15000));
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * cssW,
          y: Math.random() * cssH,
          r: Math.random() * 1.15 + 0.15,
          v: Math.random() * 0.4 + 0.15,
        });
      }
    };

    const onMouse = (e: MouseEvent) => {
      const cssW = canvas.clientWidth || window.innerWidth;
      const cssH = canvas.clientHeight || window.innerHeight;
      mouseX = e.clientX / cssW;
      mouseY = e.clientY / cssH;
    };

    const draw = () => {
      const cssW = canvas.clientWidth;
      const cssH = canvas.clientHeight;

      // fundo azul-noite
      const g = ctx.createLinearGradient(0, 0, 0, cssH);
      g.addColorStop(0, "rgba(11,18,38,1)");
      g.addColorStop(1, "rgba(7,12,28,1)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, cssW, cssH);

      // estrelas
      ctx.save();
      ctx.globalAlpha = 0.9;
      for (const s of stars) {
        s.x += (mouseX - 0.5) * s.v;
        s.y += (mouseY - 0.5) * s.v;

        if (s.x < 0) s.x += cssW;
        if (s.x > cssW) s.x -= cssW;
        if (s.y < 0) s.y += cssH;
        if (s.y > cssH) s.y -= cssH;

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.85)";
        ctx.fill();
      }
      ctx.restore();

      // vinheta leve
      const vg = ctx.createRadialGradient(
        cssW / 2,
        cssH / 2,
        Math.min(cssW, cssH) * 0.2,
        cssW / 2,
        cssH / 2,
        Math.max(cssW, cssH) * 0.7
      );
      vg.addColorStop(0, "rgba(0,0,0,0)");
      vg.addColorStop(1, "rgba(0,0,0,0.35)");
      ctx.fillStyle = vg;
      ctx.fillRect(0, 0, cssW, cssH);

      raf = requestAnimationFrame(draw);
    };

    const onResize = () => {
      init();
    };
    init();
    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("mousemove", onMouse, { passive: true });
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouse);
    };
  }, [reduce]);

  // —————————————————————————————————————
  // 3) Timeline — mesmos efeitos/tempos,
  //    liberando scroll só ao final
  // —————————————————————————————————————
  useEffect(() => {
    if (!root.current || done) return;
    const ctx = gsap.context(() => {
      if (reduce) {
        setDone(true);
        return;
      }

      const $letters = root.current!.querySelectorAll(".intro-letter");
      const $shadow = root.current!.querySelector(".intro-shadow");
      const $shine = shineRef.current;
      const $flare = flareRef.current;

      // estados iniciais
      gsap.set($letters, {
        yPercent: 40,
        opacity: 0,
        filter: "blur(6px)",
        rotateX: -55,
        transformOrigin: "50% 100%",
      });
      gsap.set($shadow, { opacity: 0 });
      gsap.set($shine, { xPercent: -140, opacity: 0 });
      gsap.set($flare, { opacity: 0, scale: 0.9 });

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: () => setDone(true),
      });

      // 1) Logo entra letra-a-letra
      tl.to(
        $letters,
        {
          yPercent: 0,
          opacity: 1,
          filter: "blur(0px)",
          rotateX: 0,
          duration: 0.8,
          stagger: 0.06,
        },
        0.1
      );

      // 2) Sombra
      tl.to($shadow, { opacity: 0.55, duration: 0.6 }, 0.35);

      // 3) Sweep de luz
      tl.to($shine, { opacity: 1, duration: 0.1 }, 0.55)
        .to(
          $shine,
          { xPercent: 160, duration: 0.9, ease: "power2.inOut" },
          0.55
        )
        .to($shine, { opacity: 0, duration: 0.25 }, 1.0);

      // 4) Flare
      tl.to($flare, { opacity: 1, scale: 1, duration: 0.6 }, 0.6);

      // 5) Dissolve + libera scroll
      tl.to(root.current, { opacity: 0, duration: 0.7, delay: 0.4 });
      tl.call(() => {
        // libera scroll e remove overlay
        const body = document.body;
        body.style.overflow = "";
      });
    }, root);

    return () => ctx.revert();
  }, [gsap, reduce, done]);

  // —————————————————————————————————————
  // 4) Letras (memo)
  // —————————————————————————————————————
  const letters = useMemo(() => "SAM_CREDS".split(""), []);

  return (
    <section
      ref={root}
      className={`fixed inset-0 z-[100] transition-opacity ${
        done ? "pointer-events-none opacity-0" : ""
      }`}
      aria-hidden={done}
    >
      {/* Camada opaca FIXA sob o canvas — impede qualquer vazamento da home */}
      <div className="absolute inset-0 bg-[#0b1226]" />

      {/* Starfield */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Film grain sutil */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-screen"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.45'/></svg>\")",
          backgroundSize: "160px 160px",
        }}
      />

      {/* Conteúdo central */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative text-center select-none">
          {/* sombra atrás da marca */}
          <div
            className="intro-shadow absolute -inset-6 -z-10 rounded-[32px]"
            style={{
              background:
                "radial-gradient(60% 60% at 50% 50%, rgba(59,130,246,0.25), transparent 60%)",
            }}
          />

          {/* Marca */}
          <div className="relative inline-flex items-end gap-2">
            <div className="font-changa text-5xl md:text-7xl tracking-[0.18em] leading-none">
              {letters.map((ch, i) => (
                <span key={i} className="intro-letter inline-block">
                  <span
                    className={
                      ch === "_"
                        ? "text-transparent select-none w-2 inline-block"
                        : ""
                    }
                  >
                    <span className="text-white">{ch === "_" ? " " : ch}</span>
                  </span>
                </span>
              ))}
            </div>
            {/* pinta CREDS (letras após o "_") */}
            <style>{`.font-changa .intro-letter:nth-child(n+5) span > span { color: #25D366; }`}</style>
          </div>

          {/* Sweep de luz */}
          <span
            ref={shineRef}
            className="pointer-events-none absolute left-0 top-1/2 h-24 w-24 -translate-y-1/2 rotate-12"
          >
            <span className="block h-full w-full bg-gradient-to-r from-white/0 via-white/60 to-white/0 blur-sm" />
          </span>

          {/* Flare */}
          <div
            ref={flareRef}
            className="pointer-events-none absolute -inset-24"
            style={{
              background:
                "radial-gradient(60% 60% at 50% 50%, rgba(255,255,255,0.08), transparent 60%)",
            }}
          />
        </div>
      </div>
    </section>
  );
}
