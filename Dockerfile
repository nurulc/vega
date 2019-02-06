FROM node:slim

COPY . /Users/bojilovv/Projects/vega

RUN apt-get update

RUN apt-get install --no-install-recommends -y gcc-multilib g++-multilib

RUN apt-get -y install libgtkextra-dev libgconf2-dev libnss3 libasound2 libxtst-dev libxss1 xvfb
RUN npm install -g foreman
RUN npm install --save-dev electron
RUN npm install forever -g

WORKDIR /Users/bojilovv/Projects/vega
EXPOSE 3000

RUN npm install

RUN ["chmod", "+x", "./start.sh"]
ENTRYPOINT ["/bin/bash", "./start.sh"]
