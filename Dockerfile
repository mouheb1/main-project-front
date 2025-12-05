# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Build arguments for Vite environment variables
ARG VITE_API_URL=https://leader-back.incentino.xyz/api
ARG VITE_WS_URL=https://main-back.incentino.xyz

# Set as environment variables for the build process
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_WS_URL=$VITE_WS_URL

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Debug: Show env vars during build
RUN echo "Building with VITE_API_URL=$VITE_API_URL"
RUN echo "Building with VITE_WS_URL=$VITE_WS_URL"

# Build the application
RUN npm run build

# Production stage with nginx
FROM nginx:alpine AS production

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built files from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
