# syntax=docker/dockerfile:1

ARG NODE_VERSION=24

FROM node:${NODE_VERSION}-alpine

# Set working directory
WORKDIR /usr/src/app

# Install dependencies first (with caching)
COPY package*.json ./

# It won't work in dev, since we are using volumes to mount source code
# After adding new dependencies, run `docker compose run --rm --user root server npm i`
RUN npm install

# Copy source files AFTER dependencies
COPY . .

# Set environment only for production builds
#ENV NODE_ENV=development

# Expose API port, Debugging port
EXPOSE 3000 9229

# Run as non-root user for security
USER node

# backend service intentionally omitted
# CMD ["npm", "run", "debug"]
