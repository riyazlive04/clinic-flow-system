import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";

interface StickyCTAProps {
  onBookClick: () => void;
}

const StickyCTA = ({ onBookClick }: StickyCTAProps) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 md:hidden">
      <button
        onClick={onBookClick}
        className="gradient-cta text-accent-foreground font-display font-semibold px-5 py-3 rounded-full shadow-lg cta-pulse flex items-center gap-2 text-sm"
      >
        Book Blueprint
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default StickyCTA;
