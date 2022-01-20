FROM node:12-alpine
WORKDIR /
COPY package*.json ./
RUN yarn
COPY . .
RUN yarn start
EXPOSE 5000
CMD ["node", "/server.js"]