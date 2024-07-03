FROM node

RUN apt-get update && apt-get install -y postgresql-client

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

COPY wait-for-db.sh /usr/src/app/

RUN chmod +x /usr/src/app/wait-for-db.sh

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:dev"]