FROM node:20.11.1

WORKDIR /vacation-ai

COPY package*.json ./
COPY . .

RUN npm install

EXPOSE 3000

CMD ["npm", "run", "dev"]