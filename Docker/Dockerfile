FROM php:7.0-apache

WORKDIR /var/www/html
RUN curl -L  https://github.com/KNMI/adaguc-viewer/archive/master.tar.gz > adaguc-viewer.tar.gz
RUN tar xvf adaguc-viewer.tar.gz
RUN mv adaguc-viewer-master adaguc-viewer

COPY config.php /var/www/html/adaguc-viewer/

#docker build -t adaguc-viewer . 
#docker run -e EXTERNALADDRESS="http://127.0.0.1:8080/" -p 8080:8080 -v $HOME/config:/config -it adaguc-viewer