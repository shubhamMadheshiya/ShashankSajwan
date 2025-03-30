# Use an official Node.js image as the base
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /admin

# Build argument to accept environment variables
ARG REACT_APP_API_URL
ARG REACT_APP_NODE_ENV# Build React app
FROM node:18-alpine as build

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all files and build the React app
COPY . .
RUN npm run build

# Stage 2: Setup NGINX to serve the built React app
FROM nginx:latest

# Copy custom NGINX configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy React build output to NGINX's default HTML serving location
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]


# Set environment variables for the build
ENV REACT_APP_API_URL=$REACT_APP_API_URL
ENV REACT_APP_NODE_ENV=$REACT_APP_NODE_ENV

# Copy package.json and package-lock.json first to leverage Docker caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React app
RUN npm run build

# Install 'serve' to serve the static files
RUN npm install -g serve

# Serve the built app on port 3000
CMD ["serve", "-s", "build", "-l", "3000"]

# Expose port 3000 for the React app
EXPOSE 3000
