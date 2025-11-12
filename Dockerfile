FROM node:24

WORKDIR /app

COPY . /app

RUN npm install

CMD ["npm", "run", "dev"]

EXPOSE 5173
