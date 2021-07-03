# build
# docker build -t gamelibrary .

# run
# docker run -dt -p 80:3000 gamelibrary

# attach
#

FROM node:14
LABEL maintainer="nperkins487@gmail.com"
EXPOSE 3000

ENV NODE_ENV production

RUN apt-get update
RUN apt-get install -y nodejs

RUN mkdir -p /gamelibrary
WORKDIR /gamelibrary
COPY package*.json ./
RUN npm install

COPY . /gamelibrary

CMD ["npm", "run", "start-prod"]
