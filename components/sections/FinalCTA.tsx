"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useGSAPRegister } from "@/lib/gsapClient";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { WhatsIcon } from "@/components/ui/BrandIcons";

export default function FinalCTA() {
  const root = useRef<HTMLDivElement>(null);
  const imgWrap = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLAnchorElement>(null);
  const { gsap, ScrollTrigger } = useGSAPRegister();
  const reduce = usePrefersReducedMotion();

  // Entrada ao aparecer + efeitos de ambiente
  useEffect(() => {
    if (!root.current) return;
    const ctx = gsap.context(() => {
      // estados iniciais (evita flash)
      gsap.set([".cta-title", ".cta-copy", ".cta-btn"], { y: 20, opacity: 0 });
      gsap.set(".cta-aura", { opacity: 0.06 });
      if (imgWrap.current) {
        gsap.set(imgWrap.current, {
          opacity: 0,
          y: 28,
          rotateX: -6,
          rotateY: 6,
          scale: 0.94,
          transformPerspective: 1200,
        });
      }

      // timeline de entrada quando a seção chega ao viewport
      ScrollTrigger.create({
        trigger: root.current!,
        start: "top 80%",
        once: true,
        onEnter: () => {
          if (reduce) {
            // Sem animação: mostra direto
            gsap.set([".cta-title", ".cta-copy", ".cta-btn"], {
              y: 0,
              opacity: 1,
            });
            gsap.set(imgWrap.current, {
              opacity: 1,
              y: 0,
              rotateX: 0,
              rotateY: 0,
              scale: 1,
            });
            gsap.set(".cta-aura", { opacity: 0.18 });
            return;
          }

          const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

          // Glow sobe um pouco + imagem entra com pop-in 3D
          tl.to(".cta-aura", { opacity: 0.18, duration: 0.6 }, 0)
            .to(
              imgWrap.current,
              {
                opacity: 1,
                y: 0,
                rotateX: 0,
                rotateY: 0,
                scale: 1,
                duration: 0.8,
              },
              0.05
            )
            // Título, copy, botão (stagger)
            .to(".cta-title", { y: 0, opacity: 1, duration: 0.5 }, 0.15)
            .to(".cta-copy", { y: 0, opacity: 1, duration: 0.5 }, 0.28)
            .to(".cta-btn", { y: 0, opacity: 1, duration: 0.5 }, 0.4)
            // Highlight do botão (sweep) logo ao entrar
            .add(() => {
              const shine =
                document.querySelector<HTMLElement>(".cta-shine > span");
              if (shine)
                gsap.fromTo(
                  shine,
                  { x: -140 },
                  { x: 280, duration: 0.9, ease: "power2.out" }
                );
            }, 0.48);
        },
      });

      // Parallax sutil da imagem ao rolar
      if (imgWrap.current && !reduce) {
        gsap.to(imgWrap.current, {
          yPercent: -6,
          ease: "none",
          scrollTrigger: {
            trigger: root.current!,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      // Glow “respirando”
      if (!reduce) {
        gsap.to(".cta-aura", {
          opacity: 0.26,
          duration: 2.6,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
        });
      }

      // Float sutil na imagem (idle)
      if (imgWrap.current && !reduce) {
        gsap.to(imgWrap.current, {
          y: "+=6",
          duration: 3,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
        });
      }
    }, root);
    return () => ctx.revert();
  }, [gsap, ScrollTrigger, reduce]);

  // Efeito "magnet" no botão (segue o cursor)
  useEffect(() => {
    if (!btnRef.current || reduce) return;
    const el = btnRef.current;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const mx = e.clientX - (r.left + r.width / 2);
      const my = e.clientY - (r.top + r.height / 2);
      gsap.to(el, {
        x: mx * 0.12,
        y: my * 0.18,
        duration: 0.2,
        ease: "power2.out",
      });
    };
    const onLeave = () =>
      gsap.to(el, { x: 0, y: 0, duration: 0.35, ease: "power3.out" });
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [gsap, reduce]);

  return (
    <section ref={root} className="relative py-16">
      {/* Aura/Glow de fundo */}
      <div
        aria-hidden
        className="cta-aura pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(80% 60% at 70% 40%, rgba(37,211,102,0.18), transparent 60%), radial-gradient(60% 50% at 30% 70%, rgba(96,165,250,0.18), transparent 60%)",
        }}
      />
      <div className="max-w-6xl mx-auto grid md:grid-cols-[1.1fr_.9fr] items-center gap-8 px-6">
        <div className="order-2 md:order-1 space-y-4">
          <h2 className="cta-title text-3xl md:text-4xl font-extrabold">
            Vamos organizar isso juntos?
          </h2>
          <p className="cta-copy text-white/85">
            Converse agora pelo WhatsApp e entenda as opções com clareza.
          </p>

          {/* Botão com ripple e shine sweep */}
          <div className="relative inline-block">
            {/* Shine container */}
            <span
              aria-hidden
              className="cta-shine pointer-events-none absolute inset-0 overflow-hidden rounded-full"
            >
              <span className="absolute -inset-y-2 -left-24 w-28 rotate-12 opacity-90">
                <span className="block h-full w-full translate-x-0 bg-gradient-to-r from-white/0 via-white/50 to-white/0 blur-sm" />
              </span>
            </span>

            {/* Ripple hover */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-full bg-whatsapp/30 blur-xl opacity-0 group-hover/cta:opacity-40 transition duration-300"
            />

            <div className="group/cta relative">
              <Button
                asChild
                size="lg"
                className="cta-btn bg-whatsapp hover:bg-[#1ebe57] text-black font-bold rounded-full shadow-glow px-7 py-5"
              >
                <a
                  ref={btnRef}
                  href="https://wa.me/5571982333570"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="inline-flex items-center gap-2">
                    <WhatsIcon size={18} />
                    Falar com a Sam_Creds
                  </span>
                </a>
              </Button>
            </div>
          </div>
        </div>

        <div
          ref={imgWrap}
          className="order-1 md:order-2 justify-self-center [perspective:1200px]"
        >
          <div className="relative w-[260px] sm:w-[320px] md:w-[440px] will-change-transform hover:[transform:rotateY(6deg)_rotateX(2deg)] transition-transform">
            <Image
              src="/assets/Samuel.png"
              alt="Consultor Samuel — Sam_Creds"
              width={520}
              height={680}
              className="rounded-2xl shadow-2xl"
              priority
            />
            {/* brilho suave na borda da imagem */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-white/10"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
