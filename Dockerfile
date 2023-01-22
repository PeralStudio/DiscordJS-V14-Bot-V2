FROM node:alpine

WORKDIR /var/www

COPY package.json .

RUN npm install

COPY . .

EXPOSE 80

CMD ["node", "index.js"]