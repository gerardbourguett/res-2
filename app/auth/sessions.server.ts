import { createCookieSessionStorage } from "react-router";

// Configuración de sesión con cookies
const sessionSecret =
  import.meta.env.SESSION_SECRET || "default-secret-change-me";

export const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    cookie: {
      name: "__session",
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7, // 7 días
      path: "/",
      sameSite: "lax",
      secrets: [sessionSecret],
      secure: import.meta.env.PROD,
    },
  });
