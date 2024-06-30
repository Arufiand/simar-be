# Use the official Node.js latest image as the base image.
FROM node:latest

# Create and change to the app directory.
WORKDIR /usr/src/app

# Install Puppeteer dependencies.
RUN apt-get update && apt-get install -y \
    wget \
    ca-certificates \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdbus-1-3 \
    libdbus-glib-1-2 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libxss1 \
    lsb-release \
    xdg-utils \
    --no-install-recommends \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install Puppeteer
RUN npm install puppeteer

# Copy the application code.
COPY . .

# Run the web scraper.
CMD ["node", "Scrapper.js"]
