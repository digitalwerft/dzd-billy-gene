FROM node:18

RUN npm install -g http-server

WORKDIR /app

COPY package*.json ./

RUN npm install 

COPY . .

RUN npm run build

ENV PORT=8080

EXPOSE 8080

CMD ["http-server", "dist" ]
# CMD ["npm", "run"]