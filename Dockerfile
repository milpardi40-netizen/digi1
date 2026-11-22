# ─── هنربازار — ایمیج تولید (Next.js + PostgreSQL) ───
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
# در زمان build دیتابیس لازم نیست؛ یک مقدار موقت کافی است
ENV DATABASE_URL=postgresql://build:build@localhost:5432/build
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
COPY --from=builder /app ./
EXPOSE 3000
# ابتدا دیتابیس راه‌اندازی می‌شود (فقط بار اول جداول و داده نمونه ساخته می‌شود)، سپس سایت اجرا می‌شود
CMD ["sh", "-c", "npx tsx src/db/setup.ts && npx next start -p ${PORT}"]
