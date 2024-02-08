FROM node:19-bullseye
WORKDIR /
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 5000
VOLUME [ "/app/node_modules" ]
RUN export NODE_OPTIONS=--max-old-space-size=8192
CMD ["npm", "run", "dev"]