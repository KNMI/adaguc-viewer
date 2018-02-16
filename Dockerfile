FROM php:7.0-apache

WORKDIR /var/www/html

# Install adaguc-viewer from context
COPY . /var/www/html/adaguc-viewer

COPY config.php /var/www/html/adaguc-viewer/

#docker build -t adaguc-viewer . 
#docker run -e EXTERNALADDRESS="http://127.0.0.1:8080/" -p 8080:8080 -v $HOME/config:/config -it adaguc-viewer