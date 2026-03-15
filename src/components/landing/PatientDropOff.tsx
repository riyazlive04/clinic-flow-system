import { motion } from "framer-motion";
import { useScrollReveal } from "@/components/useScrollReveal";
import { ArrowRight, AlertCircle, Bot } from "lucide-react";

const funnelSteps = [
  { label: "Consultation", width: "85%", patients: "100 patients" },
  { label: "Follow-up", width: "50%", patients: "50 patients", dropOff: true },
  { label: "Booking", width: "30%", patients: "30 patients" },
];

const reasons = [
  "Forget to book procedures",
  "Delay decisions without reminders",
  "Stop responding to manual follow-ups",
];

const PatientDropOff = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section ref={ref} className="section-padding">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-3">
            Why Many Clinics Lose Patients After Consultation
          </h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
            Many clinics lose 30–50% of potential patients after consultation due to poor follow-up processes.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Funnel visualization */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.15 }}
            className="bg-card rounded-xl border border-secondary/20 p-6 shadow-sm"
          >
            <p className="text-sm font-display font-semibold text-primary mb-4">Patient Journey Funnel</p>
            <div className="space-y-3">
              {funnelSteps.map((step, i) => (
                <div key={step.label} className="relative">
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={isVisible ? { scaleX: 1 } : {}}
                    transition={{ delay: 0.3 + i * 0.15, duration: 0.5 }}
                    style={{ width: step.width, minWidth: "fit-content", transformOrigin: "left" }}
                    className={`rounded-lg py-3 px-4 flex items-center justify-between gap-3 ${
                      step.dropOff
                        ? "bg-destructive/10 border border-destructive/20"
                        : "gradient-navy-teal"
                    }`}
                  >
                    <span
                      className={`text-sm font-semibold ${
                        step.dropOff ? "text-destructive" : "text-primary-foreground"
                      }`}
                    >
                      {step.label}
                    </span>
                    <span
                      className={`text-xs ${
                        step.dropOff ? "text-destructive/70" : "text-primary-foreground/70"
                      }`}
                    >
                      {step.patients}
                    </span>
                  </motion.div>
                  {step.dropOff && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={isVisible ? { opacity: 1 } : {}}
                      transition={{ delay: 0.7 }}
                      className="flex items-center gap-1.5 mt-1 ml-2"
                    >
                      <AlertCircle className="w-3.5 h-3.5 text-destructive" />
                      <span className="text-xs text-destructive">50% drop-off point</span>
                    </motion.div>
                  )}
                </div>
              ))}
            </div>

            {/* Recovery arrow */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isVisible ? { opacity: 1 } : {}}
              transition={{ delay: 0.9 }}
              className="mt-4 flex items-center gap-2 bg-secondary/10 rounded-lg p-3"
            >
              <Bot className="w-4 h-4 text-secondary shrink-0" />
              <span className="text-xs text-secondary font-medium">
                Automation recovers up to 40% of lost patients
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-secondary shrink-0" />
            </motion.div>
          </motion.div>

          {/* Insight text */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.25 }}
            className="space-y-5"
          >
            <div>
              <p className="text-sm font-display font-semibold text-primary mb-3">Patients often:</p>
              <ul className="space-y-2">
                {reasons.map((r) => (
                  <li key={r} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-destructive/60 mt-1.5 shrink-0" />
                    {r}
                  </li>
                ))}
              </ul>
              <p className="text-sm text-muted-foreground mt-3">
                Without structured follow-up systems, these patients are simply lost.
              </p>
            </div>

            <div className="bg-card rounded-xl border border-secondary/20 p-5 shadow-sm">
              <p className="text-sm text-foreground leading-relaxed">
                We analyse where patients drop off after consultation and identify opportunities where{" "}
                <span className="text-secondary font-medium">automation and structured follow-ups</span>{" "}
                can recover these patients.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PatientDropOff;
