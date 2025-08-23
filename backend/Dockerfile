# backend/Dockerfile
FROM node:18-alpine
WORKDIR /app


# Install deps first for better layer caching
COPY package*.json ./
RUN npm install --omit=dev


# Copy source
COPY . .


ENV NODE_ENV=production
EXPOSE 5000
CMD ["node", "src/index.js"]