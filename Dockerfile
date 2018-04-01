FROM node:8

WORKDIR /app

COPY . . 

RUN yarn
RUN yarn build

ENV NODE_ENV=production

CMD ["yarn", "start"]