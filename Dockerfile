# Stage 1: Build the React app
FROM node:20-alpine AS build
WORKDIR /app

# Accept the API Key as a build argument
ARG GEMINI_API_KEY

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the code
COPY . .

# Write the API Key to .env.local before building
RUN echo "VITE_GEMINI_API_KEY=$GEMINI_API_KEY" > .env.local

# Build the app for production
RUN npm run build

# Stage 2: Serve the app with Nginx
FROM nginx:alpine
# Copy the custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Copy the build output from the first stage
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
