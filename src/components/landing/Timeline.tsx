import { motion } from "framer-motion";
import { useScrollReveal } from "@/components/useScrollReveal";
import { Search, FileText, Wrench, Zap, GraduationCap } from "lucide-react";

const steps = [
  { icon: Search, label: "Clinic Workflow Audit", days: "Days 1–5" },
  { icon: FileText, label: "System Blueprint", days: "Days 6–12" },
  { icon: Wrench, label: "Custom System Build", days: "Days 13–28" },
  { icon: Zap, label: "Automation Setup", days: "Days 29–38" },
  { icon: GraduationCap, label: "Team Onboarding", days: "Days 39–45" },
];

const Timeline = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section ref={ref} className="section-padding section-alt">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-8 md:mb-14"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-4">
            Your Clinic System Can Be Running In 30–45 Days
          </h2>
        </motion.div>

        <div className="relative">
          {/* Line */}
          <div className="hidden md:block absolute top-8 left-0 right-0 h-0.5 bg-border" />
          <motion.div
            className="hidden md:block absolute top-8 left-0 h-0.5 gradient-navy-teal"
            initial={{ width: 0 }}
            animate={isVisible ? { width: "100%" } : { width: 0 }}
            transition={{ duration: 1.5, delay: 0.3 }}
          />

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={step.label}
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 + i * 0.15 }}
                className="flex md:flex-col items-center md:items-center gap-4 md:gap-0 text-left md:text-center"
              >
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-full gradient-navy-teal flex items-center justify-center md:mx-auto md:mb-3 relative z-10 shrink-0">
                  <step.icon className="w-6 h-6 md:w-7 md:h-7 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-sm text-foreground mb-0.5 md:mb-1">{step.label}</h3>
                  <p className="text-xs text-muted-foreground">{step.days}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Timeline;
