"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot,
  CartesianGrid,
  Area,
  LabelList,
} from "recharts";
import { useGSAPRegister } from "@/lib/gsapClient";

type KPI = { label: string; value: number; suffix?: string };

const data = [
  { ano: "2020", pct: 66 },
  { ano: "2021", pct: 70 },
  { ano: "2022", pct: 77 },
  { ano: "2023", pct: 78 },
  { ano: "2024", pct: 76 },
];

const reasons = [
  {
    title: "Atendimento humano",
    text: "Pessoas reais cuidando do seu caso.",
    emoji: "🤝",
  },
  {
    title: "Transparência",
    text: "Sem letras miúdas, sem pegadinhas.",
    emoji: "🔍",
  },
  { title: "Rapidez", text: "Análise e resposta ágeis.", emoji: "⚡" },
  { title: "Segurança", text: "Seus dados com responsabilidade.", emoji: "🛡️" },
];

export default function WhyUs() {
  const root = useRef<HTMLDivElement>(null);
  const kpiWrap = useRef<HTMLDivElement>(null);
  const { gsap, ScrollTrigger } = useGSAPRegister();

  const kpis: KPI[] = useMemo(
    () => [
      { label: "Clientes atendidos", value: 200, suffix: "+" },
      { label: "Satisfação", value: 100, suffix: "%" },
      { label: "Tempo médio de resposta", value: 30, suffix: "min" },
    ],
    []
  );
  const [kpiValues, setKpiValues] = useState<number[]>(kpis.map(() => 0));

  // Anima entrada dos cards + KPIs
  useEffect(() => {
    if (!root.current) return;

    const ctx = gsap.context(() => {
      // Cards "Por que"
      gsap.utils.toArray<HTMLElement>(".why-card").forEach((el, i) => {
        gsap.fromTo(
          el,
          { y: 16, autoAlpha: 0, filter: "blur(6px)" },
          {
            y: 0,
            autoAlpha: 1,
            filter: "blur(0px)",
            duration: 0.7,
            ease: "power3.out",
            delay: i * 0.08,
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              once: true,
            },
            clearProps: "filter,opacity,transform",
          }
        );
      });

      // KPIs: contar quando aparecerem
      if (kpiWrap.current) {
        ScrollTrigger.create({
          trigger: kpiWrap.current,
          start: "top 85%",
          once: true,
          onEnter: () => {
            kpis.forEach((k, i) => {
              const tweenObj = { v: 0 };
              gsap.to(tweenObj, {
                v: k.value,
                duration: 1.4,
                ease: "power2.out",
                onUpdate: () => {
                  setKpiValues((prev) => {
                    const next = prev.slice();
                    next[i] = tweenObj.v;
                    return next;
                  });
                },
              });
            });
          },
        });
      }
    }, root);

    return () => ctx.revert();
  }, [gsap, ScrollTrigger, kpis]);

  return (
    <div ref={root} className="why-shell max-w-6xl mx-auto px-6 space-y-10">
      {/* KPIs */}
      <div ref={kpiWrap} className="grid gap-3 sm:grid-cols-3">
        {kpis.map((k, i) => {
          const shown = Math.round(kpiValues[i] ?? 0);
          return (
            <div
              key={k.label}
              className="kpi-chip rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm"
            >
              <div className="text-2xl font-extrabold">
                {shown}
                <span className="ml-1 text-white/80">{k.suffix ?? ""}</span>
              </div>
              <div className="text-sm text-white/70">{k.label}</div>
            </div>
          );
        })}
      </div>

      {/* Razões */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {reasons.map((r) => (
          <Card
            key={r.title}
            className="why-card group bg-primary-800/40 border-white/10 transition-transform hover:-translate-y-0.5"
          >
            <CardHeader className="flex flex-row items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/10">
                {r.emoji}
              </div>
              <CardTitle className="text-white">{r.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/80 text-sm leading-relaxed">{r.text}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Gráfico */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
        <h3 className="text-lg font-semibold mb-2">
          % de famílias endividadas por ano (exemplo)
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 12, right: 22, left: -6, bottom: 6 }}
            >
              <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
              <XAxis
                dataKey="ano"
                stroke="#cfe3ff"
                tick={{ fill: "#cfe3ff" }}
                tickLine={false}
                axisLine={{ stroke: "rgba(255,255,255,0.15)" }}
              />
              <YAxis
                stroke="#cfe3ff"
                tick={{ fill: "#cfe3ff" }}
                tickLine={false}
                axisLine={{ stroke: "rgba(255,255,255,0.15)" }}
                width={48}
                tickFormatter={(v) => `${v}%`}
                domain={[0, 100]}
              />
              <Tooltip
                formatter={(val: any) => [`${val}%`, "Endividadas"]}
                labelFormatter={(label) => `Ano: ${label}`}
                contentStyle={{
                  background: "rgba(9,13,28,0.9)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 12,
                }}
                labelStyle={{ color: "#cfe3ff" }}
                itemStyle={{ color: "#fff" }}
                cursor={{
                  stroke: "rgba(255,255,255,0.25)",
                  strokeDasharray: 4,
                }}
              />

              <defs>
                <linearGradient id="whyLine" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#60a5fa" stopOpacity={0.95} />
                  <stop offset="100%" stopColor="#60a5fa" stopOpacity={0.25} />
                </linearGradient>
                <linearGradient id="whyArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#60a5fa" stopOpacity={0.22} />
                  <stop offset="100%" stopColor="#60a5fa" stopOpacity={0.02} />
                </linearGradient>
              </defs>

              <Area
                type="monotone"
                dataKey="pct"
                stroke="none"
                fill="url(#whyArea)"
              />
              <Line
                type="monotone"
                dataKey="pct"
                stroke="url(#whyLine)"
                strokeWidth={3}
                dot={{ r: 3, stroke: "#fff" }}
                activeDot={{ r: 5 }}
                isAnimationActive
              />

              {/* LabelList com render custom para garantir “%” em qualquer versão */}
              <LabelList
                dataKey="pct"
                position="top"
                content={(props: any) => {
                  const { x, y, value } = props;
                  if (x == null || y == null) return null;
                  return (
                    <text
                      x={x}
                      y={y - 6}
                      textAnchor="middle"
                      className="fill-white text-[10px]"
                    >
                      {`${value}%`}
                    </text>
                  );
                }}
              />

              <ReferenceDot
                x={data[data.length - 1].ano}
                y={data[data.length - 1].pct}
                r={6}
                fill="#60a5fa"
                stroke="#fff"
                isFront
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="mt-2 text-xs text-white/70">
          Fonte ilustrativa — somente para demonstração.
        </p>
      </div>
    </div>
  );
}
