import { motion } from "framer-motion";
import { useScrollReveal } from "@/components/useScrollReveal";
import { X, Check } from "lucide-react";

const myths = [
  {
    myth: "Clinic management software fixes operational chaos.",
    reality: "Most tools only manage appointments and billing - not the full patient journey.",
  },
  {
    myth: "Staff can manually track patient journeys.",
    reality: "Manual systems break down as clinics grow beyond a handful of doctors.",
  },
  {
    myth: "Follow-ups depend on receptionists remembering.",
    reality: "Follow-ups should be automated with intelligent triggers and reminders.",
  },
];

const BeliefBreaking = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section ref={ref} className="section-padding section-alt">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary text-center mb-8 md:mb-12"
        >
          Why Most Clinic Software Fails
        </motion.h2>

        <div className="space-y-6">
          {myths.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="bg-card rounded-xl border border-border overflow-hidden shadow-sm"
            >
              <div className="grid md:grid-cols-2">
                <div className="p-6 border-b md:border-b-0 md:border-r border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <X className="w-5 h-5 text-destructive" />
                    <span className="text-sm font-semibold text-destructive uppercase tracking-wide">Myth</span>
                  </div>
                  <p className="text-foreground font-medium">{item.myth}</p>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Check className="w-5 h-5 text-accent" />
                    <span className="text-sm font-semibold text-accent uppercase tracking-wide">Reality</span>
                  </div>
                  <p className="text-foreground font-medium">{item.reality}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="text-center mt-8 md:mt-10 text-lg md:text-xl font-display font-semibold text-gradient"
        >
          This is why we created the PatientFlow System.
        </motion.p>
      </div>
    </section>
  );
};

export default BeliefBreaking;
