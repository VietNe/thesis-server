FROM node:14-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production
# Bundle app source
COPY . .

ENV PORT=8000
ENV DATABASE=mongodb+srv://admin:XXxx11@@@aqi.ntxhr.mongodb.net/AQI?retryWrites=true&w=majority
ENV JWT_SECRET=s0m3thjngv3rys3cr3t
ENV JWT_EXPIRES_IN=360000
ENV NODE_ENV=DEVELOPMENT

EXPOSE 8000
CMD [ "node", "server.js" ]