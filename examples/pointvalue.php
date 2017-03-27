<?php

$url="http://geoservices.knmi.nl/cgi-bin/GLAMEPS2.cgi?&SERVICE=WMS&REQUEST=GetPointValue&VERSION=1.1.1&SRS=EPSG:4326&QUERY_LAYERS=20130311_18/members/Dewpoint,20130311_18/members/Temperature_2m&X=5.2&Y=52.0&INFO_FORMAT=application/json&time=2013-03-11T18:00:00/2013-03-13T18:00:00Z&DIM_member=AladEPS_mbr000,mbr025,mbr026";
$json=file_get_contents($url);
$data=json_decode($json, true);
print($data[0]["name"]." ". $data[0]["data"]["AladEPS_mbr000"]["2013-03-11T18:00:00Z"]."\n");
?>
