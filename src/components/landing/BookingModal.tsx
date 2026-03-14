import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send } from "lucide-react";

interface BookingModalProps {
  open: boolean;
  onClose: () => void;
}

const BookingModal = ({ open, onClose }: BookingModalProps) => {
  const [form, setForm] = useState({
    name: "",
    clinicName: "",
    doctors: "",
    branches: "",
    phone: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setSubmitted(false);
      setForm({ name: "", clinicName: "", doctors: "", branches: "", phone: "" });
    }, 300);
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-primary/40 backdrop-blur-sm"
            onClick={handleClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 60 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative bg-card rounded-t-2xl sm:rounded-2xl border border-border shadow-2xl w-full sm:max-w-md p-5 sm:p-6 md:p-8 z-10 overflow-y-auto max-h-[92dvh]"
          >
            {/* Drag handle on mobile */}
            <div className="w-10 h-1 bg-border rounded-full mx-auto mb-4 sm:hidden" />

            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {!submitted ? (
              <>
                <h3 className="text-xl md:text-2xl font-display font-bold text-primary mb-1.5">
                  Book Your Free Blueprint
                </h3>
                <p className="text-sm text-muted-foreground mb-5">
                  Get a custom clinic system analysis - completely free.
                </p>
                <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
                  {[
                    { key: "name", label: "Your Name", type: "text", placeholder: "Dr. Ahmed" },
                    { key: "clinicName", label: "Clinic Name", type: "text", placeholder: "Al Shifa Medical Center" },
                    { key: "doctors", label: "Number of Doctors", type: "number", placeholder: "5" },
                    { key: "branches", label: "Number of Branches", type: "number", placeholder: "2" },
                    { key: "phone", label: "Phone Number", type: "tel", placeholder: "+91 98765 43210" },
                  ].map((field) => (
                    <div key={field.key}>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        {field.label}
                      </label>
                      <input
                        type={field.type}
                        required
                        placeholder={field.placeholder}
                        value={form[field.key as keyof typeof form]}
                        onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                        className="w-full px-3 md:px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all text-sm md:text-base"
                      />
                    </div>
                  ))}
                  <button
                    type="submit"
                    className="w-full gradient-cta text-accent-foreground font-display font-semibold py-3 rounded-xl transition-all hover:scale-[1.02] flex items-center justify-center gap-2 text-sm md:text-base"
                  >
                    <Send className="w-4 h-4" />
                    Submit & Book Your Call
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center py-6 md:py-8">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
                  <Send className="w-7 h-7 md:w-8 md:h-8 text-accent" />
                </div>
                <h3 className="text-xl md:text-2xl font-display font-bold text-primary mb-2">
                  You're In!
                </h3>
                <p className="text-sm md:text-base text-muted-foreground">
                  We'll reach out within 24 hours to schedule your free clinic blueprint session.
                </p>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default BookingModal;
