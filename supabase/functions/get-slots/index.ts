// supabase/functions/get-slots/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { google } from "npm:googleapis@126";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Max-Age": "86400",
};

const WORK_START = 10;    // 10:00 AM
const WORK_END = 19;      // 7:00 PM
const SLOT_DURATION = 60; // 45 min meet + 15 min break = 60 min slots
const MEET_DURATION = 45; // actual meeting duration shown to user

function generateSlots(date: string): string[] {
  const slots: string[] = [];
  for (let hour = WORK_START; hour < WORK_END; hour++) {
    for (let min = 0; min < 60; min += SLOT_DURATION) {
      if (hour * 60 + min + SLOT_DURATION <= WORK_END * 60) {
        const h = hour.toString().padStart(2, "0");
        const m = min.toString().padStart(2, "0");
        slots.push(`${date}T${h}:${m}:00+05:30`);
      }
    }
  }
  return slots;
}

function isSlotFree(slot: string, busyPeriods: { start: string; end: string }[]): boolean {
  const slotStart = new Date(slot).getTime();
  const slotEnd = slotStart + MEET_DURATION * 60 * 1000; // check only meet duration for conflicts
  return !busyPeriods.some(({ start, end }) => {
    const busyStart = new Date(start).getTime();
    const busyEnd = new Date(end).getTime();
    return slotStart < busyEnd && slotEnd > busyStart;
  });
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: CORS_HEADERS,
    });
  }

  try {
    const url = new URL(req.url);
    const date = url.searchParams.get("date");

    if (!date) {
      return new Response(
        JSON.stringify({ error: "Missing ?date=YYYY-MM-DD parameter" }),
        { status: 400, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
      );
    }

    // ── Block Sunday only ─────────────────────────────────────────────────────
    const dayOfWeek = new Date(date).getDay();
    if (dayOfWeek === 0) {
      return new Response(
        JSON.stringify({ success: true, date, slots: [] }),
        { status: 200, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
      );
    }

    const serviceAccountJson = Deno.env.get("GOOGLE_SERVICE_ACCOUNT_JSON");
    if (!serviceAccountJson) throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON not set");

    const serviceAccount = JSON.parse(serviceAccountJson);

    const auth = new google.auth.JWT(
      serviceAccount.client_email,
      undefined,
      serviceAccount.private_key,
      ["https://www.googleapis.com/auth/calendar.readonly"]
    );

    const calendar = google.calendar({ version: "v3", auth });

    const timeMin = `${date}T00:00:00+05:30`;
    const timeMax = `${date}T23:59:59+05:30`;

    const freeBusy = await calendar.freebusy.query({
      requestBody: {
        timeMin,
        timeMax,
        timeZone: "Asia/Kolkata",
        items: [{ id: "riyazlivechat@gmail.com" }],
      },
    });

    const busyPeriods =
      freeBusy.data.calendars?.["riyazlivechat@gmail.com"]?.busy || [];

    const allSlots = generateSlots(date);
    const now = new Date();
    const availableSlots = allSlots
      .filter((slot) => new Date(slot) > now)
      .filter((slot) => isSlotFree(slot, busyPeriods))
      .map((slot) => {
        const d = new Date(slot);
        return {
          dateTime: slot,
          display: d.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
            timeZone: "Asia/Kolkata",
          }),
        };
      });

    return new Response(
      JSON.stringify({ success: true, date, slots: availableSlots }),
      { status: 200, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("get-slots error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
    );
  }
});
