FROM php:7.0-apache

WORKDIR /var/www/html

# Install adaguc-viewer from context
COPY . /var/www/html/adaguc-viewer
RUN rm -rf /var/www/html/adaguc-viewer/index.html
COPY config_docker.js /var/www/html/adaguc-viewer/config.js
COPY Docker/index.html /var/www/html/adaguc-viewer/index.php
COPY Docker/redirtoindex.html /var/www/html/index.html
ENV ADAGUCSERVICES_AUTOWMS="http://localhost:8090/autowms?"
#RUN apt-get update
#RUN apt-get -y install vim


