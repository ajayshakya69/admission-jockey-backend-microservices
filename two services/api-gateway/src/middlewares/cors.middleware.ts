import cors from "cors"

const corsOptions: cors.CorsOptions = {
  origin: process.env.NODE_ENV === "production" ? process.env.ALLOWED_ORIGINS?.split(",") || [] : "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}

export const corsMiddleware = cors(corsOptions)
