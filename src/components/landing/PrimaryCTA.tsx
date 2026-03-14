import { motion } from "framer-motion";
import { useScrollReveal } from "@/components/useScrollReveal";
import { ArrowRight } from "lucide-react";

interface PrimaryCTAProps {
  onBookClick: () => void;
}

const PrimaryCTA = ({ onBookClick }: PrimaryCTAProps) => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section ref={ref} className="section-padding gradient-navy-teal relative overflow-hidden">
      {/* Decorative dots */}
      <div className="absolute inset-0 opacity-10">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-primary-foreground"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="max-w-3xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4 md:mb-6">
            Your Clinic Should Run Like A System - Not Chaos
          </h2>
          <button
            onClick={onBookClick}
            className="bg-accent text-accent-foreground font-display font-bold px-6 md:px-10 py-4 md:py-5 rounded-xl text-base md:text-lg transition-all hover:scale-105 cta-pulse inline-flex items-center gap-2 text-center"
          >
            Claim Your Free Clinic System Blueprint
            <ArrowRight className="w-6 h-6" />
          </button>
          <p className="text-primary-foreground/70 text-sm mt-4 max-w-md mx-auto">
            Includes a free branch performance blueprint and system audit.
          </p>
          <p className="text-primary-foreground/50 text-xs mt-2">
            Only 10 system audit slots available per week.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default PrimaryCTA;
