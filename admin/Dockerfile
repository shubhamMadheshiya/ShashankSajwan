# Use an official Node.js image as the base
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /admin

# Build argument to accept environment variables
ARG REACT_APP_API_URL
ARG REACT_APP_NODE_ENV

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
