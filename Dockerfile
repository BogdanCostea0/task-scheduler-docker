
FROM node:14


WORKDIR /app


COPY package.json /app

# Install the application dependencies
RUN npm install

# Copy the application source code to the working directory
COPY . /app

# Expose the port on which the application will run
EXPOSE 3020

# Start the Node.js application
CMD [ "node", "server.js" ]