import { motion } from "framer-motion";
import { useScrollReveal } from "@/components/useScrollReveal";

const branches = [
  { id: "hq", label: "HQ System", x: 300, y: 180, isCenter: true },
  { id: "b1", label: "Branch 1", x: 80, y: 60 },
  { id: "b2", label: "Branch 2", x: 520, y: 60 },
  { id: "b3", label: "Branch 3", x: 80, y: 300 },
  { id: "b4", label: "Branch 4", x: 520, y: 300 },
  { id: "b5", label: "Branch 5", x: 300, y: 360 },
];

const connections = [
  { from: "hq", to: "b1" },
  { from: "hq", to: "b2" },
  { from: "hq", to: "b3" },
  { from: "hq", to: "b4" },
  { from: "hq", to: "b5" },
];

const getNode = (id: string) => branches.find((b) => b.id === id)!;

const BranchNetworkMap = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section ref={ref} className="section-padding bg-background">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-8 md:mb-12"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-4">
            One Central System, Every Branch Connected
          </h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
            Real-time data flows between all your clinic branches through one intelligent hub.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isVisible ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="relative mx-auto"
          style={{ maxWidth: 600 }}
        >
          <svg viewBox="0 0 600 420" className="w-full h-auto">
            {/* Connection lines */}
            {connections.map((conn, i) => {
              const from = getNode(conn.from);
              const to = getNode(conn.to);
              return (
                <g key={`conn-${i}`}>
                  <motion.line
                    x1={from.x}
                    y1={from.y}
                    x2={to.x}
                    y2={to.y}
                    stroke="hsl(210 60% 16%)"
                    strokeWidth={2}
                    strokeOpacity={0.3}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={isVisible ? { pathLength: 1, opacity: 1 } : {}}
                    transition={{ delay: 0.4 + i * 0.1, duration: 0.6 }}
                  />
                  {/* Animated data pulse */}
                  <motion.circle
                    r={4}
                    fill="hsl(215 70% 48%)"
                    initial={{ opacity: 0 }}
                    animate={
                      isVisible
                        ? {
                            cx: [from.x, to.x, from.x],
                            cy: [from.y, to.y, from.y],
                            opacity: [0, 1, 1, 0],
                          }
                        : {}
                    }
                    transition={{
                      delay: 1 + i * 0.3,
                      duration: 2.5,
                      repeat: Infinity,
                      repeatDelay: 1,
                      ease: "easeInOut",
                    }}
                  />
                </g>
              );
            })}

            {/* Nodes */}
            {branches.map((node, i) => (
              <motion.g
                key={node.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={isVisible ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.3 + i * 0.08, type: "spring", stiffness: 200 }}
                style={{ transformOrigin: `${node.x}px ${node.y}px` }}
              >
                {/* Node glow for center */}
                {node.isCenter && (
                  <motion.circle
                    cx={node.x}
                    cy={node.y}
                    r={40}
                    fill="hsl(215 70% 48% / 0.1)"
                    animate={{ r: [40, 48, 40] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                )}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={node.isCenter ? 32 : 24}
                  fill={node.isCenter ? "hsl(210 60% 16%)" : "hsl(215 70% 48%)"}
                  stroke={node.isCenter ? "hsl(215 70% 48%)" : "hsl(210 60% 16% / 0.2)"}
                  strokeWidth={node.isCenter ? 3 : 2}
                />
                <text
                  x={node.x}
                  y={node.isCenter ? node.y + 1 : node.y + 1}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="white"
                  fontSize={node.isCenter ? 10 : 8}
                  fontWeight={600}
                  fontFamily="Inter, sans-serif"
                >
                  {node.isCenter ? "HQ" : node.label.replace("Branch ", "B")}
                </text>
                <text
                  x={node.x}
                  y={node.isCenter ? node.y + 52 : node.y + 40}
                  textAnchor="middle"
                  fill="hsl(215 14% 40%)"
                  fontSize={11}
                  fontFamily="Inter, sans-serif"
                >
                  {node.label}
                </text>
              </motion.g>
            ))}
          </svg>
        </motion.div>
      </div>
    </section>
  );
};

export default BranchNetworkMap;
