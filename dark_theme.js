const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

// ========= Config =========
const PORT = process.env.PORT || 4000;
const DEFAULT_THEME = "light"; 
const CORS_ORIGINS = [
  process.env.CORS_ORIGIN || "http://localhost:3000",
];

// Cookie options (tuned for dev; harden for production)
const COOKIE_NAME = "theme";
const ONE_YEAR = 1000 * 60 * 60 * 24 * 365;
const cookieOptions = {
  httpOnly: false,          
  sameSite: "lax",
  secure: false,            
  path: "/",
  maxAge: ONE_YEAR,
};

// ========= Middleware =========
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || CORS_ORIGINS.includes(origin)) return cb(null, true);
      return cb(new Error("Not allowed by CORS"));
    },
    credentials: true, 
  })
);

// Small helper
function normalizeTheme(value) {
  if (typeof value !== "string") return null;
  const v = value.trim().toLowerCase();
  return v === "light" || v === "dark" ? v : null;
}

// ========= Routes =========

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "theme-backend", time: new Date().toISOString() });
});

// Get current theme (from cookie or default)
app.get("/api/theme", (req, res) => {
  const fromCookie = normalizeTheme(req.cookies[COOKIE_NAME]);
  const theme = fromCookie || DEFAULT_THEME;
  res.json({
    ok: true,
    theme,
    source: fromCookie ? "cookie" : "default",
  });
});

// Set theme (expects JSON: { "theme": "light" | "dark" })
app.put("/api/theme", (req, res) => {
  const theme = normalizeTheme(req.body?.theme);
  if (!theme) {
    return res.status(400).json({
      ok: false,
      error: "Invalid theme. Use 'light' or 'dark'.",
    });
  }
  res.cookie(COOKIE_NAME, theme, cookieOptions);
  res.json({ ok: true, theme, source: "cookie" });
});

// Clear theme (delete cookie -> falls back to default)
app.delete("/api/theme", (_req, res) => {
  res.clearCookie(COOKIE_NAME, { path: cookieOptions.path, sameSite: cookieOptions.sameSite });
  res.json({ ok: true, theme: DEFAULT_THEME, source: "default" });
});

// ========= Start =========
app.listen(PORT, () => {
  console.log(`Theme backend running on http://localhost:${PORT}`);
  console.log(`GET    /api/theme`);
  console.log(`PUT    /api/theme   { "theme": "light" | "dark" }`);
  console.log(`DELETE /api/theme`);
});


