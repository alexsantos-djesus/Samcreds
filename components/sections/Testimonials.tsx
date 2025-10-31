"use client";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Navigation,
  Pagination,
  Autoplay,
  EffectCoverflow,
  EffectFade,
} from "swiper/modules";
import { useEffect, useRef } from "react";
import { useGSAPRegister } from "@/lib/gsapClient";

const prints = ["1.jpeg", "2.jpeg", "3.jpeg", "4.jpeg", "5.jpeg", "6.jpeg"];

export default function Testimonials() {
  const sec = useRef<HTMLDivElement>(null);
  const { gsap, ScrollTrigger } = useGSAPRegister();

  useEffect(() => {
    const ctx = gsap.context(() => {
      const ov = gsap.to(".testimonials-overlay", {
        opacity: 0.35,
        ease: "none",
        scrollTrigger: {
          trigger: sec.current!,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
      return () => {
        ov?.kill();
      };
    }, sec);
    return () => ctx.revert();
  }, [gsap, ScrollTrigger]);

  return (
    <div ref={sec} className="relative max-w-6xl mx-auto px-6">
      <div className="absolute inset-0 testimonials-overlay bg-black/0 transition" />
      <Swiper
        modules={[
          Navigation,
          Pagination,
          Autoplay,
          EffectCoverflow,
          EffectFade,
        ]}
        effect="coverflow"
        autoplay={{ delay: 2200, disableOnInteraction: false }}
        navigation
        pagination={{ clickable: true }}
        grabCursor
        centeredSlides
        slidesPerView={1.3}
        breakpoints={{
          768: { slidesPerView: 2.2 },
          1024: { slidesPerView: 3.2 },
        }}
        coverflowEffect={{
          rotate: 12,
          stretch: 0,
          depth: 180,
          modifier: 1,
          slideShadows: false,
        }}
        className="[--swiper-pagination-color:theme(colors.whatsapp)] [--swiper-navigation-color:#fff]"
      >
        {prints.map((p, i) => (
          <SwiperSlide key={i}>
            <div className="flex items-center justify-center py-8">
              <div className="h-[400px] w-auto rounded-xl shadow-2xl overflow-hidden">
                <Image
                  src={`/assets/${p}`}
                  alt={`Depoimento ${i + 1}`}
                  width={360}
                  height={400}
                  className="h-[400px] w-auto object-cover rounded-xl"
                />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
