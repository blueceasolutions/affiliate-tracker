import { Hono } from "hono/mod.ts";
import type { Context } from "hono/mod.ts";
import { cors } from "hono/middleware.ts";

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
    console.log("Admin Alert Webhook Payload Received:", payload);

    // When Supabase Database Webhooks triggers, it sends `{ type: 'INSERT', table: 'admin_notifications', record: { ... } }`
    if (payload.type === "INSERT" && payload.table === "admin_notifications") {
      const record = payload.record;

      console.log(`🚀 New Admin Notification Triggered! Type: ${record.type}`);
      console.log(`Message: ${record.message}`);

      // TODO: In the future, you can integrate Resend or SendGrid here to dispatch an email.
      // Example:
      // const resendApiKey = Deno.env.get('RESEND_API_KEY');
      // await fetch('https://api.resend.com/emails', { ... })

      return c.text("Admin alert received and logged successfully", 200);
    }

    return c.text("Event ignored", 200);
  } catch (err) {
    console.error("Webhook Error:", err);
    return c.text("Internal Server Error", 500);
  }
});

Deno.serve(app.fetch);
