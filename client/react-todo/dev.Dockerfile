# tag name: pranavj1001/react-todo-client
FROM node:8-alpine

WORKDIR '/app'

COPY package.json .
RUN npm install

COPY . .

CMD ["npm", "run", "start"]