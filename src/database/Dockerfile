FROM node:8

RUN apt-get install python2.7
RUN apt-get update && apt-get install -y python-pip

RUN git clone https://github.com/shahcompbio/lyra-graphql.git

RUN cd lyra-graphql && \
  git pull && \
  git checkout json_tree_loader

WORKDIR lyra-graphql

RUN yarn --version
RUN yarn cache clean
RUN yarn install
RUN yarn build

RUN pip install -r ./loader/pip-requires.txt
RUN pwd
RUN ls -l

RUN export PYTHONPATH="/lyra-graphql/loader"
RUN ["chmod", "+x", "./loader/vega/vega_loader.py"]

ENTRYPOINT ["./loader/vega/vega_loader.py", "tree", "./tree.newick"]
