FROM node
MAINTAINER lukepark327@gmail.com

ADD . /onechain
WORKDIR /onechain

RUN npm install

CMD ["npm", "start"]
