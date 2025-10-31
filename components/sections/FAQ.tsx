"use client";
import { useEffect, useRef } from "react";
import { useGSAPRegister } from "@/lib/gsapClient";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

type QA = { q: string; a: string | string[] };

const items: QA[] = [
  {
    q: "Em quanto tempo o FGTS cai na conta?",
    a: "O valor é creditado em até 10 minutos após a liberação.",
  },
  {
    q: "Em quanto tempo cai o Empréstimo Bolsa Família?",
    a: "O valor é depositado em até 24 horas.",
  },
  {
    q: "O que preciso fazer para antecipar o FGTS?",
    a: "Basta liberar o banco BMP e enviar o seu CPF para análise.",
  },
  {
    q: "Quais os requisitos para fazer o Empréstimo Bolsa Família?",
    a: [
      "Receber o benefício a partir de R$ 400,00",
      "Receber pelo aplicativo Caixa Tem",
      "Possuir documentos com foto",
    ],
  },
  {
    q: "Quais os requisitos para o Empréstimo CLT?",
    a: "É necessário ter, no mínimo, 1 ano de carteira assinada.",
  },
  {
    q: "O que é necessário para fazer o Empréstimo na Conta de Energia?",
    a: [
      "Ter consumo mínimo de R$ 60,00 na conta de energia",
      "Não ter mais de um boleto em aberto",
    ],
  },
  {
    q: "Vocês atendem fora de Salvador?",
    a: "Sim! Nosso atendimento é 100% online e disponível para todo o Brasil.",
  },
  {
    q: "É tudo feito online?",
    a: "Sim! O processo é totalmente digital, rápido e seguro, realizado pelo WhatsApp.",
  },
];

export default function FAQCinematic() {
  const wrap = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const qRef = useRef<HTMLHeadingElement>(null);
  const aWrapRef = useRef<HTMLDivElement>(null);

  const { gsap, ScrollTrigger } = useGSAPRegister();
  const reduce = usePrefersReducedMotion();

  const setAnswers = (ans: string | string[]) => {
    const box = aWrapRef.current!;
    box.innerHTML = "";
    (Array.isArray(ans) ? ans : [ans]).forEach((text) => {
      const p = document.createElement("p");
      p.className = "text-base md:text-lg text-white/85";
      p.textContent = text;
      box.appendChild(p);
    });
  };

  useEffect(() => {
    if (!wrap.current || !qRef.current || !aWrapRef.current) return;

    // começa SEM nada visível
    gsap.set([qRef.current, aWrapRef.current], { opacity: 0 });

    if (reduce) {
      const container = stage.current!;
      container.innerHTML = `
        <div class="max-w-3xl mx-auto px-6 py-16">
          ${items
            .map(
              (it) => `
            <div class="mb-10">
              <h3 class="text-3xl font-extrabold mb-2">${it.q}</h3>
              ${(Array.isArray(it.a) ? it.a : [it.a])
                .map((t) => `<p class="text-white/85">${t}</p>`)
                .join("")}
            </div>
          `
            )
            .join("")}
        </div>`;
      return;
    }

    let current = -1;
    const THRESH = 0.04; // 4% de progresso para começar a mostrar

    const showBlank = () => {
      const qEl = qRef.current!,
        aEl = aWrapRef.current!;
      gsap.to([qEl, aEl], {
        opacity: 0,
        y: 0,
        filter: "blur(0px)",
        duration: 0.18,
      });
      current = -1;
    };

    const showStep = (idx: number) => {
      const qEl = qRef.current!,
        aEl = aWrapRef.current!;
      const it = items[idx];
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.to([qEl, aEl], {
        opacity: 0,
        y: -18,
        filter: "blur(6px)",
        duration: 0.2,
      });

      tl.add(() => {
        qEl.textContent = it.q;
        setAnswers(it.a);
      });

      tl.fromTo(
        qEl,
        { opacity: 0, y: 24, scale: 0.98, filter: "blur(8px)" },
        { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 0.3 }
      );
      tl.fromTo(
        aEl,
        { opacity: 0, y: 12, filter: "blur(6px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.26 },
        "-=0.06"
      );

      current = idx;
    };

    const st = ScrollTrigger.create({
      trigger: wrap.current,
      start: "top top",
      end: `+=${window.innerHeight * (items.length + 0.5)}`,
      pin: true,
      scrub: true,
      onUpdate: (self) => {
        const p = self.progress;

        // antes do limiar: nada visível (transição limpa com a seção anterior)
        if (p < THRESH) {
          if (current !== -1) showBlank();
          return;
        }

        // calcula o índice alvo e troca quando necessário
        const idx = Math.min(
          items.length - 1,
          Math.max(
            0,
            Math.round(((p - THRESH) / (1 - THRESH)) * (items.length - 1))
          )
        );
        if (idx !== current) showStep(idx);
      },
      onLeave: showBlank,
      onLeaveBack: showBlank,
      snap: {
        snapTo: (v) => {
          if (v < THRESH) return 0;
          const span = (v - THRESH) / (1 - THRESH);
          const snapped =
            Math.round(span * (items.length - 1)) / (items.length - 1);
          return THRESH + snapped * (1 - THRESH);
        },
        duration: 0.18,
        ease: "power1.inOut",
      },
    });

    return () => st.kill();
  }, [gsap, ScrollTrigger, reduce]);

  return (
    <section ref={wrap} className="relative w-full h-screen">
      <div
        ref={stage}
        className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
      >
        <h3
          ref={qRef}
          className="text-3xl md:text-5xl font-extrabold leading-tight tracking-tight"
          aria-live="polite"
        />
        <div
          ref={aWrapRef}
          className="mt-5 max-w-3xl space-y-2"
          aria-live="polite"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 backdrop-blur-[1.5px]"
          style={{
            WebkitMaskImage:
              "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 64%, rgba(0,0,0,0.55) 84%, rgba(0,0,0,1) 96%)",
            maskImage:
              "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 64%, rgba(0,0,0,0.55) 84%, rgba(0,0,0,1) 96%)",
          }}
        />
      </div>
    </section>
  );
}
