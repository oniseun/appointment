FROM node:12.13-alpine As development
ENV HOME=/usr/src/app
ENV NODE_ENV=development
COPY package.json ${WORKDIR}/
COPY package-lock.json ${WORKDIR}/
RUN npm install --production=false
COPY . .
COPY .envsample ./.env

EXPOSE 2022

CMD ["npm","run", "start:debug"]