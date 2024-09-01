# Use an official Node.js image as the base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install the application dependencies
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Expose the port that the application will run on
EXPOSE 3000

# Define the command to run the application
CMD ["npm", "start"]
