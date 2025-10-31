import Intro from "@/components/sections/Intro";
import StoryScroll from "@/components/sections/StoryScroll";
import HeroSamuel from "@/components/sections/HeroSamuel";
import Services from "@/components/sections/Services";
import WhyUs from "@/components/sections/WhyUs";
import Testimonials from "@/components/sections/Testimonials";
import FAQ from "@/components/sections/FAQ";
import FinalCTA from "@/components/sections/FinalCTA";
import FloatingNav from "@/components/sections/FloatingNav";
import WhatsAppFab from "@/components/sections/WhatsAppFab";
import Footer from "@/components/sections/Footer";
import GoHomeFab from "@/components/sections/GoHomeFab";
import ScrollReset from "@/components/ScrollReset";

export default function Page() {
  return (
    <main>
      <Intro />
      <FloatingNav />
      <GoHomeFab />
      <ScrollReset initialTarget="#historia" />

      {/* História — sem título/cue */}
      <section id="historia" className="relative py-10">
        <StoryScroll />
      </section>

      {/* Chamada -> "Venha fechar conosco" */}
      <section id="chamada" className="relative py-10">
        <div className="section-cue text-center">Venha fechar conosco</div>
        <HeroSamuel />
      </section>

      {/* Serviços */}
      <section id="servicos" className="relative py-10">
        <div className="section-cue text-center">Serviços</div>
        <Services />
      </section>

      {/* Por que -> "Por que escolher a Sam_Creds" */}
      <section id="porque" className="relative py-10">
        <div className="section-cue text-center">
          Por que escolher a Sam_Creds
        </div>
        <WhyUs />
      </section>

      {/* Depoimentos */}
      <section id="depoimentos" className="relative py-10">
        <div className="section-cue text-center">Depoimentos</div>
        <Testimonials />
      </section>

      {/* FAQ */}
      <section id="faq" className="relative py-10">
        <div className="section-cue text-center">FAQ</div>
        <FAQ />
      </section>

      <FinalCTA />
      <Footer />
      <WhatsAppFab />
    </main>
  );
}
