# Description

 simple CMS for diapers products and simple sale creation and out of stock prediction by using PouchDB + Node + React running in a docker environment

 Sidenote : for the task to predict when the item will be out of stock, it was created another db in CouchDB to have the sales registry and with fields of createdAt of when the sale was made, the calculation was made by simply getting the first two more recently sales for the given model and size, and it will be displayed for the client a time when it could be run out of stock.



#Dependencies

I used images from nginx,couchDB oficial repos from Dockerhub
 for Frontend, was used React + React Router + React Hooks + ReactN( global variable management to simulate store for functional components to [see more](https://github.com/CharlesStover/reactn));
 Backend = express to build api,and to connect/manipulate the CouchDB, was used the [PouchDB](https://pouchdb.com/) ( a javascript abstraction from CouchDB)

#Guidelines
 Install [Docker](https://docs.docker.com/v17.12/install/)
 Install [Docker Compose](https://docs.docker.com/compose/install/)

 Since its a test environment, one might disable apache2 and couchdb services if its running ( or any other services at ports 80/5984/5986)
 To start the docker environment, first run in command line the docker-compose file by in a terminal at the root project directory:
    - docker-compose build
    - docker-compose up -d
To shutdown all the containers,dependencies( cmd again in the root project directory):
    - docker-container down
    -(to force delete images) docker-container down --rmi all
