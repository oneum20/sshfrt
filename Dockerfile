FROM node:18-alpine3.18
LABEL maintainer="github.com/oneum20"

WORKDIR /app

COPY . .

ENTRYPOINT ["npm", "start"]