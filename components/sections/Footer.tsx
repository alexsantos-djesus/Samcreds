"use client";
import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer id="final" className="py-10">
      <div className="mx-auto max-w-6xl px-6 text-center text-xs text-white/70 space-y-2">
        <p>
          © {year} <span className="font-semibold text-white">Sam_Creds</span>.{" "}
          Todos os direitos reservados.
        </p>
        <p>
          Desenvolvido por{" "}
          <Link
            href="https://www.debuguei.com.br/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-white"
          >
            Debuguei
          </Link>
          .
        </p>
      </div>
    </footer>
  );
}
