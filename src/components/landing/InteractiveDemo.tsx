import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useScrollReveal } from "@/components/useScrollReveal";
import { User, ArrowRight } from "lucide-react";

const columns = ["Consultation", "Treatment", "Follow-Up", "Recovery"];
const patientNames = ["Sarah M.", "Ahmed K.", "Priya D."];

interface InteractiveDemoProps {
  onBookClick: () => void;
}

const InteractiveDemo = ({ onBookClick }: InteractiveDemoProps) => {
  const { ref, isVisible } = useScrollReveal();
  const [patientStages, setPatientStages] = useState([0, 1, 2]);

  const advancePatient = (idx: number) => {
    setPatientStages((prev) =>
      prev.map((s, i) => (i === idx ? Math.min(s + 1, columns.length - 1) : s))
    );
  };

  return (
    <section ref={ref} className="section-padding section-alt">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            See How The PatientFlow System Works
          </h2>
          <p className="text-muted-foreground text-sm md:text-base">Click a patient card to advance their journey.</p>
          <p className="text-xs text-muted-foreground/60 mt-1 sm:hidden">Tap a patient card to advance their journey</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-2xl border border-border shadow-xl overflow-hidden"
        >
          {/* Desktop: 4-column grid */}
          <div className="hidden sm:block">
            {/* Header */}
            <div className="grid grid-cols-4 border-b border-border">
              {columns.map((col) => (
                <div key={col} className="p-3 md:p-4 text-center font-display font-semibold text-sm text-primary border-r border-border last:border-r-0">
                  {col}
                </div>
              ))}
            </div>

            {/* Board */}
            <div className="grid grid-cols-4 min-h-[200px] relative">
              {columns.map((_, colIdx) => (
                <div key={colIdx} className="p-2 md:p-4 border-r border-border last:border-r-0 flex flex-col gap-2">
                  <AnimatePresence>
                    {patientNames.map((name, pIdx) =>
                      patientStages[pIdx] === colIdx ? (
                        <motion.button
                          key={name}
                          layout
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          onClick={() => advancePatient(pIdx)}
                          className="bg-muted border border-border rounded-lg p-3 text-left hover:border-secondary hover:shadow-md transition-all cursor-pointer group"
                        >
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-secondary shrink-0" />
                            <span className="text-sm font-medium text-foreground truncate">
                              {name}
                            </span>
                          </div>
                          {colIdx < columns.length - 1 && (
                            <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground group-hover:text-secondary transition-colors">
                              <span>Advance</span>
                              <ArrowRight className="w-3 h-3" />
                            </div>
                          )}
                        </motion.button>
                      ) : null
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile: vertical list of stages */}
          <div className="sm:hidden divide-y divide-border">
            {columns.map((col, colIdx) => (
              <div key={col} className="p-3">
                <p className="font-display font-semibold text-xs text-primary mb-2">{col}</p>
                <div className="flex flex-col gap-2 min-h-[40px]">
                  <AnimatePresence>
                    {patientNames.map((name, pIdx) =>
                      patientStages[pIdx] === colIdx ? (
                        <motion.button
                          key={name}
                          layout
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          onClick={() => advancePatient(pIdx)}
                          className="bg-muted border border-border rounded-lg p-2.5 text-left hover:border-secondary hover:shadow-md transition-all cursor-pointer group"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-secondary shrink-0" />
                              <span className="text-sm font-medium text-foreground">
                                {name}
                              </span>
                            </div>
                            {colIdx < columns.length - 1 && (
                              <div className="flex items-center gap-1 text-xs text-muted-foreground group-hover:text-secondary transition-colors">
                                <span>Next</span>
                                <ArrowRight className="w-3 h-3" />
                              </div>
                            )}
                          </div>
                        </motion.button>
                      ) : null
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="text-center mt-8">
          <button
            onClick={onBookClick}
            className="gradient-cta text-accent-foreground font-display font-semibold px-6 md:px-8 py-3 md:py-4 rounded-xl transition-all hover:scale-105 cta-pulse inline-flex items-center gap-2 w-full sm:w-auto justify-center text-sm md:text-base"
          >
            Get Your Free Clinic Blueprint
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default InteractiveDemo;
