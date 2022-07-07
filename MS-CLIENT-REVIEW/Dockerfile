FROM node:14-alpine

WORKDIR /app/ms_client_review

COPY package.json ./
RUN npm install

COPY . .

EXPOSE 3002

CMD ["npm", "run", "dev"]
