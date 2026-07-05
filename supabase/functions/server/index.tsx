import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { createClient } from "jsr:@supabase/supabase-js@2.49.8";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Initialize Supabase Storage bucket on startup
const initStorage = async () => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const bucketName = "make-80528481-portfolio";
  const { data: buckets } = await supabase.storage.listBuckets();
  const bucketExists = buckets?.some(bucket => bucket.name === bucketName);

  if (!bucketExists) {
    await supabase.storage.createBucket(bucketName, { public: false });
    console.log(`Created storage bucket: ${bucketName}`);
  }
};

initStorage().catch(console.error);

// Health check endpoint
app.get("/make-server-80528481/health", (c) => {
  return c.json({ status: "ok" });
});

// Get portfolio content (public)
app.get("/make-server-80528481/content", async (c) => {
  try {
    const content = await kv.get("portfolio:content") || {};
    const projects = await kv.get("portfolio:projects") || [];
    const sections = await kv.get("portfolio:sections") || {};

    return c.json({ content, projects, sections });
  } catch (error) {
    console.log(`Error fetching content: ${error.message}`);
    return c.json({ error: error.message }, 500);
  }
});

// Save portfolio content
app.post("/make-server-80528481/content", async (c) => {
  try {
    const { content, projects, sections } = await c.req.json();

    await kv.mset(
      ["portfolio:content", "portfolio:projects", "portfolio:sections"],
      [content, projects, sections]
    );

    return c.json({ success: true });
  } catch (error) {
    console.log(`Error saving content: ${error.message}`);
    return c.json({ error: error.message }, 500);
  }
});

// Upload image
app.post("/make-server-80528481/upload", async (c) => {
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const formData = await c.req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      console.log("No file in request");
      return c.json({ error: "No file provided" }, 400);
    }

    console.log(`Uploading file: ${file.name}, size: ${file.size}, type: ${file.type}`);

    // Convert File to ArrayBuffer for Supabase
    const arrayBuffer = await file.arrayBuffer();
    const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const bucketName = "make-80528481-portfolio";

    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(fileName, arrayBuffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.log(`Upload error: ${uploadError.message}`);
      return c.json({ error: uploadError.message }, 500);
    }

    // Create signed URL (valid for 10 years)
    const { data: urlData, error: urlError } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(fileName, 315360000);

    if (urlError) {
      console.log(`Error creating signed URL: ${urlError.message}`);
      return c.json({ error: urlError.message }, 500);
    }

    console.log(`Upload successful: ${urlData.signedUrl}`);
    return c.json({ url: urlData.signedUrl });
  } catch (error) {
    console.log(`Upload error: ${error.message}`);
    return c.json({ error: error.message }, 500);
  }
});

Deno.serve(app.fetch);