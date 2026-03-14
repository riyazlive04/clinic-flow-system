import { motion } from "framer-motion";
import { useScrollReveal } from "@/components/useScrollReveal";
import { AlertTriangle, Clock, Users, MessageSquareOff } from "lucide-react";

const dropOffCauses = [
  { icon: MessageSquareOff, label: "Missed Follow-Ups", pct: 35 },
  { icon: Clock, label: "Manual Tracking", pct: 25 },
  { icon: Users, label: "Staff Overload", pct: 22 },
  { icon: AlertTriangle, label: "Inconsistent Engagement", pct: 18 },
];

const ProblemSection = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section ref={ref} className="section-padding section-alt">
      <div className="max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-4">
            Why Most Clinics Lose Patients After The First Consultation
          </h2>
          <p className="text-sm md:text-base text-muted-foreground mb-8 md:mb-12 max-w-2xl mx-auto">
            Out of 100 patients who begin treatment, only 30 complete the full journey.
          </p>
        </motion.div>

        {/* Funnel visualization */}
        <div className="flex flex-col items-center mb-12">
          {[100, 70, 48, 30].map((num, i) => (
            <motion.div
              key={num}
              initial={{ opacity: 0, scaleX: 0 }}
              animate={isVisible ? { opacity: 1, scaleX: 1 } : {}}
              transition={{ delay: 0.2 + i * 0.15, duration: 0.5 }}
              className="gradient-navy-teal text-primary-foreground font-display font-bold py-3 rounded-lg mb-2 flex items-center justify-center"
              style={{ width: `${30 + num * 0.5}%`, minWidth: 120 }}
            >
              {num} patients
            </motion.div>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {dropOffCauses.map((cause, i) => (
            <motion.div
              key={cause.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
              className="bg-card rounded-xl p-6 border border-border shadow-sm text-center"
            >
              <cause.icon className="w-8 h-8 text-secondary mx-auto mb-3" />
              <p className="font-display font-semibold text-foreground">{cause.label}</p>
              <p className="text-2xl font-bold text-primary mt-1">{cause.pct}%</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
