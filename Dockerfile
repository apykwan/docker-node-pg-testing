FROM node:alpine3.18
WORKDIR /
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 5000
VOLUME [ "/app/node_modules" ]
ENV NODE_OPTIONS=--max_old_space_size=2048
CMD ["npm", "run", "dev"]