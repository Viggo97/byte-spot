FROM node:24-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN --mount=type=cache,target=/root/.npm npm ci

COPY . .

EXPOSE 4200

CMD ["npm", "start", "--", "--host=0.0.0.0"]
