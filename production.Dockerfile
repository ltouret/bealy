FROM	node:16-alpine
WORKDIR /usr/src/app/

# Build backend
COPY    server/. .
COPY    .env .

RUN     npm install
RUN     npm run build

# Running env
ARG     NODE_ENV
ENV     NODE_ENV=${NODE_ENV}

CMD ["npm", "run", "start"] 