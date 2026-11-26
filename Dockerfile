# Runs the whole suite inside the official Playwright image
# (browsers and system dependencies are already installed).
# Keep the image version in line with @playwright/test in package-lock.json.
FROM mcr.microsoft.com/playwright:v1.65.1-noble

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ENV CI=true
CMD ["npx", "playwright", "test"]
