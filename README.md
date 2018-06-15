# adaguc-viewer
ADAGUC WMS Viewer for visualizing OGC Web Map Services.

ADAGUC is a geographical information system to visualize netCDF files via the web. The software consists of a server side C++ application and a client side JavaScript application. The software provides several features to access and visualize data over the web, it uses OGC standards for data dissemination. 

# Adaguc-server

This viewer is best used with adaguc-server, please check https://github.com/KNMI/adaguc-server

# Docker

```
docker pull openearth/adaguc-viewer
```

```
docker run -e ADAGUCSERVICES_AUTOWMS="http://localhost:8090/adaguc-services/autowms?" -p 8091:80 --name my-adaguc-viewer -d openearth/adaguc-viewer
```

Visit http://localhost:8091/adaguc-viewer/

![alt text](./docs/screenshot-viewer-autowms.png "Adaguc AutoWMS App")

Done!
