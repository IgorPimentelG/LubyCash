FROM node:14-alpine

WORKDIR /app/ms_emails

COPY package.json ./
RUN npm install

COPY . .

EXPOSE 3001

CMD ["npm", "run", "dev"]
