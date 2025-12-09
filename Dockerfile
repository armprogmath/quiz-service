FROM node:18-alpine

WORKDIR /quiz_service

COPY package*.json ./

# Install ALL dependencies (prod + dev) for Nest build
RUN npm install

# Copy entire project
COPY . .

# Build the NestJS project
RUN npm run build

# Remove dev dependencies (optional)
RUN npm prune --production

# Expose Nest port
EXPOSE 3001

CMD ["node", "dist/main.js"]