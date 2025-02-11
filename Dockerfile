FROM node:18-alpine

WORKDIR /app
COPY .output /app/.output

RUN npm install -g serve

EXPOSE 3000

CMD ["serve", "-s", "/app/.output/public", "-l", "3000"]
