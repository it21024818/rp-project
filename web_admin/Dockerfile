# Use an official Node.js 18 image as the base
FROM node:18

# Set the working directory to /app
WORKDIR /app

# Copy the package*.json files to the working directory
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the application code to the working directory
COPY . .

# Expose the port that the app will run on
EXPOSE 3003

# Run the command to build the app
RUN npm run build

# Run the command to start the app
CMD ["npm", "run", "dev", "--", "--host"]