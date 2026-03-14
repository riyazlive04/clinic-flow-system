import { motion } from "framer-motion";
import { useScrollReveal } from "@/components/useScrollReveal";
import { Cpu, GitBranch, Building, Workflow } from "lucide-react";

const pillars = [
  { icon: Cpu, label: "Custom Automation Systems", desc: "Purpose-built systems for healthcare operations" },
  { icon: Workflow, label: "Workflow Architecture Expertise", desc: "End-to-end patient journey design" },
  { icon: Building, label: "Multi-Branch Business Systems", desc: "Scalable across clinics and locations" },
  { icon: GitBranch, label: "Operational Automation Design", desc: "Eliminating manual bottlenecks systematically" },
];

const Authority = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section ref={ref} className="section-padding">
      <div className="max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-4">
            Built By System Architects
          </h2>
          <p className="text-sm md:text-base text-muted-foreground mb-8 md:mb-12 max-w-xl mx-auto">
            Sirah Digital designs intelligent automation systems for healthcare businesses that need structure at scale.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-6">
          {pillars.map((p, i) => (
            <motion.div
              key={p.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + i * 0.1 }}
              className="bg-card rounded-xl border border-border p-6 text-left flex gap-4 shadow-sm hover:shadow-md hover:border-secondary/40 transition-all"
            >
              <div className="w-12 h-12 rounded-xl gradient-navy-teal flex items-center justify-center shrink-0">
                <p.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-display font-bold text-foreground mb-1">{p.label}</h3>
                <p className="text-sm text-muted-foreground">{p.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Authority;
