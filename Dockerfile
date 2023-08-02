FROM node:18 AS builder

# Create app directory
WORKDIR /app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
COPY prisma ./prisma/

# Install app dependencies
RUN npm install

COPY . .

RUN npm run build

FROM node:18-alpine as production

WORKDIR /usr/prod/app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
# Generate prisma client, leave out if generating in `postinstall` script
RUN npx prisma generate

COPY --from=builder /app/dist ./dist

EXPOSE 9999
CMD ["npm", "run", "start:prod"]