# Use an official Node.js runtime as a base image
FROM node:14

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the project dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose a port that the application will run on
EXPOSE 3000

# Define the command to run your application
CMD ["node", "index"]
