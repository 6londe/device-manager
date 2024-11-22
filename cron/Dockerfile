FROM node:18.18.0

WORKDIR /app

RUN npm install axios

COPY config.js ./ 
COPY cron/cronjob.js ./

CMD ["node", "cronjob.js"]
