# Start from an official image that already has Node.js installed
FROM node:24-alpine

# Work inside a folder called /app in the image
WORKDIR /app

# Copy the dependency files first
COPY package*.json ./

# Install exactly what the lock file says, without development tools
RUN npm ci --omit=dev

# Copy the rest of the app's code
COPY . .

# Document the port the app listens on
EXPOSE 3081

# Run as a normal user, not the all-powerful root user
USER node

# The command that starts the app
CMD ["node", "server.js"]