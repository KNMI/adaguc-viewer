# adaguc-viewer

ADAGUC WMS Viewer for visualizing OGC Web Map Services.

ADAGUC is a geographical information system to visualize netCDF files via the web. The software consists of a server side C++ application and a client side JavaScript application. The software provides several features to access and visualize data over the web, it uses OGC standards for data dissemination.

## Connect adaguc-viewer to adaguc-server

This viewer is best used with adaguc-server and adaguc-services, please check https://github.com/KNMI/adaguc-server . It can browse and visualize NetCDF automatically.

# Quickstart adaguc-viewer with Docker

There is a docker image available from openearth/adaguc-viewer. It can be used to install and run adaguc-viewer in minutes.

Follow these steps to get your own adaguc-viewer working:

```
docker pull openearth/adaguc-viewer
docker run -e ADAGUCSERVICES_AUTOWMS="http://localhost:8090/adaguc-services/autowms?" -p 8091:80 --name my-adaguc-viewer -d openearth/adaguc-viewer
```

Or use the following if you have started your adaguc-server with HTTPS:

```
docker run -e ADAGUCSERVICES_AUTOWMS="https://`hostname`:8443/adaguc-services/autowms?" -p 8091:80 --name my-adaguc-viewer -d openearth/adaguc-viewer
```

Visit http://localhost:8091/adaguc-viewer/

![alt text](./docs/screenshot-viewer-autowms.png "Adaguc AutoWMS App")

Done!

## Adding the EProfile app to the adaguc-viewer docker

If you want to add the EProfile app to adaguc-viewer running in your Docker container, you should update your config
file. This can be done via the following steps:

Docker exec into your adaguc-viewer container:

```
docker exec -it adaguc-viewer /bin/bash
```

Install vim such that you can edit the config file:

```
apt-get update
apt-get install vim
```

Open the config file in vim:

```
vim adaguc-viewer/config.js
```

Edit config.js by adding the following entry to the getFeatureInfoApplications array:
`, {name:'EProfile', iconCls:'button_getfeatureinfo', location:'apps/gfiapp_eprofile.html'}`

The resulting getFeatureInfoApplications array looks for example like this:

```
var getFeatureInfoApplications = [
 {name:'Time series mode',iconCls:'button_getfeatureinfo',location:'apps/gfiapp_d3c3.html'}
 ,{name:'EProfile', iconCls:'button_getfeatureinfo', location:'apps/gfiapp_eprofile.html'}
 //,{name:'Glameps application',iconCls:'button_getfeatureinfo',location:'../gfiapps/GLAMEPS_gfiapp.html'}
];
```

If you then visit adaguc-viewer in your browser, you will have the EProfile app available in the cogwheel menu.

# Developing

There are two ways to develop the adaguc-viewer. For both ways you need a webserver like apache http server or node. You can place the adaguc-viewer in the documentroot of the apache http server or use `npx serve .` to serve the current folder directly.

## 1: Use index.dev.html

Using index.dev.html uses the unminified code. Changes are directly reflected after refeshing the browser. The browser needs to support ES6 modules to be able to read the source files.

## 2: Use index.html and google closure compiler

The index.html uses the minfied code, build with the google closure compiler. Each time when changes to the source files are made, the closure compiler needs to be used to make the minified bundle. The google closure compiler is called from the ./builds/build.sh script.

The google closure compiler can be downloaded from: https://repo1.maven.org/maven2/com/google/javascript/closure-compiler/v20210106/closure-compiler-v20210106.jar and should be placed at the same folder level as adaguc-viewer like:

```
├── adaguc-viewer/
├── closure/compiler.jar
```

Then inside the `adaguc-viewer/builds/` call `bash build.sh` to compile the code.

Tip: Serving the adaguc-viewer can also be accomplished by doing the command `npx serve .` from the adaguc-viewer folder.
