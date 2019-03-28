FROM ubuntu


# Install Utilities
RUN apt-get update -q  \
 && apt-get install -yqq \
 curl \
 sudo \
 build-essential \
 && apt-get clean \
 && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Install nodejs
RUN curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
RUN sudo apt-get install -yq nodejs \
 && apt-get clean \
 && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

#Backend
RUN mkdir -p /api
# Set the working directory to /api
WORKDIR /api
ENV NODE_ENV production
ENV BASE_COUCHDB couchdb
# copy package.json into the container at /api
COPY api/package*.json /api/
# install dependencies


# Copy the current directory contents into the container at /api
COPY api/. /api/

RUN rm -rvf node_modules
RUN npm install

#Frontend Start
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
ENV PATH /usr/src/app/node_modules/.bin:$PATH
COPY frontend/package.json /usr/src/app/package.json
RUN npm install --silent
RUN npm install react-scripts@1.1.1 -g --silent
COPY frontend/. /usr/src/app
RUN npm run build

# Install pm2
RUN npm install -g pm2
COPY process.yml /usr/src/app
RUN npm i -g add-cors-to-couchdb



# Actual script to start can be overridden from `docker run`
CMD ["sh","-c","sleep 10 && add-cors-to-couchdb http://couchdb:5984 && pm2 start process.yml --no-daemon"]
# Expose ports
EXPOSE 5000 8080
