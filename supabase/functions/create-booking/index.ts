import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { google } from "npm:googleapis@126";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS });
  }

  try {
    const {
      name,
      email,
      phone,
      countryCode,
      businessType,
      dateTime,
      website,
      challenge,
      automateProcess,
      lp_name
    } = await req.json();

    if (!name || !email || !phone || !countryCode || !businessType || !dateTime) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing required fields" }),
        { status: 400, headers: { ...CORS, "Content-Type": "application/json" } }
      );
    }

    console.log("Booking request:", { name, email, dateTime });

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    /* ---------------------------------------------------- */
    /* STEP 1 — Lock slot                                  */
    /* ---------------------------------------------------- */

    const { data: slot, error: slotError } = await supabase
      .from("calendar_events")
      .update({ status: "booked" })
      .eq("slot_time", dateTime)
      .eq("status", "available")
      .select()
      .single();

    if (slotError || !slot) {
      console.error("Slot already booked:", slotError);
      return new Response(
        JSON.stringify({ success: false, error: "Slot already booked" }),
        { status: 400, headers: { ...CORS, "Content-Type": "application/json" } }
      );
    }

    /* ---------------------------------------------------- */
    /* STEP 2 — Insert lead                                */
    /* ---------------------------------------------------- */

    const fullPhone = `${countryCode}${phone}`;

    const { data: leadData, error: leadError } = await supabase
      .from("leads")
      .insert({
        name: name,
        email: email,
        business_type: businessType,
        country_code: countryCode,
        phone: phone,
        full_phone: fullPhone,
        meeting_time: new Date(dateTime),
        website: website || null,
        challenge: challenge || null,
        automate_process: automateProcess || null,
        lp_name: lp_name || "AI Flow"
      })
      .select("id")
      .single();

    if (leadError) {
      console.error("Lead insert error:", leadError);
      throw new Error("Lead insert failed");
    }

    const leadId = leadData.id;

    console.log("Lead created:", leadId);

    /* ---------------------------------------------------- */
    /* STEP 3 — Link slot to lead                          */
    /* ---------------------------------------------------- */

    await supabase
      .from("calendar_events")
      .update({ lead_id: leadId })
      .eq("slot_time", dateTime);

    /* ---------------------------------------------------- */
    /* STEP 4 — Create Google Calendar Event               */
    /* ---------------------------------------------------- */

    let meetLink = "";

    try {
      const serviceAccount = JSON.parse(
        Deno.env.get("GOOGLE_SERVICE_ACCOUNT_JSON")!
      );

      const auth = new google.auth.JWT(
        serviceAccount.client_email,
        undefined,
        serviceAccount.private_key,
        ["https://www.googleapis.com/auth/calendar"]
      );

      const calendar = google.calendar({ version: "v3", auth });

      const endTime = new Date(new Date(dateTime).getTime() + 45 * 60000);

      const event = await calendar.events.insert({
        calendarId: Deno.env.get("GOOGLE_CALENDAR_ID"),
        conferenceDataVersion: 1,
        requestBody: {
          summary: `Strategy Call with ${name}`,
          description: `
Name: ${name}
Email: ${email}
Phone: ${fullPhone}
Business: ${businessType}
          `,
          start: {
            dateTime: dateTime,
            timeZone: "Asia/Kolkata"
          },
          end: {
            dateTime: endTime.toISOString(),
            timeZone: "Asia/Kolkata"
          },
          conferenceData: {
            createRequest: {
              requestId: crypto.randomUUID()
            }
          }
        }
      });

      console.log("Google event created:", event.data.id);

      meetLink =
        event.data.conferenceData?.entryPoints?.find(
          (x) => x.entryPointType === "video"
        )?.uri || event.data.htmlLink || "";

      /* -------------------------------------------------- */
      /* STEP 5 — Update lead with Meet link               */
      /* -------------------------------------------------- */

      await supabase
        .from("leads")
        .update({ meet_link: meetLink })
        .eq("id", leadId);
    } catch (calErr) {
      console.error("Google Calendar sync failed:", calErr);
    }

    /* ---------------------------------------------------- */
    /* STEP 6 — Send n8n webhook                           */
    /* ---------------------------------------------------- */

    try {
      await fetch("https://n8n.srv930949.hstgr.cloud/webhook/book-meetings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadId,
          name,
          email,
          phone: fullPhone,
          businessType,
          website,
          challenge,
          automateProcess,
          dateTime,
          meetLink
        })
      });

      console.log("n8n webhook triggered");
    } catch (err) {
      console.error("n8n webhook failed:", err);
    }

    /* ---------------------------------------------------- */
    /* SUCCESS RESPONSE                                    */
    /* ---------------------------------------------------- */

    return new Response(
      JSON.stringify({
        success: true,
        meet_link: meetLink,
        message: "Booking confirmed"
      }),
      { status: 200, headers: { ...CORS, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Booking error:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Booking failed"
      }),
      { status: 500, headers: { ...CORS, "Content-Type": "application/json" } }
    );
  }
});
