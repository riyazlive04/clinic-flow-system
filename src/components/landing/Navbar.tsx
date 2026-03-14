import { useState, useEffect } from "react";
import sirahLogo from "@/assets/sirah-logo.jpg";

interface NavbarProps {
  onBookClick: () => void;
}

const Navbar = ({ onBookClick }: NavbarProps) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-card/95 backdrop-blur-md shadow-lg border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-8 h-16 md:h-20">
        <div className="flex items-center gap-3">
          <img src={sirahLogo} alt="Sirah Digital" className="h-10 w-10 rounded-lg object-contain" />
          <span className="font-display font-bold text-lg text-primary hidden md:block">
            Sirah Digital
          </span>
        </div>
        <button
          onClick={onBookClick}
          className="gradient-cta text-accent-foreground font-display font-semibold px-5 py-2.5 rounded-lg text-sm transition-all duration-200 hover:brightness-90 hover:scale-105"
        >
          Book Blueprint
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
