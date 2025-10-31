"use client";
import { useEffect, useRef } from "react";
import { useGSAPRegister } from "@/lib/gsapClient";

export default function ChamadaToServicosWipe() {
  const root = useRef<HTMLElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const { gsap, ScrollTrigger } = useGSAPRegister();

  useEffect(() => {
    if (!root.current || !bar.current) return;

    const chamada = document.getElementById("chamada");
    const servicos = document.getElementById("servicos");
    if (!chamada || !servicos) return;

    const ctx = gsap.context(() => {
      // estado base
      gsap.set(bar.current, { xPercent: -30, rotate: -2, opacity: 0 });

      // Timeline curtinha: quando a dobra do wipe entra, barra cruza diagonal
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current!,
          start: "top 80%",
          end: "bottom 40%",
          scrub: true,
        },
        defaults: { ease: "power3.out" },
      });

      tl.to(bar.current, { opacity: 1, duration: 0.2 })
        .to(bar.current, { xPercent: 35, rotate: 2, duration: 0.8 }, "<")
        .to(bar.current, { opacity: 0.18, duration: 0.6 }, "-=0.3");

      // Ao sair do wipe (chegando em Serviços), abre a máscara dos cards
      ScrollTrigger.create({
        trigger: servicos,
        start: "top 92%",
        once: true,
        onEnter: () => {
          gsap.to("#servicos .srv-reveal", {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 0.9,
            ease: "power3.out",
          });
        },
      });
    }, root);

    return () => ctx.revert();
  }, [gsap, ScrollTrigger]);

  return (
    <section
      ref={root}
      aria-label="Transição para Serviços"
      className="relative h-[120px] md:h-[160px]"
    >
      {/* barra diagonal que atravessa */}
      <div
        ref={bar}
        className="absolute left-[-10%] right-[-10%] top-1/2 -translate-y-1/2 h-[68px] md:h-[88px] rounded-2xl blur-md"
        style={{
          background:
            "linear-gradient(90deg, rgba(96,165,250,0.0) 0%, rgba(96,165,250,0.5) 20%, rgba(37,211,102,0.45) 50%, rgba(96,165,250,0.5) 80%, rgba(96,165,250,0.0) 100%)",
        }}
      />
    </section>
  );
}
