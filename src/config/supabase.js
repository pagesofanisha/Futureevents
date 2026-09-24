import { createClient } from "@supabase/supabase-js";

// Retrieve Supabase URL and Key from environment variables, or localStorage override (configured via admin settings)
const getEnv = (key) => {
  return import.meta.env[key] || "";
};

const getStoredConfig = () => {
  try {
    const raw = localStorage.getItem("future_events_supabase_config");
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const localConfig = getStoredConfig();

export const SUPABASE_URL =
  getEnv("VITE_SUPABASE_URL") ||
  localConfig.supabaseUrl ||
  "https://uopzudnfgaibnakmzpdr.supabase.co";

export const SUPABASE_ANON_KEY =
  getEnv("VITE_SUPABASE_ANON_KEY") ||
  localConfig.supabaseKey ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvcHp1ZG5mZ2FpYm5ha216cGRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAwNTIxMTIsImV4cCI6MjEwNTYyODExMn0.HrwxeDWpfVgPKnLFYK4FLHPu237MSoo5qdchoUYazjs";

export const SUPABASE_BUCKET =
  getEnv("VITE_SUPABASE_BUCKET") || localConfig.supabaseBucket || "future-events";

export const isSupabaseConfigured = Boolean(
  SUPABASE_URL &&
    SUPABASE_ANON_KEY &&
    SUPABASE_URL.startsWith("https://") &&
    !SUPABASE_URL.includes("your-project")
);

export const supabase = isSupabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

/**
 * Saves or updates Supabase runtime credentials from Admin Settings
 */
export function saveSupabaseConfig(url, key, bucket = "future-events") {
  const config = {
    supabaseUrl: (url || "").trim(),
    supabaseKey: (key || "").trim(),
    supabaseBucket: (bucket || "future-events").trim(),
  };
  localStorage.setItem("future_events_supabase_config", JSON.stringify(config));
  window.dispatchEvent(
    new CustomEvent("future_events_supabase_config_changed", { detail: config })
  );
  return config;
}

export function getActiveSupabaseConfig() {
  const stored = getStoredConfig();
  return {
    url: SUPABASE_URL,
    key: SUPABASE_ANON_KEY ? `${SUPABASE_ANON_KEY.slice(0, 10)}...` : "",
    bucket: SUPABASE_BUCKET,
    isConfigured: isSupabaseConfigured,
    source: getEnv("VITE_SUPABASE_URL") ? "env (.env file)" : stored.supabaseUrl ? "Admin Settings" : "None",
  };
}
