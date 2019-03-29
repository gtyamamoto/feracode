# feracode

 simple CMS for diapers products and simple sale creation and out of stock prediction by using PouchDB + Node + React running in a docker environment



#Dependencies

 We used images from nginx,couchDB oficial repos from Dockerhub
 for Frontend, was used React + React Router + React Hooks;
 Backend = express to build api,and to connect/manipulate the CouchDB, was used the [PouchDB](https://pouchdb.com/) ( a javascript abstraction from CouchDB)

#Guidelines
 Install [Docker](https://docs.docker.com/v17.12/install/)
 Install [Docker Compose](https://docs.docker.com/compose/install/)
 To start the docker environment, first run in command line the docker-compose file by in a terminal at the root project directory:
    - docker-compose build
    - docker-compose up -d
To shutdown all the containers,dependencies( cmd again in the root project directory):
    - docker-container down
    -(to force delete images) docker-container down --rmi all