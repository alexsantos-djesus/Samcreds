"use client";
import { useEffect } from "react";

export default function ScrollReset({
  initialTarget = "#historia",
}: {
  initialTarget?: string;
}) {
  useEffect(() => {
    // desliga a restauração automática de scroll
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    // sempre que a página monta, leva pra primeira tela (História)
    const goStart = () => {
      const el = document.querySelector(initialTarget) as HTMLElement | null;
      if (el) {
        // usa auto no primeiro paint para não “piscar” animações
        el.scrollIntoView({ behavior: "auto", block: "start" });
      } else {
        window.scrollTo({ top: 0, behavior: "auto" });
      }
    };

    goStart();

    // segurança: se voltar de histórico/visibility, também reseta
    const onShow = () => goStart();
    document.addEventListener("visibilitychange", onShow);

    return () => document.removeEventListener("visibilitychange", onShow);
  }, [initialTarget]);

  return null;
}
