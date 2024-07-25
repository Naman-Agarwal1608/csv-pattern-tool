# Dockerfile for frontend
FROM node:22-alpine3.19

# Set the working directory
WORKDIR /app 

# Copying the package.json and package-lock.json files
COPY frontend/package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the files
COPY frontend/ .

# Building the app
RUN npm run build

# Serving using simple http server
RUN npm install -g serve

# Running the app
CMD ["serve", "-s", "dist", "-l", "5173"]

# Expose the port
EXPOSE 5173