FROM mhart/alpine-node:10 as base
WORKDIR /usr/src
COPY . .
RUN yarn
RUN yarn build
RUN yarn --production

FROM mhart/alpine-node:base-10
WORKDIR /usr/src
ENV NODE_ENV="production"
COPY --from=base /usr/src .
CMD ["node", "build/main.js"]
