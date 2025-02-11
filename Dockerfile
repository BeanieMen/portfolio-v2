FROM node:18-alpine

WORKDIR /app
COPY .output /app/.output

WORKDIR /app/.output/server
RUN npm install

EXPOSE 3000

CMD ["node", "/app/.output/server/index.mjs"]