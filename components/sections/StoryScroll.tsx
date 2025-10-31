"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { useGSAPRegister } from "@/lib/gsapClient";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

const chapters = [
  { title: "Dívidas acumulando", text: "Cartão, contas, juros altos… 😵‍💫" },
  { title: "Ansiedade e atraso", text: "O mês vira, o saldo não fecha." },
  {
    title: "Respirar é preciso",
    text: "Organização responsável > promessa milagrosa.",
  },
  { title: "Plano certo", text: "Análise rápida, transparente e segura." },
  { title: "Crédito com propósito", text: "Só o necessário, do jeito certo." },
  { title: "Alívio real", text: "Você no controle outra vez. ✨" },
];

type Star = { x: number; y: number; r: number; speed: number; tw: number };

export default function StoryScroll() {
  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const light = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  const { gsap, ScrollTrigger } = useGSAPRegister();
  const reduce = usePrefersReducedMotion();

  // -------- Starfield FULLSCREEN --------
  useEffect(() => {
    if (!canvas.current) return;
    const c = canvas.current;
    const ct = c.getContext("2d", { alpha: true });
    if (!ct) return;

    let W = 0,
      H = 0,
      raf = 0;
    const LAYERS = 3,
      PER_LAYER = 90,
      baseSpeed = 0.08;
    let stars: Star[] = [];
    let mouseX = 0,
      mouseY = 0;

    const resize = () => {
      const dpr = Math.max(1, window.devicePixelRatio || 1);
      W = window.innerWidth;
      H = window.innerHeight;
      c.width = Math.floor(W * dpr);
      c.height = Math.floor(H * dpr);
      ct.setTransform(dpr, 0, 0, dpr, 0, 0);
      stars = [];
      for (let layer = 0; layer < LAYERS; layer++) {
        for (let i = 0; i < PER_LAYER; i++) {
          stars.push({
            x: Math.random() * W,
            y: Math.random() * H,
            r: (layer + 1) * 0.6 + Math.random() * 0.8,
            speed: baseSpeed * (layer + 1),
            tw: Math.random() * Math.PI * 2,
          });
        }
      }
    };

    const draw = () => {
      ct.clearRect(0, 0, W, H);
      const g = ct.createRadialGradient(
        W * 0.5,
        H * 0.5,
        0,
        W * 0.5,
        H * 0.5,
        Math.max(W, H) * 0.7
      );
      g.addColorStop(0, "rgba(59,130,246,0.07)");
      g.addColorStop(1, "rgba(0,0,0,0)");
      ct.fillStyle = g;
      ct.fillRect(0, 0, W, H);

      const driftX = (c as any).__driftX || 0;
      for (const s of stars) {
        s.x += s.speed + driftX * 0.12;
        if (s.x > W + 20) s.x = -20;
        s.tw += 0.015;
        ct.globalAlpha = 0.5 + Math.sin(s.tw) * 0.4;
        ct.beginPath();
        ct.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ct.fillStyle = "rgba(255,255,255,0.9)";
        ct.fill();
      }

      if (!reduce) {
        ct.globalAlpha = 0.25;
        const lg = ct.createRadialGradient(
          mouseX,
          mouseY,
          0,
          mouseX,
          mouseY,
          220
        );
        lg.addColorStop(0, "rgba(255,255,255,0.22)");
        lg.addColorStop(1, "rgba(255,255,255,0)");
        ct.fillStyle = lg;
        ct.beginPath();
        ct.arc(mouseX, mouseY, 220, 0, Math.PI * 2);
        ct.fill();
      }
      ct.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };

    const onMouse = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (light.current) {
        gsap.to(light.current, {
          x: mouseX - window.innerWidth / 2,
          y: mouseY - window.innerHeight / 2,
          duration: 0.25,
          ease: "power2.out",
        });
      }
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouse);
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
    };
  }, [gsap, reduce]);

  // -------- Horizontal + drift + logo fade --------
  useEffect(() => {
    if (!wrap.current || !track.current) return;
    const panels = track.current.querySelectorAll(".panel");

    const ctx = gsap.context(() => {
      if (reduce) return;

      const tl = gsap.timeline({});
      tl.to(track.current, {
        xPercent: -(100 * (panels.length - 1)),
        ease: "none",
      });

      const endLen = () => `+=${window.innerWidth * (panels.length - 1)}`;
      const st = ScrollTrigger.create({
        trigger: wrap.current!,
        start: "top top",
        end: endLen,
        scrub: true,
        pin: true,
        animation: tl,
        onEnter: () =>
          gsap.to([".story-canvas", ".story-light"], {
            opacity: 1,
            duration: 0.25,
          }),
        onLeave: () =>
          gsap.to([".story-canvas", ".story-light"], {
            opacity: 0,
            duration: 0.2,
          }),
        onEnterBack: () =>
          gsap.to([".story-canvas", ".story-light"], {
            opacity: 1,
            duration: 0.25,
          }),
        onLeaveBack: () =>
          gsap.to([".story-canvas", ".story-light"], {
            opacity: 0,
            duration: 0.2,
          }),
        onUpdate: (self) => {
          const drift = (self.progress - 0.5) * 1.2;
          if (canvas.current) (canvas.current as any).__driftX = drift;
        },
      });

      // Fade + blur da LOGO no início da rolagem
      if (logoRef.current) {
        gsap.fromTo(
          logoRef.current,
          { opacity: 1, filter: "blur(0px)", y: 0, scale: 1 },
          {
            opacity: 0,
            filter: "blur(8px)",
            y: -24,
            scale: 0.96,
            ease: "none",
            scrollTrigger: {
              trigger: wrap.current!,
              start: "top top+=20",
              end: "top+=260 top",
              scrub: true,
            },
          }
        );
      }

      // entrada dos painéis
      panels.forEach((panel) => {
        gsap.fromTo(
          panel,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            scrollTrigger: {
              containerAnimation: tl,
              trigger: panel as Element,
              start: "left center",
              end: "right center",
              scrub: true,
            },
          }
        );
      });

      return () => st.kill();
    }, wrap);

    return () => ctx.revert();
  }, [gsap, ScrollTrigger, reduce]);

  return (
    <div ref={wrap} className="relative h-screen overflow-hidden">
      {/* LOGO fixa no topo (z bem alto) */}
      <div
        ref={logoRef}
        className="pointer-events-none fixed left-1/2 top-3 z-[70] -translate-x-1/2"
      >
        <Image
          src="/assets/logo.png" // precisa existir em public/assets/logo.png
          alt="Sam_Creds"
          width={200}
          height={72}
          priority
          className="h-auto w-[160px] md:w-[200px] opacity-90"
        />
      </div>

      {/* BG interativo */}
      <canvas
        ref={canvas}
        className="story-canvas pointer-events-none fixed inset-0 z-0 opacity-0 transition-opacity duration-200"
      />
      <div
        ref={light}
        aria-hidden
        className="story-light pointer-events-none fixed left-1/2 top-1/2 z-0 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl opacity-0 transition-opacity duration-200"
        style={{
          background:
            "radial-gradient(circle at center, rgba(255,255,255,0.22), rgba(255,255,255,0))",
        }}
      />

      {/* Trilho horizontal */}
      <div
        ref={track}
        className="absolute inset-0 z-10 flex will-change-transform"
      >
        {chapters.map((c, i) => (
          <article
            key={i}
            className="panel min-w-[100vw] flex items-center justify-center px-6"
          >
            <div className="max-w-xl text-center bg-primary-800/40 rounded-2xl p-6 backdrop-blur-sm">
              <h3 className="font-gsc text-2xl md:text-3xl font-bold mb-2">
                {c.title}
              </h3>
              <p className="text-white/85">{c.text}</p>
            </div>
          </article>
        ))}
      </div>

      {/* Vinheta */}
      <div
        className="pointer-events-none absolute inset-0 z-20"
        style={{
          backdropFilter: "blur(2px)",
          WebkitMaskImage:
            "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 68%, rgba(0,0,0,0.55) 84%, rgba(0,0,0,1) 96%)",
          maskImage:
            "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 68%, rgba(0,0,0,0.55) 84%, rgba(0,0,0,1) 96%)",
        }}
      />
    </div>
  );
}
