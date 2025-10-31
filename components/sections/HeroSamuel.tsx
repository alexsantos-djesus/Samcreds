"use client";
import Image from "next/image";
import { useRef, useEffect } from "react";
import { useGSAPRegister } from "@/lib/gsapClient";
import { Button } from "@/components/ui/button";
import { WhatsIcon } from "@/components/ui/BrandIcons";

export default function HeroSamuel() {
  const root = useRef<HTMLDivElement>(null);
  const { gsap } = useGSAPRegister();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".hero-title, .hero-sub, .hero-copy", {
        y: 24,
        opacity: 0,
        stagger: 0.15,
        duration: 0.6,
        ease: "power2",
      });
    }, root);
    return () => ctx.revert();
  }, [gsap]);

  return (
    <div
      ref={root}
      className="relative max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-center px-6"
    >
      <div className="order-2 md:order-1 space-y-4">
        <h1 className="hero-title text-4xl md:text-5xl font-extrabold">
          Organize suas finanças com a{" "}
          <span className="text-whatsapp">Sam_Creds</span>
        </h1>
        <p className="hero-sub text-xl text-white/90">
          Atendimento 100% online, aprovação rápida.
        </p>
        <p className="hero-copy text-white/80">
          Crédito responsável e transparente. Vamos conversar?
        </p>
        <Button
          asChild
          size="lg"
          className="bg-whatsapp hover:bg-[#1ebe57] text-black font-bold rounded-full shadow-glow animate-pulseRing"
        >
          <a
            href="https://wa.me/5571982333570"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Falar no WhatsApp"
          >
            <span className="inline-flex items-center gap-2">
              <WhatsIcon size={18} />
              Falar agora
            </span>
          </a>
        </Button>
      </div>
      <div className="order-1 md:order-2 justify-self-center">
        <div className="[perspective:1000px]">
          <div className="relative w-[260px] sm:w-[320px] md:w-[440px] will-change-transform hover:[transform:rotateY(6deg)_rotateX(2deg)] transition-transform">
            <Image
              src="/assets/Samuel.png"
              alt="Consultor Samuel — Sam_Creds"
              width={600}
              height={800}
              priority
              className="rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
