import { motion } from "framer-motion";
import { useScrollReveal } from "@/components/useScrollReveal";
import { TrendingUp, Users, Activity } from "lucide-react";

const metrics = [
  { label: "Patient Retention", value: "94%", icon: TrendingUp, delta: "+32%" },
  { label: "Active Patients", value: "1,284", icon: Users, delta: "+18%" },
  { label: "Follow-Up Rate", value: "97%", icon: Activity, delta: "+45%" },
];

const patients = [
  "Fatima R. — Stage 3/4 · Follow-up tomorrow",
  "Omar H. — Stage 2/4 · Treatment in progress",
  "Layla S. — Stage 4/4 · Recovery complete ✓",
];

const HeroFeature = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section ref={ref} className="section-padding">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-8 md:mb-12"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-4">
            Patient Progress Tracking System
          </h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto">
            See every patient's journey in real time. Prevent drop-offs before they happen.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-2xl border border-border shadow-xl p-4 sm:p-6 md:p-8"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
            {metrics.map((m, i) => (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="bg-muted rounded-xl p-4 md:p-5 text-center"
              >
                <m.icon className="w-6 h-6 text-secondary mx-auto mb-2" />
                <p className="text-2xl md:text-3xl font-bold text-primary">{m.value}</p>
                <p className="text-xs md:text-sm text-muted-foreground">{m.label}</p>
                <span className="text-xs font-semibold text-accent">{m.delta}</span>
              </motion.div>
            ))}
          </div>

          {/* Mini patient cards */}
          <div className="space-y-3">
            {patients.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={isVisible ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="flex items-center gap-3 bg-muted/50 rounded-lg p-3 border border-border"
              >
                <div className="w-8 h-8 rounded-full gradient-navy-teal flex items-center justify-center text-primary-foreground text-xs font-bold shrink-0">
                  {p.charAt(0)}
                </div>
                <span className="text-xs sm:text-sm text-foreground truncate">{p}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroFeature;
