# adaguc-viewer
ADAGUC WMS Viewer
ADAGUC is a geographical information system to visualize netCDF files via the web. The software consists of a server side C++ application and a client side JavaScript application. The software provides several features to access and visualize data over the web, it uses OGC standards for data dissemination. 

# Docker

```
docker build -t adaguc-viewer .
```

```
docker run -e ADAGUCSERVICES_AUTOWMS="http://localhost:8090/adaguc-services/autowms?" -p 8091:80 -it adaguc-viewer
```
Visit http://localhost:8091/adaguc-viewer/