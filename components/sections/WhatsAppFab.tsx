"use client";
import Link from "next/link";
import { WhatsIcon } from "@/components/ui/BrandIcons";

export default function WhatsAppFab() {
  return (
    <Link
      href="https://wa.me/5571982333570"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Abrir WhatsApp da Sam_Creds"
      className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-whatsapp px-4 py-2 font-semibold text-black shadow-glow hover:bg-[#1ebe57]"
    >
      <WhatsIcon size={18} />
      WhatsApp
    </Link>
  );
}
