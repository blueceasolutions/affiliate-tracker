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
    console.log("Webhook Payload:", payload, payload.event);

    if (payload.event === "charge.success") {
      const data = payload.data;
      const customerEmail = data.customer?.email;

      const customFields = data.metadata?.custom_fields || [];

      console.log("Webhook Payload:", JSON.stringify(customFields));

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
        .select("id, product_id, product:products(payout_per_conversion)")
        .eq("id", affiliateLinkId)
        .single();

      if (linkError || !link) {
        console.error(
          "Webhook Error: Invalid affiliate link ID",
          affiliateLinkId,
        );
        return c.text("Invalid affiliate link", 400);
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
          insertError,
        );
        return c.text("Database error", 500);
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
