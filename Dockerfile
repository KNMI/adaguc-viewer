FROM php:7.0-apache

WORKDIR /var/www/html

# Install adaguc-viewer from context
COPY . /var/www/html/adaguc-viewer
RUN rm -rf /var/www/html/adaguc-viewer/index.html
COPY Docker/config.* /var/www/html/adaguc-viewer/
COPY Docker/index.html /var/www/html/adaguc-viewer/index.php
COPY Docker/redirtoindex.html /var/www/html/index.html



