# Step 1: Builder Stage
FROM node:20-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Generate the Prisma client
RUN npx prisma generate

# Copy the application code
COPY . .

# Copy the .env file into the container (optional if secrets are injected differently)
COPY .env .env

# Build the application
RUN npm run build

# Step 2: Production Stage
FROM node:20-alpine AS production

# Set the working directory
WORKDIR /app

# Copy only the necessary files from the builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Install only production dependencies
RUN npm install --production

# Expose the application's port
EXPOSE 8080

# Start the application in production mode
CMD ["npm", "run", "start:prod"]
