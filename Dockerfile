FROM node:17-alpine
WORKDIR /app
COPY . .
RUN npm ci
CMD ["npm", "run", "run"]