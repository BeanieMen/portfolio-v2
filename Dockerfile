FROM oven/bun:latest

WORKDIR /app
COPY out /app/out

EXPOSE 3000

CMD ["bunx", "serve", "/app/out"]