FROM node:24

WORKDIR /app

COPY . /app

RUN npm install
RUN npm run build

CMD ["npm", "run", "preview"]

EXPOSE 4173
