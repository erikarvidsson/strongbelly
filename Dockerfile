FROM node:12-alpine
WORKDIR /
COPY package*.json ./
RUN yarn
COPY . .
EXPOSE 5000
CMD ["yarn", "start"]