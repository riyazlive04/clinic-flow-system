// supabase/functions/create-booking/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { google } from "npm:googleapis@126";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Max-Age": "86400",
};

const MEET_DURATION = 45; // minutes

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: CORS_HEADERS });
  }

  try {
    const {
      name,
      email,
      phone,
      countryCode,
      businessType,
      website,
      challenge,
      automateProcess,
      dateTime,
      lp_name,
    } = await req.json();

    if (!name || !email || !phone || !dateTime) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing required fields" }),
        { status: 400, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    // ── Step 1: Atomically reserve the slot ─────────────────────────────────
    // Only updates if status is still 'available' — prevents double bookings
    const { data: reserved, error: reserveError } = await supabase
      .from("calendar_events")
      .update({ status: "booked" })
      .eq("slot_time", dateTime)
      .eq("status", "available")
      .select("id")
      .single();

    if (reserveError || !reserved) {
      return new Response(
        JSON.stringify({ success: false, error: "Slot already booked or unavailable" }),
        { status: 409, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
      );
    }

    const calendarEventId = reserved.id;

    // ── Step 2: Insert lead into leads table ────────────────────────────────
    const { data: lead, error: leadError } = await supabase
      .from("leads")
      .insert({
        name,
        email,
        phone,
        country_code: countryCode,
        business_type: businessType,
        website: website || null,
        challenge: challenge || null,
        automate_process: automateProcess || null,
        meeting_time: dateTime,
        lp_name: lp_name || null,
      })
      .select("id")
      .single();

    if (leadError) {
      // Rollback: release the slot
      await supabase
        .from("calendar_events")
        .update({ status: "available" })
        .eq("id", calendarEventId);
      throw leadError;
    }

    // ── Step 3: Link lead to the calendar event ─────────────────────────────
    await supabase
      .from("calendar_events")
      .update({ lead_id: lead.id })
      .eq("id", calendarEventId);

    // ── Step 4: Create Google Calendar event with Meet link ─────────────────
    let meet_link = "";
    let calendar_link = "";

    try {
      const serviceAccountJson = Deno.env.get("GOOGLE_SERVICE_ACCOUNT_JSON");
      if (!serviceAccountJson) throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON not set");

      const serviceAccount = JSON.parse(serviceAccountJson);

      const auth = new google.auth.JWT(
        serviceAccount.client_email,
        undefined,
        serviceAccount.private_key,
        ["https://www.googleapis.com/auth/calendar"],
      );

      const calendar = google.calendar({ version: "v3", auth });

      const startTime = new Date(dateTime);
      const endTime = new Date(startTime.getTime() + MEET_DURATION * 60 * 1000);

      const event = await calendar.events.insert({
        calendarId: "riyazlivechat@gmail.com",
        conferenceDataVersion: 1,
        requestBody: {
          summary: `Consultation – ${name}`,
          description: [
            `Name: ${name}`,
            `Email: ${email}`,
            `Phone: ${countryCode} ${phone}`,
            `Business: ${businessType}`,
            website ? `Website: ${website}` : "",
            challenge ? `Challenge: ${challenge}` : "",
            automateProcess ? `Automate: ${automateProcess}` : "",
            lp_name ? `Source: ${lp_name}` : "",
          ].filter(Boolean).join("\n"),
          start: { dateTime: startTime.toISOString(), timeZone: "Asia/Kolkata" },
          end: { dateTime: endTime.toISOString(), timeZone: "Asia/Kolkata" },
          attendees: [{ email }],
          conferenceData: {
            createRequest: {
              requestId: `booking-${Date.now()}`,
              conferenceSolutionKey: { type: "hangoutsMeet" },
            },
          },
        },
      });

      meet_link = event.data.hangoutLink || "";
      calendar_link = event.data.htmlLink || "";

      // Store links on the lead
      await supabase
        .from("leads")
        .update({ meet_link, calendar_link })
        .eq("id", lead.id);
    } catch (calErr) {
      // Google Calendar is a synced copy — booking still succeeds
      console.error("Google Calendar sync failed:", calErr);
    }

    return new Response(
      JSON.stringify({ success: true, meet_link, calendar_link }),
      { status: 200, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("create-booking error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
    );
  }
});
