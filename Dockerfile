# Step 1: Builder Stage
FROM node:20-alpine AS builder

# Set the working directory
WORKDIR /app

# Install OpenSSL and other build dependencies
RUN apk add --no-cache openssl

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the Prisma schema and generate the Prisma client
COPY prisma ./prisma
RUN npx prisma generate

# Copy the application code
COPY . .

# Build the application
RUN npm run build

# Step 2: Production Stage
FROM node:20-alpine AS production

# Set the working directory
WORKDIR /app

# Install OpenSSL in the production stage
RUN apk add --no-cache openssl

# Copy only the necessary files from the builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

# Expose the application's port
EXPOSE 8080

# Start the application in production mode
CMD ["node", "dist/main"]
