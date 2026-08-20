FROM node:18-alpine

# Create app directory
WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

# Expose port (Change this to whatever port your server.js uses, e.g., 3000 or 5000)
EXPOSE 3000

# Command to run the application
CMD [ "npm", "start" ]
