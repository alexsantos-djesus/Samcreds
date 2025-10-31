"use client";
import { useEffect, useMemo, useRef } from "react";
import { useGSAPRegister } from "@/lib/gsapClient";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import Link from "next/link";
import { WhatsIcon } from "@/components/ui/BrandIcons";

type Service = {
  icon: string;
  title: string;
  waText: string; // mensagem pré-preenchida do WhatsApp
};

const WHATS_NUMBER = "5571982333570";

const SERVICES: Service[] = [
  {
    icon: "💰",
    title: "Antecipação de FGTS",
    waText:
      "Oi, quero antecipar meu FGTS com a Sam_Creds. Pode me explicar como funciona?",
  },
  {
    icon: "👨‍👩‍👧",
    title: "Empréstimo Bolsa Família",
    waText:
      "Oi, tenho direito ao Bolsa Família e gostaria de saber como fazer o empréstimo com a Sam_Creds.",
  },
  {
    icon: "💼",
    title: "Empréstimo CLT",
    waText:
      "Olá, trabalho com carteira assinada e quero fazer um empréstimo CLT. Pode me ajudar?",
  },
  {
    icon: "⚡",
    title: "Na conta de energia",
    waText:
      "Oi, tenho conta de energia no meu nome e quero saber como funciona o empréstimo com a Sam_Creds.",
  },
  {
    icon: "✅",
    title: "Limpa Nome",
    waText:
      "Olá, gostaria de saber como vocês podem me ajudar a limpar meu nome com a Sam_Creds.",
  },
];

function buildWaUrl(text: string) {
  const encoded = encodeURIComponent(text);
  return `https://wa.me/${WHATS_NUMBER}?text=${encoded}`;
}

export default function Services() {
  const root = useRef<HTMLDivElement>(null);
  const cardsWrap = useRef<HTMLDivElement>(null);
  const { gsap, ScrollTrigger } = useGSAPRegister();
  const reduce = usePrefersReducedMotion();

  const items = useMemo(
    () =>
      SERVICES.map((s) => ({
        ...s,
        href: buildWaUrl(s.waText),
      })),
    []
  );

  useEffect(() => {
    if (!root.current) return;

    const ctx = gsap.context(() => {
      gsap.set(".srv-reveal", { clipPath: "inset(0% 0% 100% 0%)" });
      gsap.set(".srv-title", { y: 24, opacity: 0 });
      gsap.set(".srv-card", {
        y: 30,
        opacity: 0,
        rotateX: -8,
        scale: 0.94,
        transformPerspective: 1000,
      });

      // Entrada do título e cards ao chegar na viewport
      ScrollTrigger.create({
        trigger: root.current!,
        start: "top 75%",
        once: true,
        onEnter: () => {
          if (reduce) {
            gsap.set(".srv-title", { y: 0, opacity: 1 });
            gsap.set(".srv-card", { y: 0, opacity: 1, rotateX: 0, scale: 1 });
            return;
          }
          const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
          tl.to(".srv-title", { y: 0, opacity: 1, duration: 0.6 }, 0)
            .to(
              ".srv-card",
              {
                y: 0,
                opacity: 1,
                rotateX: 0,
                scale: 1,
                duration: 0.6,
                stagger: 0.08,
              },
              0.1
            )
            // leve sweep no fundo
            .fromTo(
              ".srv-bg-sweep",
              { xPercent: -80, opacity: 0 },
              { xPercent: 40, opacity: 0.35, duration: 1.2, ease: "sine.out" },
              0.05
            )
            .to(".srv-bg-sweep", { opacity: 0.1, duration: 0.8 }, "-=0.3");
        },
      });

      // Parallax sutil do “bloom” de fundo ao rolar a seção
      if (!reduce) {
        gsap.to(".srv-bloom", {
          yPercent: -10,
          ease: "none",
          scrollTrigger: {
            trigger: root.current!,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      }
    }, root);

    return () => ctx.revert();
  }, [gsap, ScrollTrigger, reduce]);

  // Efeito “magnet” + tilt suave individual por card
  useEffect(() => {
    if (!cardsWrap.current || reduce) return;
    const cards = Array.from(
      cardsWrap.current.querySelectorAll<HTMLAnchorElement>(".srv-card")
    );
    const cleanups: Array<() => void> = [];

    cards.forEach((el) => {
      const onMove = (e: MouseEvent) => {
        const r = el.getBoundingClientRect();
        const mx = e.clientX - (r.left + r.width / 2);
        const my = e.clientY - (r.top + r.height / 2);
        const tiltX = (-my / r.height) * 8;
        const tiltY = (mx / r.width) * 8;
        gsap.to(el, {
          x: mx * 0.06,
          y: my * 0.08,
          rotateX: tiltX,
          rotateY: tiltY,
          duration: 0.25,
          ease: "power2.out",
        });
      };
      const onLeave = () => {
        gsap.to(el, {
          x: 0,
          y: 0,
          rotateX: 0,
          rotateY: 0,
          duration: 0.35,
          ease: "power3.out",
        });
      };
      el.addEventListener("mousemove", onMove);
      el.addEventListener("mouseleave", onLeave);
      cleanups.push(() => {
        el.removeEventListener("mousemove", onMove);
        el.removeEventListener("mouseleave", onLeave);
      });
    });

    return () => cleanups.forEach((fn) => fn());
  }, [gsap, reduce]);

  return (
    <section ref={root} id="servicos" className="relative py-16 md:py-20">
      {/* BLOOM de fundo + sweep */}
      <div
        aria-hidden
        className="srv-bloom pointer-events-none absolute inset-0 -z-10"
      >
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background:
              "radial-gradient(60% 50% at 20% 20%, rgba(59,130,246,0.28) 0%, transparent 60%), radial-gradient(40% 40% at 80% 70%, rgba(37,211,102,0.22) 0%, transparent 60%)",
          }}
        />
        <div className="srv-bg-sweep absolute top-0 bottom-0 left-1/4 right-1/4 rounded-full blur-3xl bg-white/10" />
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <h2 className="srv-title text-center text-3xl md:text-4xl font-extrabold mb-10">
          Nossos Serviços
        </h2>

        <div
          ref={cardsWrap}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
        >
          {items.map((s, i) => (
            <Link
              key={s.title}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${s.title} — abrir conversa no WhatsApp`}
              className="srv-card group relative block rounded-xl border border-white/10 bg-white/10 p-6 shadow-md backdrop-blur-md transition-transform will-change-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-whatsapp/70"
            >
              {/* brilho em hover */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(37,211,102,0.12), rgba(59,130,246,0.10))",
                }}
              />

              <div className="relative z-10">
                <div className="text-4xl mb-4 drop-shadow">{s.icon}</div>
                <h3 className="text-lg md:text-xl font-semibold">{s.title}</h3>

                {/* CTA estilo pílula com “sopro” em hover */}
                <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-whatsapp text-black font-semibold px-4 py-2 shadow-glow transition-colors group-hover:bg-[#1ebe57]">
                  <WhatsIcon size={16} />
                  Falar agora
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    className="ml-1 opacity-80"
                  >
                    <path
                      fill="currentColor"
                      d="M13.172 12L8.222 7.05l1.414-1.414L16 12l-6.364 6.364-1.414-1.414z"
                    />
                  </svg>
                </span>
              </div>
            </Link>
          ))}

          {/* Se quiser completar grade em telas grandes com um “sobre” opcional */}
          {items.length % 3 !== 0 && (
            <div className="hidden md:block rounded-xl border border-white/5 p-6 bg-white/5 backdrop-blur-sm">
              <p className="text-white/80">
                Atendimento <strong>100% online</strong>, aprovação rápida e
                crédito responsável. Clique em um serviço para iniciar a
                conversa.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
