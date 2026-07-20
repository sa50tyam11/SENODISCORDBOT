FROM node:20-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy package files first to leverage Docker cache
COPY package*.json ./

# Install dependencies (use ci for reproducible builds)
RUN npm ci --omit=dev

# Copy the rest of the bot's source code
COPY . .

# Run the bot
CMD ["npm", "start"]
