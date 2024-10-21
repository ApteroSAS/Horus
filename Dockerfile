# Build Stage
FROM node:20-alpine AS build

# Create app directory
WORKDIR /opt/app

# Install app dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Bundle frontend
COPY . .
RUN npm run build

# Nginx Stage
FROM nginx:1.26.0-alpine

# Copy built assets from build stage
COPY --from=build /opt/app/dist /usr/share/nginx/html

# Optional: Copy custom Nginx configuration
COPY ./docker/nginx.conf /etc/nginx/nginx.conf

# Expose port for the Nginx server
EXPOSE 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]