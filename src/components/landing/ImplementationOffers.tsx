import { motion } from "framer-motion";
import { useScrollReveal } from "@/components/useScrollReveal";
import { LayoutDashboard, Wrench, TrendingUp, HeadsetIcon } from "lucide-react";

const offers = [
  {
    icon: LayoutDashboard,
    title: "Branch Clarity Guarantee",
    description:
      "Within 30 days of implementing the system, you will be able to clearly see the performance of every branch from one dashboard.",
    note: "If the system does not provide clear branch visibility, we continue optimizing it at no additional cost.",
  },
  {
    icon: TrendingUp,
    title: "Expansion Readiness Assessment",
    description:
      "During the consultation we evaluate how ready your business is to scale additional branches.",
    bullets: [
      "What systems are missing",
      "What prevents operational scaling",
      "What processes must be standardized",
    ],
  },
  {
    icon: HeadsetIcon,
    title: "30 Days of System Optimization Support",
    description:
      "After the system is deployed, we continue working with your team to refine and optimize operations.",
    bullets: [
      "Refining dashboards",
      "Optimizing workflows",
      "Training team members",
    ],
  },
];

const ImplementationOffers = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section ref={ref} className="section-padding">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-8 md:mb-14"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-3">
            What You Receive During and After Implementation
          </h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
            Confidence signals built into every stage of the process
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {offers.map((offer, i) => (
            <motion.div
              key={offer.title}
              initial={{ opacity: 0, y: 16 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.15 + i * 0.12 }}
              className="bg-card rounded-xl border border-secondary/20 p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-11 h-11 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                <offer.icon className="w-5 h-5 text-secondary" />
              </div>
              <h3 className="font-display font-semibold text-primary text-lg mb-2">
                {offer.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                {offer.description}
              </p>
              {offer.note && (
                <p className="text-xs text-secondary italic">{offer.note}</p>
              )}
              {offer.bullets && (
                <ul className="space-y-1.5">
                  {offer.bullets.map((b) => (
                    <li
                      key={b}
                      className="text-sm text-muted-foreground flex items-start gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImplementationOffers;
