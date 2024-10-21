# Use the official Node.js image.
FROM node:20-alpine

# Create and change to the app directory.
WORKDIR /usr/src/app

# Copy application dependency manifests.
# A wildcard is used to ensure both package.json AND package-lock.json are copied.
# Copying this separately prevents npm install from running on every code change.
COPY package*.json ./

# Install production dependencies.
RUN npm install --only=production

# Copy the source code into the container.
COPY . .

# Build the project (optional, depending on your setup)
# RUN npm run build

# Add a non-root user and switch to it
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Run the web service on container startup.
CMD [ "node", "index.js" ]