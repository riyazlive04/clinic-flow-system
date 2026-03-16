// supabase/functions/get-slots/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Max-Age": "86400",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: CORS_HEADERS });
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

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    // Fetch available slots for the given date from calendar_events
    const { data: slots, error } = await supabase
      .from("calendar_events")
      .select("slot_time")
      .eq("status", "available")
      .gte("slot_time", `${date}T00:00:00+05:30`)
      .lt("slot_time", `${date}T23:59:59+05:30`)
      .order("slot_time", { ascending: true });

    if (error) throw error;

    // Filter out past slots and format for the frontend
    const now = new Date();
    const availableSlots = (slots ?? [])
      .filter((row) => new Date(row.slot_time) > now)
      .map((row) => {
        const d = new Date(row.slot_time);
        return {
          dateTime: row.slot_time,
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
