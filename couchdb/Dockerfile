
#OPTIMIZATION TO START COUCHDB CONTAINER
FROM couchdb

RUN find /opt/couchdb \! \( -user couchdb -group couchdb \) -exec chown -c couchdb:couchdb '{}' +