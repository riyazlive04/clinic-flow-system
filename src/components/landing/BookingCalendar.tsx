import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useScrollReveal } from "@/components/useScrollReveal";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format, addDays, isSunday, startOfToday } from "date-fns";
import {
  CheckCircle2,
  Loader2,
  CalendarDays,
  ExternalLink,
  Clock,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Slot {
  dateTime: string;
  display: string;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  countryCode: string;
  businessType: string;
  website: string;
  challenge: string;
  automateProcess: string;
}

interface BookingCalendarProps {
  onBookClick?: () => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL as string) || "https://lbsiyqbhjatlmqphjitf.supabase.co";
const SUPABASE_ANON_KEY = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxic2l5cWJoamF0bG1xcGhqaXRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1MzYyMTgsImV4cCI6MjA4ODExMjIxOH0.iWUso735ZmnaqI-WxtlSvhboFFPDMRPzETlCN9wzYDI";
const N8N_WEBHOOK_URL = (import.meta.env.VITE_N8N_WEBHOOK_URL as string) || "";
const WHATSAPP_NUMBER = (import.meta.env.VITE_WHATSAPP_NUMBER as string) || "919789961631";

const COUNTRY_CODES = [
  { code: "+91", label: "+91 IN" },
  { code: "+1", label: "+1 US" },
  { code: "+44", label: "+44 UK" },
  { code: "+971", label: "+971 UAE" },
  { code: "+966", label: "+966 SA" },
  { code: "+65", label: "+65 SG" },
  { code: "+61", label: "+61 AU" },
  { code: "+49", label: "+49 DE" },
  { code: "+33", label: "+33 FR" },
  { code: "+81", label: "+81 JP" },
  { code: "+86", label: "+86 CN" },
  { code: "+55", label: "+55 BR" },
  { code: "+27", label: "+27 ZA" },
  { code: "+234", label: "+234 NG" },
  { code: "+254", label: "+254 KE" },
];

const BUSINESS_TYPES = [
  "Clinic/Healthcare",
  "Agency/Marketing",
  "Coaching/Consulting",
  "E-commerce/Product Business",
  "Real Estate",
  "Education/Training",
  "Restaurant/Hospitality",
  "Service Provider",
  "Other",
];

const INITIAL_FORM: FormData = {
  name: "",
  email: "",
  phone: "",
  countryCode: "+91",
  businessType: "",
  website: "",
  challenge: "",
  automateProcess: "",
};

// ─── Component ────────────────────────────────────────────────────────────────

const BookingCalendar = ({ onBookClick: _onBookClick }: BookingCalendarProps) => {
  const { ref, isVisible } = useScrollReveal();
  const today = startOfToday();

  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedSlot, setSelectedSlot] = useState<Slot | undefined>();
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [meetLink, setMeetLink] = useState("");
  const [error, setError] = useState("");
  const [confirmedDateTime, setConfirmedDateTime] = useState("");

  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const slotCache = useRef<Map<string, Slot[]>>(new Map());

  // ── Slot fetching ────────────────────────────────────────────────────────

  const generateLocalSlots = (date: Date): Slot[] => {
    const now = new Date();
    const dateStr = format(date, "yyyy-MM-dd");
    const isToday = dateStr === format(now, "yyyy-MM-dd");
    const slots: Slot[] = [];
    for (let hour = 10; hour < 19; hour++) {
      const slotDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), hour, 0, 0, 0);
      if (isToday && slotDate <= now) continue;
      slots.push({
        dateTime: slotDate.toISOString(),
        display: slotDate.toLocaleTimeString("en-IN", {
          hour: "2-digit", minute: "2-digit", hour12: true, timeZone: "Asia/Kolkata",
        }),
      });
    }
    return slots;
  };

  const fetchSlotsRaw = async (date: Date): Promise<Slot[]> => {
    const dateStr = format(date, "yyyy-MM-dd");
    if (slotCache.current.has(dateStr)) {
      return slotCache.current.get(dateStr)!;
    }

    // ── Step 1: get Google-Calendar-filtered slots from edge function ─────────
    let slots: Slot[] = [];
    let edgeFunctionWorked = false;

    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (SUPABASE_ANON_KEY) {
        headers["Authorization"] = `Bearer ${SUPABASE_ANON_KEY}`;
        headers["apikey"] = SUPABASE_ANON_KEY;
      }
      const res = await fetch(
        `${SUPABASE_URL}/functions/v1/get-slots?date=${dateStr}`,
        { headers }
      );
      const data = await res.json();
      console.log("[get-slots] response:", data);
      if (data.success && Array.isArray(data.slots)) {
        slots = data.slots;
        edgeFunctionWorked = true;
      } else {
        console.warn("[get-slots] returned error:", data.error ?? data);
      }
    } catch (err) {
      console.error("[get-slots] fetch failed:", err);
    }

    // ── Step 2: fallback to local slot generation if edge function failed ─────
    if (!edgeFunctionWorked) {
      console.warn("[get-slots] falling back to local slot generation");
      slots = generateLocalSlots(date);
    }

    // ── Step 3: remove slots already booked in leads table (all LPs) ─────────
    if (slots.length > 0 && supabase) {
      try {
        const dayStart = `${dateStr}T00:00:00+05:30`;
        const dayEnd   = `${dateStr}T23:59:59+05:30`;

        const { data: booked } = await supabase
          .from("leads")
          .select("meeting_time")
          .gte("meeting_time", dayStart)
          .lte("meeting_time", dayEnd)
          .not("meeting_time", "is", null);

        if (booked && booked.length > 0) {
          const bookedMs = new Set(
            booked.map((r: { meeting_time: string }) =>
              new Date(r.meeting_time).getTime()
            )
          );
          slots = slots.filter(
            (s) => !bookedMs.has(new Date(s.dateTime).getTime())
          );
        }
      } catch (err) {
        console.error("[leads-filter] query failed:", err);
      }
    }

    slotCache.current.set(dateStr, slots);
    return slots;
  };

  const fetchSlots = async (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    if (slotCache.current.has(dateStr)) {
      setSlots(slotCache.current.get(dateStr)!);
      return;
    }
    setLoadingSlots(true);
    const fetched = await fetchSlotsRaw(date);
    setSlots(fetched);
    setLoadingSlots(false);
  };

  // ── Prefetch next 4 weekdays on mount ────────────────────────────────────

  useEffect(() => {
    const getNextWeekdays = (count: number): Date[] => {
      const days: Date[] = [];
      let d = addDays(today, 1);
      while (days.length < count) {
        if (!isSunday(d)) days.push(d);
        d = addDays(d, 1);
      }
      return days;
    };
    const weekdays = getNextWeekdays(4);
    Promise.all(weekdays.map(fetchSlotsRaw));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedSlot(undefined);
    setSlots([]);
    if (date) fetchSlots(date);
  };

  const updateForm = (key: keyof FormData, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleConfirm = async () => {
    if (!selectedDate || !selectedSlot) return;
    setSubmitting(true);
    setError("");

    const payload = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      country_code: form.countryCode,
      countryCode: form.countryCode,
      businessType: form.businessType,
      dateTime: selectedSlot.dateTime,
      website: form.website,
      challenge: form.challenge,
      automateProcess: form.automateProcess,
    };

    const link = "";
    let success = false;

    // Insert booking directly into leads table
    if (supabase) {
      try {
        const { error: dbError } = await supabase.from("leads").insert({
          name: form.name,
          email: form.email,
          phone: form.phone,
          country_code: form.countryCode,
          business_type: form.businessType,
          website: form.website,
          challenge: form.challenge,
          automate_process: form.automateProcess,
          meeting_time: selectedSlot.dateTime,
          lp_name: "Clinic Flow System",
        });
        if (!dbError) success = true;
      } catch { /* fall through */ }
    }

    if (!success) {
      setError("Booking failed. Please check your connection and try again.");
      setSubmitting(false);
      return;
    }

    // Bust the slot cache for this date so re-fetch reflects the new booking
    slotCache.current.delete(format(selectedDate, "yyyy-MM-dd"));

    // Fire Meta Pixel Lead event
    if (typeof window !== "undefined" && (window as any).fbq) {
      (window as any).fbq("track", "Lead");
    }

    // 3. Fire n8n webhook (silent)
    if (N8N_WEBHOOK_URL) {
      fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, meetLink: link }),
      }).catch(() => {});
    }

    // 4. Open WhatsApp
    const dateDisplay = format(selectedDate, "EEEE, MMMM d, yyyy");
    const waMsg = encodeURIComponent(
      `Hi! I've just booked a *Free Clinic System Blueprint Session* with Sirah Digital.\n\n` +
      `📅 Date: ${dateDisplay}\n` +
      `⏰ Time: ${selectedSlot.display}\n\n` +
      `👤 Name: ${form.name}\n` +
      `📧 Email: ${form.email}\n` +
      `📱 Phone: ${form.countryCode} ${form.phone}\n\n` +
      `🏥 Business: ${form.businessType}\n\n` +
      `Looking forward to the call!`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${waMsg}`, "_blank");

    // 5. Show confirmation
    setMeetLink(link);
    setConfirmedDateTime(`${dateDisplay} at ${selectedSlot.display}`);
    setConfirmed(true);
    setSubmitting(false);
  };

  const resetBooking = () => {
    setConfirmed(false);
    setSelectedDate(undefined);
    setSelectedSlot(undefined);
    setSlots([]);
    setForm(INITIAL_FORM);
    setMeetLink("");
    setError("");
  };

  // ── Calendar full-width classNames ───────────────────────────────────────

  const calendarClassNames = {
    months: "w-full",
    month: "w-full space-y-3",
    caption: "flex justify-center relative items-center mb-2",
    caption_label: "font-display font-semibold text-primary text-sm",
    nav: "space-x-1 flex items-center",
    nav_button: cn(
      "h-7 w-7 inline-flex items-center justify-center rounded-md",
      "border border-border bg-transparent hover:bg-muted transition-colors",
      "text-muted-foreground hover:text-foreground opacity-70 hover:opacity-100"
    ),
    nav_button_previous: "absolute left-0",
    nav_button_next: "absolute right-0",
    table: "w-full border-collapse",
    head_row: "flex w-full",
    head_cell: "flex-1 text-center text-[0.7rem] font-medium text-muted-foreground py-1",
    row: "flex w-full mt-1",
    cell: "flex-1 p-0.5 text-center text-sm relative focus-within:relative focus-within:z-20",
    day: "w-full aspect-square inline-flex items-center justify-center rounded-md text-sm font-normal hover:bg-muted transition-colors cursor-pointer aria-selected:opacity-100",
    day_selected:
      "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
    day_today: "ring-1 ring-secondary text-secondary font-semibold",
    day_outside: "text-muted-foreground opacity-40",
    day_disabled: "text-muted-foreground opacity-30 cursor-not-allowed hover:bg-transparent",
    day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
    day_hidden: "invisible",
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <section ref={ref} id="booking" className="section-padding bg-background">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-8 md:mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-muted rounded-full px-4 py-1.5 mb-4">
            <CalendarDays className="w-4 h-4 text-secondary" />
            <span className="text-sm font-medium text-muted-foreground">Free Strategy Session</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-3">
            Select a Date &amp; Time
          </h2>
          <p className="text-sm text-muted-foreground flex items-center justify-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            Timezone: <span className="font-medium text-foreground">{timezone}</span>
          </p>
        </motion.div>

        {/* Main content */}
        <AnimatePresence mode="wait">
          {confirmed ? (
            /* ── Confirmation Screen ── */
            <motion.div
              key="confirmed"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="bg-card rounded-2xl border border-border shadow-xl p-8 md:p-12 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-16 h-16 rounded-full bg-accent/15 flex items-center justify-center mx-auto mb-5"
              >
                <CheckCircle2 className="w-9 h-9 text-accent" />
              </motion.div>
              <h3 className="text-2xl md:text-3xl font-display font-bold text-primary mb-2">
                Booking Confirmed!
              </h3>
              <p className="text-muted-foreground mb-6 text-sm md:text-base">
                We've received your booking. You'll get a confirmation shortly.
              </p>
              <div className="bg-muted rounded-xl p-4 mb-6 inline-block text-left w-full sm:w-auto sm:min-w-[240px]">
                <p className="text-xs text-muted-foreground mb-1">Scheduled for</p>
                <p className="font-display font-semibold text-primary">{confirmedDateTime}</p>
              </div>
              {meetLink && (
                <div className="mb-8">
                  <a
                    href={meetLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-secondary font-medium hover:underline text-sm"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Join Google Meet
                  </a>
                </div>
              )}
              <Button
                variant="outline"
                onClick={resetBooking}
                className="mt-2"
              >
                Book Another Slot
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="calendar"
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.15 }}
            >
              {/* ── Two-panel card ── */}
              <div className="bg-card rounded-2xl border border-border shadow-xl overflow-hidden">
                <div className="flex flex-col md:flex-row">

                  {/* Calendar panel */}
                  <div className="md:w-1/2 p-4 sm:p-6 border-b md:border-b-0 md:border-r border-border">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                      Choose a Date
                    </p>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={handleDateSelect}
                      disabled={[{ dayOfWeek: [0] }, { before: today }]}
                      className="w-full p-0"
                      classNames={calendarClassNames}
                    />
                  </div>

                  {/* Time slots panel */}
                  <div className="md:w-1/2 p-4 sm:p-6">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                      {selectedDate
                        ? `Available Times — ${format(selectedDate, "EEE, MMM d")}`
                        : "Available Times"}
                    </p>

                    {!selectedDate ? (
                      <div className="flex flex-col items-center justify-center h-48 text-center text-muted-foreground">
                        <CalendarDays className="w-10 h-10 mb-3 opacity-30" />
                        <p className="text-sm">Select a date to view available times</p>
                      </div>
                    ) : loadingSlots ? (
                      <div className="flex items-center justify-center h-48">
                        <Loader2 className="w-7 h-7 animate-spin text-secondary" />
                      </div>
                    ) : slots.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-48 text-center text-muted-foreground">
                        <Clock className="w-10 h-10 mb-3 opacity-30" />
                        <p className="text-sm">No slots available for this date.</p>
                        <p className="text-xs mt-1">Please choose another day.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {slots.map((slot) => (
                          <button
                            key={slot.dateTime}
                            onClick={() => setSelectedSlot(slot)}
                            className={cn(
                              "px-2 py-2.5 rounded-lg border text-sm font-medium transition-all",
                              selectedSlot?.dateTime === slot.dateTime
                                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                                : "border-border bg-muted/50 text-foreground hover:border-secondary hover:bg-muted"
                            )}
                          >
                            {slot.display}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* ── Form panel (slides in) ── */}
              <AnimatePresence>
                {selectedDate && selectedSlot && (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, y: 24, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: 12, height: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 bg-card rounded-2xl border border-border shadow-xl p-4 sm:p-6 md:p-8">
                      <h3 className="font-display font-bold text-primary text-lg mb-1">
                        Your Details
                      </h3>
                      <p className="text-sm text-muted-foreground mb-6">
                        Complete your booking for{" "}
                        <span className="font-medium text-foreground">
                          {format(selectedDate, "EEEE, MMMM d")} at {selectedSlot.display}
                        </span>
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                        {/* Name */}
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-1.5">
                            Your Name <span className="text-destructive">*</span>
                          </label>
                          <Input
                            required
                            placeholder="Dr. Ahmed"
                            value={form.name}
                            onChange={(e) => updateForm("name", e.target.value)}
                          />
                        </div>

                        {/* Business type */}
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-1.5">
                            Business Type <span className="text-destructive">*</span>
                          </label>
                          <Select
                            value={form.businessType}
                            onValueChange={(v) => updateForm("businessType", v)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select type..." />
                            </SelectTrigger>
                            <SelectContent>
                              {BUSINESS_TYPES.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Email */}
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-1.5">
                            Email <span className="text-destructive">*</span>
                          </label>
                          <Input
                            type="email"
                            required
                            placeholder="you@example.com"
                            value={form.email}
                            onChange={(e) => updateForm("email", e.target.value)}
                          />
                        </div>

                        {/* Phone */}
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-1.5">
                            Phone <span className="text-destructive">*</span>
                          </label>
                          <div className="flex gap-2">
                            <Select
                              value={form.countryCode}
                              onValueChange={(v) => updateForm("countryCode", v)}
                            >
                              <SelectTrigger className="w-[90px] sm:w-[110px] shrink-0">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {COUNTRY_CODES.map((c) => (
                                  <SelectItem key={c.code} value={c.code}>
                                    {c.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Input
                              type="tel"
                              required
                              placeholder="98765 43210"
                              value={form.phone}
                              onChange={(e) => updateForm("phone", e.target.value)}
                              className="flex-1 min-w-0"
                            />
                          </div>
                        </div>

                        {/* Website — full width */}
                        <div className="sm:col-span-2">
                          <label className="block text-sm font-medium text-foreground mb-1.5">
                            Website or Social Profile <span className="text-destructive">*</span>
                          </label>
                          <Input
                            required
                            placeholder="https://yourclinic.com or @handle"
                            value={form.website}
                            onChange={(e) => updateForm("website", e.target.value)}
                          />
                        </div>

                        {/* Challenge — full width */}
                        <div className="sm:col-span-2">
                          <label className="block text-sm font-medium text-foreground mb-1.5">
                            Biggest Operational Challenge <span className="text-destructive">*</span>
                          </label>
                          <textarea
                            required
                            rows={3}
                            placeholder="e.g. Patients drop off after consultation, manual follow-ups are missed..."
                            value={form.challenge}
                            onChange={(e) => updateForm("challenge", e.target.value)}
                            className="w-full px-3 py-2.5 rounded-md border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 resize-none transition-colors"
                          />
                        </div>

                        {/* Automate — full width, optional */}
                        <div className="sm:col-span-2">
                          <label className="block text-sm font-medium text-foreground mb-1.5">
                            Process You Most Want to Automate{" "}
                            <span className="text-muted-foreground font-normal">(optional)</span>
                          </label>
                          <textarea
                            rows={2}
                            placeholder="e.g. Follow-up reminders, appointment confirmations, patient reporting..."
                            value={form.automateProcess}
                            onChange={(e) => updateForm("automateProcess", e.target.value)}
                            className="w-full px-3 py-2.5 rounded-md border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 resize-none transition-colors"
                          />
                        </div>
                      </div>

                      {/* Error */}
                      {error && (
                        <p className="mt-4 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-4 py-2.5">
                          {error}
                        </p>
                      )}

                      {/* Confirm bar */}
                      <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-5 border-t border-border">
                        <div>
                          <p className="text-xs text-muted-foreground">Selected slot</p>
                          <p className="font-display font-semibold text-primary text-sm">
                            {format(selectedDate, "EEE, MMM d, yyyy")} · {selectedSlot.display}
                          </p>
                        </div>
                        <Button
                          onClick={handleConfirm}
                          disabled={
                            submitting ||
                            !form.name ||
                            !form.email ||
                            !form.phone ||
                            !form.businessType ||
                            !form.website ||
                            !form.challenge
                          }
                          className="w-full sm:w-auto gradient-cta text-accent-foreground font-display font-semibold border-0 hover:brightness-90 hover:scale-[1.02] transition-all"
                        >
                          {submitting ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Confirming...
                            </>
                          ) : (
                            "Confirm Booking"
                          )}
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default BookingCalendar;
