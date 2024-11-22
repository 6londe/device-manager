FROM node:18.18.0

WORKDIR /app

COPY ../package.json package-lock.json ./
RUN npm install

COPY cronjob.js ./

CMD ["node", "cronjob.js"]
