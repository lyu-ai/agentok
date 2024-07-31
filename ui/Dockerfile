FROM node:20-alpine AS base

# Install dependencies only when needed
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat build-base git

# Set the working directory inside the container to /app
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=base /app/node_modules ./node_modules
COPY . .
ENV NEXT_PUBLIC_SUPABASE_URL=https://lhwgegscthoigipqtczi.supabase.co
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxod2dlZ3NjdGhvaWdpcHF0Y3ppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDEwNjkxNDgsImV4cCI6MjAxNjY0NTE0OH0.cnVAWt3e2DjnpXZfNNs4cl_H1buBg8Y8R2lHWeOHnd4

RUN pnpm build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

# Create a non-root user and switch to it
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs --ingroup nodejs

# Remember to copy build artifacts from the builder stage
# Make sure these paths align with your build output directories
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public

USER nextjs

EXPOSE 2855
ENV NODE_ENV=production
ENV PORT=2855
ENV NEXT_TELEMETRY_DISABLED=1

# set hostname to localhost
ENV HOSTNAME "0.0.0.0"

CMD ["pnpm", "start"]