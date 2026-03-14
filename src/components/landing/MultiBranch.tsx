import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useScrollReveal } from "@/components/useScrollReveal";
import { Building2, TrendingUp, BarChart3, Users, GitBranch, HeartPulse } from "lucide-react";
import { useEffect, useRef } from "react";

/* ── Animated Counter ── */
const Counter = ({ value, suffix = "", prefix = "" }: { value: number; suffix?: string; prefix?: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const { ref: scrollRef, isVisible } = useScrollReveal();
  const motionVal = useMotionValue(0);
  const rounded = useTransform(motionVal, (v) => Math.round(v));

  useEffect(() => {
    if (!isVisible) return;
    const controls = animate(motionVal, value, { duration: 2, ease: "easeOut" });
    return controls.stop;
  }, [isVisible, value, motionVal]);

  useEffect(() => {
    const unsub = rounded.on("change", (v) => {
      if (ref.current) ref.current.textContent = `${prefix}${v.toLocaleString()}${suffix}`;
    });
    return unsub;
  }, [rounded, prefix, suffix]);

  return (
    <span ref={(el) => {
      (ref as any).current = el;
      (scrollRef as any).current = el;
    }}>
      {prefix}0{suffix}
    </span>
  );
};

const metrics = [
  { icon: Users, label: "Patients Managed", value: 12480, suffix: "+" },
  { icon: GitBranch, label: "Active Branches", value: 36, suffix: "" },
  { icon: HeartPulse, label: "Treatment Completion", value: 94, suffix: "%" },
];

const revenueData = [
  { label: "Branch A", values: [40, 55, 65, 80, 72, 90] },
  { label: "Branch B", values: [30, 42, 58, 50, 68, 75] },
];

const trendPoints = [20, 35, 30, 50, 45, 65, 60, 78, 85, 92];

const rankings = [
  { name: "Downtown Clinic", score: 94 },
  { name: "Westside Branch", score: 87 },
  { name: "Northgate Center", score: 79 },
  { name: "Eastpark Clinic", score: 72 },
];

const toPath = (points: number[], w: number, h: number) => {
  const stepX = w / (points.length - 1);
  return points
    .map((p, i) => `${i === 0 ? "M" : "L"}${i * stepX},${h - (p / 100) * h}`)
    .join(" ");
};

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

const MultiBranch = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section ref={ref} className="section-padding section-alt">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-4">
            Manage All Your Clinics From One Dashboard
          </h2>
        </motion.div>

        {/* Animated Counters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-10">
          {metrics.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 16 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.15 + i * 0.1 }}
              className="text-center p-4 md:p-5 rounded-xl bg-card border border-border shadow-sm"
            >
              <m.icon className="w-6 h-6 text-secondary mx-auto mb-2" />
              <div className="text-2xl md:text-3xl font-bold text-primary">
                <Counter value={m.value} suffix={m.suffix} />
              </div>
              <span className="text-xs text-muted-foreground">{m.label}</span>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Revenue Comparison */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="bg-primary rounded-xl p-6 shadow-lg"
          >
            <div className="flex items-center gap-2 mb-5">
              <Building2 className="w-5 h-5 text-secondary" />
              <span className="font-display font-semibold text-sm text-primary-foreground">
                Revenue Comparison
              </span>
            </div>
            <svg viewBox="0 0 200 120" className="w-full h-36" preserveAspectRatio="xMidYMax meet">
              {/* Grid lines */}
              {[0, 30, 60, 90, 120].map((y) => (
                <line key={y} x1={0} y1={y} x2={200} y2={y} stroke="white" strokeOpacity={0.06} />
              ))}
              {revenueData[0].values.map((v, i) => {
                const bw = 10;
                const gap = 3;
                const groupW = bw * 2 + gap;
                const spacing = 200 / 6;
                const x = spacing * i + (spacing - groupW) / 2;
                const h1 = (v / 100) * 110;
                const h2 = (revenueData[1].values[i] / 100) * 110;
                return (
                  <g key={i}>
                    <motion.rect
                      x={x}
                      y={120 - h1}
                      width={bw}
                      rx={3}
                      fill="hsl(215 70% 48%)"
                      initial={{ height: 0, y: 120 }}
                      animate={isVisible ? { height: h1, y: 120 - h1 } : {}}
                      transition={{ delay: 0.5 + i * 0.08, duration: 0.5 }}
                    />
                    <motion.rect
                      x={x + bw + gap}
                      y={120 - h2}
                      width={bw}
                      rx={3}
                      fill="hsl(215 70% 48% / 0.35)"
                      initial={{ height: 0, y: 120 }}
                      animate={isVisible ? { height: h2, y: 120 - h2 } : {}}
                      transition={{ delay: 0.55 + i * 0.08, duration: 0.5 }}
                    />
                  </g>
                );
              })}
            </svg>
            <div className="flex mt-3">
              {months.map((m) => (
                <span key={m} className="flex-1 text-center text-[10px] text-primary-foreground/50">
                  {m}
                </span>
              ))}
            </div>
            <div className="flex gap-4 mt-3">
              <span className="flex items-center gap-1.5 text-[10px] text-primary-foreground/70">
                <span className="w-2 h-2 rounded-sm bg-secondary inline-block" /> Branch A
              </span>
              <span className="flex items-center gap-1.5 text-[10px] text-primary-foreground/70">
                <span className="w-2 h-2 rounded-sm bg-secondary/40 inline-block" /> Branch B
              </span>
            </div>
          </motion.div>

          {/* Performance Trend */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.35 }}
            className="bg-primary rounded-xl p-6 shadow-lg"
          >
            <div className="flex items-center gap-2 mb-5">
              <TrendingUp className="w-5 h-5 text-secondary" />
              <span className="font-display font-semibold text-sm text-primary-foreground">
                Performance Trend
              </span>
            </div>
            <div className="h-36 relative">
              {[0, 25, 50, 75, 100].map((v) => (
                <div
                  key={v}
                  className="absolute w-full border-t border-primary-foreground/10"
                  style={{ bottom: `${v}%` }}
                />
              ))}
              <svg viewBox="0 0 200 120" className="w-full h-full" preserveAspectRatio="none">
                <motion.path
                  d={toPath(trendPoints, 200, 120)}
                  fill="none"
                  stroke="hsl(215 70% 48%)"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={isVisible ? { pathLength: 1 } : { pathLength: 0 }}
                  transition={{ delay: 0.6, duration: 1.2, ease: "easeOut" }}
                />
                <motion.path
                  d={`${toPath(trendPoints, 200, 120)} L200,120 L0,120 Z`}
                  fill="hsl(215 70% 48% / 0.15)"
                  initial={{ opacity: 0 }}
                  animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ delay: 1.2, duration: 0.5 }}
                />
              </svg>
            </div>
            <div className="flex justify-between mt-3">
              {["W1", "W2", "W3", "W4", "W5"].map((w) => (
                <span key={w} className="text-[10px] text-primary-foreground/50">{w}</span>
              ))}
            </div>
          </motion.div>

          {/* Branch Rankings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5 }}
            className="bg-primary rounded-xl p-6 shadow-lg"
          >
            <div className="flex items-center gap-2 mb-5">
              <BarChart3 className="w-5 h-5 text-secondary" />
              <span className="font-display font-semibold text-sm text-primary-foreground">
                Branch Rankings
              </span>
            </div>
            <div className="space-y-4">
              {rankings.map((r, i) => (
                <div key={r.name}>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-primary-foreground/70">{r.name}</span>
                    <span className="text-xs font-semibold text-secondary">{r.score}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-primary-foreground/10">
                    <motion.div
                      className="h-full rounded-full bg-secondary"
                      initial={{ width: 0 }}
                      animate={isVisible ? { width: `${r.score}%` } : { width: 0 }}
                      transition={{ delay: 0.6 + i * 0.12, duration: 0.7 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default MultiBranch;
