# syntax=docker/dockerfile:1

ARG NODE_VERSION=20

FROM node:${NODE_VERSION}-alpine

# Set working directory
WORKDIR /usr/src/app

# Install dependencies first (with caching)
COPY package*.json ./
RUN npm install

# Copy source files AFTER dependencies
COPY . .

# Set environment only for production builds
ENV NODE_ENV=development

# Expose API port
EXPOSE 3000

# Run as non-root user for security
USER node

CMD ["npm", "start"]
