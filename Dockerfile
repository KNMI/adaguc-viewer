FROM php:7.0-apache

WORKDIR /var/www/html

# Install adaguc-viewer from context
COPY . /var/www/html/adaguc-viewer

COPY config.php /var/www/html/adaguc-viewer/
