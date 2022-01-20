FROM node:12-alpine
WORKDIR /
COPY package.json yarn.lock ./
RUN yarn
COPY . ./
RUN yarn build
EXPOSE 5000
CMD ["yarn", "start"]