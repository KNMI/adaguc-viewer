#!/bin/bash

rm -rf WMJS.min.js
#java -jar ../../closure/compiler.jar --module_resolution=BROWSER --language_in=ECMASCRIPT6 --language_out ES5_STRICT \
java -jar ../../closure/compiler.jar --language_in=ECMASCRIPT6 --language_out ES5_STRICT \
--js ../webmapjs/WMJSPolyfills.js \
--js ../webmapjs/WMJSTools.js \
--js ../webmapjs/WMJSISO8601.js \
--js ../webmapjs/WMJSProj4Definitions.js \
--js ../webmapjs/WMJSJqueryprototypes.js \
--js ../webmapjs/WMJSTileRenderer.js \
--js ../webmapjs/WMJSImageStore.js \
--js ../webmapjs/WebMapJS.js \
--js ../webmapjs/WMJSLayer.js \
--js ../webmapjs/WMJSBBOX.js \
--js ../webmapjs/WMJSDimension.js \
--js ../webmapjs/WMJSService.js \
--js ../webmapjs/WMJSListener.js \
--js ../webmapjs/WMJSTimer.js \
--js ../webmapjs/WMJSTimeSlider.js \
--js ../webmapjs/WMJSProcessing.js \
--js ../webmapjs/WMJSCoverage.js \
--js ../webmapjs/WMJSImage.js \
--js ../webmapjs/WMJSXMLParser.js \
--js ../webmapjs/WMJSCanvasBuffer.js \
--js ../webmapjs/WMJSTimeSelector.js \
--js ../webmapjs/WMJS_GFITimeElevation.js \
--js ../webmapjs/WMJSAnimate.js \
--js ../webmapjs/WMJSDialog.js \
--js_output_file  WMJS.min.js


rm -rf jquery-addons.min.js
java -jar ../../closure/compiler.jar --language_in=ECMASCRIPT6 --language_out ES5_STRICT \
--js ../jquery/jquery.mousewheel.js \
--js ../jquery/jquery-ui-timepicker-addon.js \
--js ../jquery/globalize.js \
--js_output_file jquery-addons.min.js

rm -rf adagucwebmapjs
mkdir  adagucwebmapjs
echo "" > adagucwebmapjs/webmapjs.min.js
cat ../I18n/lang.en.js >> adagucwebmapjs/webmapjs.min.js
cat ../proj4js/lib/proj4js.js >> adagucwebmapjs/webmapjs.min.js
cat ../proj4js/lib/projCode/stere.js >> adagucwebmapjs/webmapjs.min.js
cat ../proj4js/lib/projCode/merc.js >> adagucwebmapjs/webmapjs.min.js
cat ../jquery/hammer.min.js >> adagucwebmapjs/webmapjs.min.js
cat ../jquery/jquery-1.12.4.min.js >> adagucwebmapjs/webmapjs.min.js
cat ../jquery/jquery-ui.min.js >> adagucwebmapjs/webmapjs.min.js
cat jquery-addons.min.js >> adagucwebmapjs/webmapjs.min.js
cat ../d3/d3.v3.min.js >> adagucwebmapjs/webmapjs.min.js
cat ../d3/c3.min.js >> adagucwebmapjs/webmapjs.min.js
cat WMJS.min.js >> adagucwebmapjs/webmapjs.min.js
cat ../moment/moment.min.js >> adagucwebmapjs/webmapjs.min.js


echo "" > adagucwebmapjs/webmapjs.min.css
cat ../webmapjs/WMJSStyles.css >> adagucwebmapjs/webmapjs.min.css
cat ../webmapjs/WMJS_GFITimeElevation.css >> adagucwebmapjs/webmapjs.min.css
cat ../webmapjs/WMJSTimeSelector.css >> adagucwebmapjs/webmapjs.min.css

cp -r ../webmapjs/php ./adagucwebmapjs/
cp -r ../webmapjs/img ./adagucwebmapjs/

rm WMJSExt.min.js
java -jar ../../closure/compiler.jar --language_in=ECMASCRIPT6 --language_out ES5_STRICT \
--js ../apps/appframework.js \
--js ../webmapjsext/WMJSExt/LayerPropertiesPanel.js \
--js ../webmapjsext/WMJSExt/StylePanel.js \
--js ../webmapjsext/WMJSExt/DimensionPanel.js \
--js ../webmapjsext/WMJSExt/MapPanel.js \
--js ../webmapjsext/WMJSExt/ServicePanel.js \
--js ../webmapjsext/WMJSExt/ServicePanelManager.js \
--js ../webmapjsext/WMJSExt/LayerPanel.js \
--js ../webmapjsext/WMJSExt/DataPanel.js \
--js ../webmapjsext/WMJSExt/BaseMapSelector.js \
--js ../webmapjsext/WMJSExt/MapTypeSelector.js \
--js ../webmapjsext/WMJSExt/AnimationPanel.js \
--js ../webmapjsext/WMJSExt/PermaLinkPanel.js \
--js ../webmapjsext/WMJSExt/UxDateTimeForm.js \
--js ../webmapjsext/WMJSExt/CheckColumn.js \
--js ../webmapjsext/WMJSExt/IFramePanel.js \
--js ../webmapjsext/WMJSExt/WCSPanel.js \
--js ../webmapjsext/WMJSExt/WindowFader.js \
--js ../webmapjsext/WMJSExtMain.js \
--js ../apps/gfiapp_d3c3.js \
--js ../apps/gfiapp_point_interest.js \
--js ../apps/gfiapp_eprofile.js \
--js ../apps/autowms_app.js \
--js_output_file  WMJSExt.min.js

echo "" > adagucviewer.min.js
cat ../jquery/hammer.min.js >> adagucviewer.min.js
cat ../jquery/jquery-1.12.4.min.js >> adagucviewer.min.js
cat ../jquery/jquery-ui.min.js >> adagucviewer.min.js
cat jquery-addons.min.js >> adagucviewer.min.js
cat ../d3/d3.v3.min.js >> adagucviewer.min.js
cat ../d3/c3.min.js >> adagucviewer.min.js
cat ../extjs-4.2.1/ext-all.js >> adagucviewer.min.js
cat WMJS.min.js >> adagucviewer.min.js
cat WMJSExt.min.js >> adagucviewer.min.js

# rm WMJS.min.js
# rm WMJSExt.min.js
# rm jquery-addons.min.js




