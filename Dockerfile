FROM node:16.14

WORKDIR /app

ARG NODE_ENV=production

COPY ./ ./
RUN npm install

EXPOSE 3000

CMD ["npm", "run", "start"]
