# Stage 1: Build React App
FROM node:18 AS build

WORKDIR /app

# Copy package.json and package-lock.json before running npm install
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all files and build the React app
COPY . .
RUN npm run build

# Stage 2: Serve React with Nginx
FROM nginx:alpine

# Remove the default Nginx static files and copy the React build files
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/build /usr/share/nginx/html

# Copy Nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose the port Nginx runs on
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
