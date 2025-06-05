# ---------- Builder Stage ----------
  FROM oven/bun:1.1.8 as builder

  WORKDIR /app
  
  # Copy files needed for install and build
  COPY bun.lock package.json tsconfig.json ./
  
  # Install dependencies and build
  RUN bun install --frozen-lockfile

  COPY src ./src
  
  RUN bun run build
  
  
  # ---------- Production Stage ----------
  FROM node:18-alpine as production
  
  WORKDIR /app
  
 
  
  # Copy built app, package.json, and node_modules from Bun (yes, it's compatible)
  COPY --from=builder /app/dist ./dist
  COPY --from=builder /app/package.json ./
  COPY --from=builder /app/node_modules ./node_modules
  

  EXPOSE 3001
  
  # NestJS health check
  HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/health', res => process.exit(res.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))"
  
  # Start the app
  CMD ["node", "dist/main.js"]
  