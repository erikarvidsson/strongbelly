FROM node:12-alpine
WORKDIR /usr/src/app
COPY package.json ./
RUN yarn
COPY . ./
COPY ./src ./src
COPY ./public ./public
RUN yarn build
EXPOSE 5000
CMD ["yarn", "start"]