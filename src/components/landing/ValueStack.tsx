import { motion } from "framer-motion";
import { useScrollReveal } from "@/components/useScrollReveal";
import { CheckCircle2, ArrowRight } from "lucide-react";

import { FileText, ClipboardCheck, Clock } from "lucide-react";

const items = [
  "Clinic workflow audit",
  "Patient journey mapping",
  "Automation opportunity analysis",
  "System architecture blueprint",
];

interface ValueStackProps {
  onBookClick: () => void;
}

const ValueStack = ({ onBookClick }: ValueStackProps) => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section ref={ref} className="section-padding">
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-6 md:mb-10">
            What You Get In The Free Clinic Blueprint
          </h2>
        </motion.div>

        <div className="space-y-4 mb-8">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={isVisible ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="bg-card rounded-xl border border-border p-5 flex items-center gap-4 shadow-sm text-left"
            >
              <CheckCircle2 className="w-6 h-6 text-accent shrink-0" />
              <span className="font-medium text-foreground">{item}</span>
            </motion.div>
          ))}
        </div>

        {/* Free Branch Performance Blueprint card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
          className="bg-card rounded-xl border border-secondary/20 p-6 shadow-sm text-left mb-8"
        >
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-primary text-lg mb-1">
                Free Branch Performance Blueprint
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-2">
                After your consultation, you receive a clear blueprint showing how branch performance should be structured.
              </p>
              <ul className="space-y-1">
                {["Branch reporting framework", "Operational workflow improvements", "Process standardization plan"].map((b) => (
                  <li key={b} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 shrink-0" />
                    {b}
                  </li>
                ))}
              </ul>
              <p className="text-xs text-secondary italic mt-2">Provided even if you decide not to proceed.</p>
            </div>
          </div>
        </motion.div>

        {/* System Audit card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.55 }}
          className="bg-card rounded-xl border border-secondary/20 p-6 shadow-sm text-left mb-8"
        >
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
              <ClipboardCheck className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-primary text-lg mb-1">
                Free Multi-Branch System Audit
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-2">
                During the consultation we conduct a system audit to identify operational gaps across your branches.
              </p>
              <ul className="space-y-1 mb-3">
                {["Missing reporting systems", "Follow-up inefficiencies", "Operational bottlenecks", "Opportunities for automation"].map((b) => (
                  <li key={b} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 shrink-0" />
                    {b}
                  </li>
                ))}
              </ul>
              <div className="flex items-center gap-2 text-xs text-secondary">
                <Clock className="w-3.5 h-3.5" />
                <span className="italic">Limited to 10 system audits per week to maintain implementation quality.</span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
        >
          <p className="text-muted-foreground mb-1">
            Estimated value: <span className="line-through">₹25,000+</span>
          </p>
          <p className="text-2xl font-display font-bold text-accent mb-8">Free.</p>
          <button
            onClick={onBookClick}
            className="gradient-cta text-accent-foreground font-display font-semibold px-6 md:px-8 py-3 md:py-4 rounded-xl transition-all hover:scale-105 cta-pulse inline-flex items-center gap-2 w-full sm:w-auto justify-center text-sm md:text-base"
          >
            Claim Your Free Clinic Blueprint
            <ArrowRight className="w-5 h-5" />
          </button>
          <p className="text-xs text-muted-foreground mt-3">
            Includes a free branch performance blueprint and system audit.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ValueStack;
