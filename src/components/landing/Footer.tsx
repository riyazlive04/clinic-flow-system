import sirahLogo from "@/assets/sirah-logo.jpg";

const Footer = () => (
  <footer className="bg-primary text-primary-foreground py-10 md:py-12 px-4">
    <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6 text-center md:text-left">
      <div className="flex items-center gap-3">
        <img src={sirahLogo} alt="Sirah Digital" className="w-10 h-10 rounded-lg object-contain" />
        <div>
          <p className="font-display font-bold">Sirah Digital</p>
          <p className="text-sm opacity-70">Healthcare Automation Systems</p>
        </div>
      </div>
      <p className="text-sm opacity-60">
        © {new Date().getFullYear()} Sirah Digital. All rights reserved.
      </p>
    </div>
  </footer>
);

export default Footer;
