import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface HeroSectionProps {
  onBookClick: () => void;
}

const stages = ["Consultation", "Treatment", "Follow-Up", "Recovery"];

const HeroSection = ({ onBookClick }: HeroSectionProps) => {
  return (
    <section className="min-h-[100svh] flex items-center pt-24 md:pt-28 section-padding overflow-hidden">
      <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
        {/* Left */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex items-center gap-2 bg-muted rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 rounded-full bg-accent" />
            <span className="text-sm font-medium text-muted-foreground">
              Healthcare Automation Platform
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-primary mb-4 md:mb-6">
            Turn Your Clinic Into a{" "}
            <span className="text-gradient">Structured Patient Journey</span>{" "}
            System
          </h1>
          <p className="text-base md:text-lg text-muted-foreground mb-6 md:mb-8 max-w-lg leading-relaxed">
            Track every patient from consultation to recovery, automate
            follow-ups, and manage doctors across branches using one intelligent
            clinic system.
          </p>
          <button
            onClick={onBookClick}
            className="gradient-cta text-accent-foreground font-display font-semibold px-6 md:px-8 py-3 md:py-4 rounded-xl text-sm md:text-base transition-all duration-200 hover:brightness-90 hover:scale-105 cta-pulse inline-flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            Book Your Free Clinic System Blueprint
            <ArrowRight className="w-5 h-5" />
          </button>
          <p className="text-sm text-muted-foreground mt-4">
            Free patient journey analysis + automation blueprint.
          </p>
        </motion.div>

        {/* Right – animated pipeline */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative"
        >
          <div className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-xl">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-3 h-3 rounded-full bg-destructive/60" />
              <div className="w-3 h-3 rounded-full bg-accent/60" />
              <div className="w-3 h-3 rounded-full bg-secondary/60" />
              <span className="ml-2 text-sm font-medium text-muted-foreground">
                PatientFlow Pipeline
              </span>
            </div>

            <div className="space-y-4">
              {stages.map((stage, i) => (
                <motion.div
                  key={stage}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + i * 0.2, duration: 0.5 }}
                  className="flex items-center gap-4"
                >
                  <div className="w-10 h-10 rounded-lg gradient-navy-teal flex items-center justify-center text-primary-foreground font-bold text-sm shrink-0">
                    {i + 1}
                  </div>
                  <div className="flex-1 bg-muted rounded-lg p-3 border border-border">
                    <div className="flex items-center justify-between">
                      <span className="font-display font-semibold text-foreground">
                        {stage}
                      </span>
                      <motion.div
                        className="h-2 rounded-full bg-accent"
                        initial={{ width: 0 }}
                        animate={{ width: `${90 - i * 15}%` }}
                        transition={{ delay: 1 + i * 0.2, duration: 0.8 }}
                        style={{ maxWidth: 120 }}
                      />
                    </div>
                  </div>
                  {i < stages.length - 1 && (
                    <motion.div
                      className="absolute right-12 text-secondary"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 + i * 0.2 }}
                    />
                  )}
                </motion.div>
              ))}
            </div>

            {/* Decorative network lines */}
            <svg
              className="absolute -top-4 -right-4 w-24 h-24 opacity-20"
              viewBox="0 0 100 100"
            >
              <circle cx="20" cy="20" r="4" fill="hsl(215, 70%, 48%)" />
              <circle cx="80" cy="30" r="3" fill="hsl(215, 70%, 48%)" />
              <circle cx="50" cy="80" r="5" fill="hsl(215, 70%, 48%)" />
              <line
                x1="20" y1="20" x2="80" y2="30"
                stroke="hsl(215, 70%, 48%)" strokeWidth="1" className="animate-flow-line"
              />
              <line
                x1="80" y1="30" x2="50" y2="80"
                stroke="hsl(215, 70%, 48%)" strokeWidth="1" className="animate-flow-line"
              />
            </svg>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
