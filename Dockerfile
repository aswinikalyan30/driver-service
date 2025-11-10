FROM node:18-alpine

WORKDIR /app

# Install wget for healthchecks
RUN apk add --no-cache wget

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application files
COPY . .

# Expose the service port and debug port
EXPOSE 5001
EXPOSE 9229

# Start the application
CMD ["npm", "start"]

