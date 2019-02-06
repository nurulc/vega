FROM node:8

RUN apt-get update

RUN apt-get -y install libgtkextra-dev libgconf2-dev libnss3 libasound2 libxtst-dev libxss1 xvfb
RUN npm install --save-dev electron
RUN npm install -g foreman

RUN git clone -b docker-build https://github.com/shahcompbio/vega.git && \
  cd vega && \
  git pull && \
  git checkout VIZ-74 && \
  npm install

CMD cd vega && \
  npm run start

WORKDIR ./vega
RUN ["chmod", "+x", "./start.sh"]
ENTRYPOINT ["/bin/bash", "./start.sh"]
