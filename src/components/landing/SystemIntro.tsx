import { motion } from "framer-motion";
import { useScrollReveal } from "@/components/useScrollReveal";
import { Stethoscope, ClipboardList, Bell, HeartPulse } from "lucide-react";

const lifecycle = [
  { icon: Stethoscope, label: "Consultation", desc: "Capture patient data and treatment intent" },
  { icon: ClipboardList, label: "Treatment Plan", desc: "Assign doctors, timelines, and milestones" },
  { icon: Bell, label: "Follow-Ups", desc: "Automated reminders and check-ins" },
  { icon: HeartPulse, label: "Recovery Tracking", desc: "Monitor outcomes and satisfaction" },
];

const SystemIntro = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section ref={ref} className="section-padding">
      <div className="max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4">
            The PatientFlow System
          </h2>
          <p className="text-sm md:text-lg text-muted-foreground mb-8 md:mb-14 max-w-2xl mx-auto">
            A patient journey automation framework designed for growing clinics.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {lifecycle.map((stage, i) => (
            <motion.div
              key={stage.label}
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + i * 0.15, duration: 0.5 }}
              className="relative bg-card rounded-2xl border border-border p-6 shadow-sm hover:shadow-lg hover:border-secondary/50 transition-all duration-300 group"
            >
              <div className="w-14 h-14 rounded-xl gradient-navy-teal flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                <stage.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="font-display font-bold text-foreground mb-2">{stage.label}</h3>
              <p className="text-sm text-muted-foreground">{stage.desc}</p>
              {i < lifecycle.length - 1 && (
                <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 text-secondary text-2xl">
                  →
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SystemIntro;
