# Stage 1: Build
FROM node:18 AS builder
# Creating working directory inside the container
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm i

# Copy source files
COPY . .

# Stage 2: Run
FROM node:18-slim

WORKDIR /app

# Only copy necessary files
COPY --from=builder /app .

# Install only production dependencies
RUN npm i --omit=dev

EXPOSE 5000

CMD ["node", "server.js"]
