import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useScrollReveal } from "@/components/useScrollReveal";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const questions = [
  {
    q: "How do you track patient follow-ups?",
    options: ["Manually (spreadsheets/paper)", "Basic CRM", "Automated system", "We don't track consistently"],
    scores: [3, 2, 0, 4],
  },
  {
    q: "How do you monitor patient progress through treatment?",
    options: ["Staff checks manually", "Patients report themselves", "Dashboard-based tracking", "No formal process"],
    scores: [3, 2, 0, 4],
  },
  {
    q: "How do you track doctor performance across branches?",
    options: ["No tracking", "Monthly reports", "Real-time dashboard", "Ad hoc reviews"],
    scores: [4, 2, 0, 3],
  },
  {
    q: "How do you engage patients between appointments?",
    options: ["Phone calls", "WhatsApp manually", "Automated messages", "We don't"],
    scores: [2, 2, 0, 4],
  },
  {
    q: "How much of your clinic operations are automated?",
    options: ["Almost nothing", "Some billing/scheduling", "Most workflows", "Fully automated"],
    scores: [4, 2, 1, 0],
  },
];

interface ChaosCalculatorProps {
  onBookClick: () => void;
}

const ChaosCalculator = ({ onBookClick }: ChaosCalculatorProps) => {
  const { ref, isVisible } = useScrollReveal();
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (scoreIdx: number) => {
    const newAnswers = [...answers, questions[current].scores[scoreIdx]];
    setAnswers(newAnswers);
    if (current < questions.length - 1) {
      setCurrent(current + 1);
    } else {
      setShowResult(true);
    }
  };

  const score = answers.reduce((a, b) => a + b, 0);
  const maxScore = 20;
  const pct = Math.round((score / maxScore) * 100);

  const getResult = () => {
    if (pct <= 30) return { label: "Highly Structured", color: "text-accent", desc: "Your clinic has solid systems. The PatientFlow System can fine-tune and scale your operations further." };
    if (pct <= 60) return { label: "Moderate Structure", color: "text-secondary", desc: "You have some processes, but key gaps in automation are causing patient drop-offs. A system blueprint can bridge these gaps." };
    return { label: "Low Structure", color: "text-destructive", desc: "Your clinic operations rely heavily on manual effort. The PatientFlow System can dramatically reduce chaos and improve patient retention." };
  };

  const reset = () => {
    setCurrent(0);
    setAnswers([]);
    setShowResult(false);
  };

  return (
    <section ref={ref} className="section-padding">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            How Chaotic Is Your Clinic System?
          </h2>
          <p className="text-muted-foreground">Answer 5 quick questions to find out.</p>
        </motion.div>

        <div className="bg-card rounded-2xl border border-border p-4 sm:p-6 md:p-10 shadow-lg">
          <AnimatePresence mode="wait">
            {!showResult ? (
              <motion.div
                key={current}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Progress */}
                <div className="flex items-center gap-2 mb-6">
                  {questions.map((_, i) => (
                    <div
                      key={i}
                      className={`h-1.5 flex-1 rounded-full transition-colors ${
                        i <= current ? "bg-accent" : "bg-muted"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  Question {current + 1} of {questions.length}
                </p>
                <h3 className="text-lg md:text-xl font-display font-semibold text-foreground mb-6">
                  {questions[current].q}
                </h3>
                <div className="space-y-3">
                  {questions[current].options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAnswer(idx)}
                      className="w-full text-left p-3 md:p-4 rounded-xl border border-border bg-muted/50 hover:border-secondary hover:bg-muted transition-all duration-200 font-medium text-sm md:text-base text-foreground flex items-center justify-between group"
                    >
                      {opt}
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-secondary transition-colors" />
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="text-center"
              >
                <CheckCircle2 className="w-12 h-12 text-accent mx-auto mb-4" />
                <h3 className="text-2xl font-display font-bold text-primary mb-2">
                  Your Clinic Chaos Score
                </h3>
                <div className="text-3xl md:text-5xl font-bold text-primary my-4">{pct}%</div>
                <div className={`text-lg md:text-xl font-display font-semibold ${getResult().color} mb-4`}>
                  {getResult().label}
                </div>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  {getResult().desc}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={onBookClick}
                    className="gradient-cta text-accent-foreground font-display font-semibold px-6 py-3 rounded-xl transition-all hover:scale-105 cta-pulse"
                  >
                    Get Your Free Clinic Blueprint
                  </button>
                  <button
                    onClick={reset}
                    className="border border-border text-muted-foreground px-6 py-3 rounded-xl hover:bg-muted transition-all font-medium"
                  >
                    Retake Quiz
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default ChaosCalculator;
