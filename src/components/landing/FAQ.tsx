import { motion } from "framer-motion";
import { useScrollReveal } from "@/components/useScrollReveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "How long does implementation take?",
    a: "The full PatientFlow System is typically live within 30–45 days, including audit, build, automation, and team onboarding.",
  },
  {
    q: "What does the system cost?",
    a: "We design custom systems based on your clinic's size, branches, and complexity. The free blueprint call will give you a clear scope and investment estimate.",
  },
  {
    q: "Will my staff be able to use it?",
    a: "Absolutely. The system is designed for non-technical teams. We include full onboarding and training as part of every implementation.",
  },
  {
    q: "Is this different from clinic software?",
    a: "Yes. Most clinic software handles appointments and billing. The PatientFlow System automates the entire patient journey - from first consultation to recovery tracking - and gives you operational intelligence across branches.",
  },
];

const FAQ = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section ref={ref} className="section-padding section-alt">
      <div className="max-w-3xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary text-center mb-8 md:mb-10"
        >
          Frequently Asked Questions
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
        >
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="bg-card rounded-xl border border-border px-4 md:px-6 shadow-sm"
              >
                <AccordionTrigger className="font-display font-semibold text-foreground text-left hover:no-underline py-5">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;
