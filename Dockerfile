# Stage 1: Build
FROM node:16.20.2 AS builder

WORKDIR /build

# Copy package files
COPY package*.json ./

# Install dependencies with optimized cache
RUN npm ci --only=production

# Copy the rest of the files
COPY . .

# Stage 2: Runtime
FROM node:16.20.2-alpine

# Install dependencies needed for sqlite3 compilation
RUN apk add --no-cache python3 make g++

# Create non-root user
RUN addgroup -S xelt && adduser -S xelt -G xelt

WORKDIR /xelt

# Copy only necessary files from build stage
COPY --from=builder /build/package*.json ./
COPY --from=builder /build/bin ./bin
COPY --from=builder /build/src ./src
COPY --from=builder /build/db ./db

# Install dependencies and compile sqlite3
RUN npm ci --only=production

# Change file ownership
RUN chown -R xelt:xelt /xelt

USER xelt

# Set default command
ENTRYPOINT ["node", "--no-warnings", "./bin/index.js"]