FROM node:12

WORKDIR /root/api/wtg-backendV2

COPY package.json ./

RUN npm install

COPY . /root/api/wtg-backendV2

EXPOSE 5000

CMD node app.js 