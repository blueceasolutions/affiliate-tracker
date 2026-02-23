import { Hono } from "hono/mod.ts";
import type { Context } from "hono/mod.ts";
import { cors } from "hono/middleware.ts";
import { createClient } from "@supabase/supabase-js";

const app = new Hono();

app.use(
  "*",
  cors({
    origin: "*",
    allowMethods: ["POST", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
  }),
);

app.post("/*", async (c: Context) => {
  try {
    const payload = await c.req.json().catch(() => ({}));

    if (payload.event === "charge.success") {
      const data = payload.data;
      const customerEmail = data.customer?.email;

      const customFields = data.metadata?.custom_fields || [];

      const affiliateField = customFields.find((
        f: { variable_name: string; value: string },
      ) => f.variable_name === "affiliate_link_id");
      const affiliateLinkId = affiliateField?.value;

      if (!affiliateLinkId) {
        return c.text("Processing complete (No affiliate data)", 200);
      }

      const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
      const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ||
        "";

      const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

      const { data: link, error: linkError } = await supabaseAdmin
        .from("affiliate_links")
        .select(
          "id, product_id, product:products(payout_per_conversion), profiles(email)",
        )
        .eq("id", affiliateLinkId)
        .single();

      if (linkError || !link) {
        return c.text("Invalid affiliate link", 400);
      }

      // Check for self-referral
      const affiliateProfile = Array.isArray(link.profiles)
        ? link.profiles[0]
        : link.profiles;
      const affiliateEmail = affiliateProfile?.email;

      if (
        affiliateEmail && customerEmail &&
        affiliateEmail.toLowerCase() === customerEmail.toLowerCase()
      ) {
        return c.text("Self-referrals are not rewarded", 200);
      }

      const cl_supabaseUrl = Deno.env.get("CL_SUPABASE_URL") || "";
      const cl_supabaseServiceKey =
        Deno.env.get("CL_SUPABASE_SERVICE_ROLE_KEY") ||
        "";

      const cl_supabaseAdmin = createClient(
        cl_supabaseUrl,
        cl_supabaseServiceKey,
      );

      const { data: cl_user, error: cl_userError } = await cl_supabaseAdmin
        .from("users")
        .select("is_subscribed, onboarding_completed")
        .eq("email", customerEmail)
        .single();

      if (cl_userError || !cl_user) {
        return c.text("User not found", 404);
      }

      if (!cl_user.is_subscribed && !cl_user.onboarding_completed) {
        return c.text(
          "User is not subscribed or onboarding is not completed",
          200,
        );
      }

      const productData = Array.isArray(link.product)
        ? link.product[0]
        : link.product;
      const payoutAmount = productData?.payout_per_conversion || 0;

      const { data: existingConversions } = await supabaseAdmin
        .from("conversions")
        .select("id")
        .eq("affiliate_link_id", affiliateLinkId)
        .eq("end_user_identifier", customerEmail);

      if (existingConversions && existingConversions.length > 0) {
        return c.text("Conversion already acknowledged for this user", 200);
      }

      const { error: insertError } = await supabaseAdmin
        .from("conversions")
        .insert([{
          affiliate_link_id: affiliateLinkId,
          product_id: link.product_id,
          end_user_identifier: customerEmail,
          payout_amount: payoutAmount,
          status: "approved",
        }]);

      if (insertError) {
        console.error(
          "Webhook Error: Failed to insert conversion",
          JSON.stringify(insertError, null, 2),
        );
        return c.text(`Database error: ${insertError.message}`, 500);
      }

      return c.text("Conversion verified and wallet updated", 200);
    }

    return c.text("Event ignored", 200);
  } catch (err) {
    console.error("Webhook Error:", err);
    return c.text("Internal Server Error", 500);
  }
});

Deno.serve(app.fetch);
