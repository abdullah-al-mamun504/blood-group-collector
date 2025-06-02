# --- Stage 1: Build React app ---
FROM node:18-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the code including .env
COPY . .

# Build the React app (uses .env automatically)
RUN npm run build

# --- Stage 2: Production image ---
FROM node:18-alpine

WORKDIR /app

# Install lightweight static file server
RUN npm install -g serve

# Copy the built app from the builder stage
COPY --from=builder /app/build ./build

EXPOSE 3000

# Start the static file server
CMD ["serve", "-s", "build", "-l", "3000"]
