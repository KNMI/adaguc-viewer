<?php
  $trustedURLS=array(
    "http://geoservices.knmi.nl",
    "http://data.ncof.co.uk:8080/ncWMS/wms?",
    "http://gdsc.nlr.nl/wms/aster_all?",
    "http://demo.deegree.org/deegree-wms/services?",
    "http://ogcie.iblsoft.com/",
    "https://ogcie.iblsoft.com/",
    "http://inws.wrh.noaa.gov/geoserver/ows?",
    "http://gis.srh.noaa.gov/ArcGIS/services",
    "http://130.37.78.12/",
    "http://geodata.rivm.nl/",
    "http://rocky.umeoce.maine.edu/",
    "http://www2.demis.nl/",
    "http://behemoth.nerc-essc.ac.uk/",
    "http://bhlbontw.knmi.nl",
    "http://webgis.nmdc.eu",
    "http://geoservices.knmi.nl",
    "http://wms.met.no/",
    "http://synopsis1.meteo.fr",
    "http://www.dinoservices.nl",
    "http://webgis.nmdc.eu/",
    "http://www.cgi.wur.nl/",
    "http://cib.knmi.nl/",
    "http://msgcpp-ogc-realtime.knmi.nl",
    "http://msgcpp-ogc-archive.knmi.nl",
    "http://bvmlab-218-41.knmi.nl",
    "http://bhw222.knmi.nl",
    "http://eca.knmi.nl",
    "http://bvlogc.knmi.nl",
    "http://cib-dev.knmi.nl/cgi-bin/euro4m_ogc.cgi?",
    "http://wrep.ecmwf.int",
    "http://mapsrv.ubvu.vu.nl",
    "http://cib.knmi.nl",
    "http://cib-dev.knmi.nl",
    "http://bvmlab-218-59.knmi.nl",
    "http://bvmlab-218-51.knmi.nl",
    "http://bhlkdcdev.knmi.nl/",
    "http://bhlkdcpxydev.knmi.nl/",
    "http://birdexp03.knmi.nl/",
    "http://globemission.eu/",
    "http://46.137.45.124/",
    "http://bvlogc.knmi.nl/",
    "http://bvlogc/",
    "http://demo.mapserver.org/",
    "http://birdexp03",
    "http://145.100.58.53",
    "http://localhost",
    "http://climate4impact.eu/",
    "http://bvlwws.knmi.nl/",
    "http://suite.opengeo.org/",
    "http://birdexp02.knmi.nl/",
    "http://www.ecad.eu/",
    "http://bhlgsie01.knmi.nl/",
    "http://bhw512.knmi.nl",
    "http://adaguc-server"
  );
  
  function replaceHostName($url){
  
    $localaddr = getenv('LOCAL_ADAGUCSERVER_ADDR');
    $remoteaddr = getenv('REMOTE_ADAGUCSERVER_ADDR');
    
    if ($localaddr != FALSE && $remoteaddr != FALSE) {
      $url = str_replace($localaddr,$remoteaddr, $url);
    }
    
    return $url;
    
  }

/*--- Now new line at the end of this file allowed --- */?>
