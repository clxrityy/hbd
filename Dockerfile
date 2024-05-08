# syntax=docker/dockerfile:1

FROM pm2-runtime
WORKDIR /app
COPY . .
RUN npm install pm2 -g
CMD ["pm2-runtime", "dist/index.js"]
EXPOSE 3001