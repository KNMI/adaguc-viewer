#!/bin/bash

# Use https://developers.google.com/closure/compiler/ to compile this code.
# Compiler should be available at ../../closure/compiler.jar relative to this build script.

rm -rf WMJS.min.js
java -jar ../../closure/compiler.jar --language_in=ECMASCRIPT6 --language_out ES5_STRICT --process_common_js_modules \
--module_resolution=NODE \
--js ../webmapjs_h/WMJSPolyfills.js \
--js ../webmapjs_h/WMJSProcessing.js \
--js ../webmapjs_h/WMJSTimeSelector.js \
--js ../webmapjs_h/WMJSTimeSlider.js \
--js ../webmapjs_h/WMJS_GFITimeElevation.js \
--js ../webmapjs_h/WMJSCoverage.js \
--js ../webmapjs/WMJSExternalDependencies.js \
--js ../webmapjs/WMJSConstants.js \
--js ../webmapjs/WMJSGlobals.js \
--js ../webmapjs/WMJSGetServiceFromStore.js \
--js ../webmapjs/I18n/lang.en.js \
--js ../webmapjs/WMJSTimer.js \
--js ../webmapjs/WMJSDebouncer.js \
--js ../webmapjs/WMJSAnimate.js \
--js ../webmapjs/WMJSTools.js \
--js ../webmapjs/WMJSLayer.js \
--js ../webmapjs/WMJSTime.js \
--js ../webmapjs/WMJSTileRenderer.js \
--js ../webmapjs/WMJSImageStore.js \
--js ../webmapjs/WMJSMap.js \
--js ../webmapjs/WMJSProjection.js \
--js ../webmapjs/WMJSBBOX.js \
--js ../webmapjs/WMJSDimension.js \
--js ../webmapjs/WMJSService.js \
--js ../webmapjs/WMJSListener.js \
--js ../webmapjs/WMJSImage.js \
--js ../webmapjs/WMJSXMLParser.js \
--js ../webmapjs/WMJSCanvasBuffer.js \
--js ../webmapjs/WMJSDialog.js \
--js ../webmapjs/WMJSDrawMarker.js \
--js ../webmapjs_h/WMJSDefineGlobals.js \
--js ../webmapjs_h/WMJSImportsToGlobal.js \
--create_source_map WMJS.min.js.map \
--js_output_file  WMJS.min.js
echo "//# sourceMappingURL=WMJS.min.js.map" >> WMJS.min.js


# 
# rm -rf jquery-addons.min.js
# java -jar ../../closure/compiler.jar --language_in=ECMASCRIPT6 --language_out ES5_STRICT \
# --js ../jquery/jquery.mousewheel.js \
# --js ../jquery/jquery-ui-timepicker-addon.js \
# --js ../jquery/globalize.js \
# --js_output_file jquery-addons.min.js
# 
rm -rf adagucwebmapjs
mkdir  adagucwebmapjs
echo "" > adagucwebmapjs/webmapjs.min.js
cat ../libs/d3/d3.v3.min.js >> adagucwebmapjs/webmapjs.min.js
cat ../libs/d3/c3.min.js >> adagucwebmapjs/webmapjs.min.js
cat ../libs/node_modules/moment/moment.js >> adagucwebmapjs/webmapjs.min.js
cat ../libs/node_modules/proj4/dist/proj4.js >> adagucwebmapjs/webmapjs.min.js
cat ../libs/node_modules/jquery/dist/jquery.min.js >> adagucwebmapjs/webmapjs.min.js
cat ../libs/node_modules/jquery-ui-dist/jquery-ui.min.js >> adagucwebmapjs/webmapjs.min.js
cat WMJS.min.js >> adagucwebmapjs/webmapjs.min.js
echo "" > adagucwebmapjs/webmapjs.min.css
cat ../webmapjs/WMJSStyles.css >> adagucwebmapjs/webmapjs.min.css
cat ../webmapjs_h/WMJS_GFITimeElevation.css >> adagucwebmapjs/webmapjs.min.css
cat ../webmapjs_h/WMJSTimeSelector.css >> adagucwebmapjs/webmapjs.min.css

rm -f WMJSExt.min.js
java -jar ../../closure/compiler.jar \
--create_source_map WMJSExt.min.js.map \
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

echo "//# sourceMappingURL=WMJSExt.min.js.map" >> WMJSExt.min.js

# echo "" > adagucviewer.min.js
# cat ../jquery/hammer.min.js >> adagucviewer.min.js
# cat ../jquery/jquery-1.12.4.min.js >> adagucviewer.min.js
# cat ../jquery/jquery-ui.min.js >> adagucviewer.min.js
# cat jquery-addons.min.js >> adagucviewer.min.js
# cat ../d3/d3.v3.min.js >> adagucviewer.min.js
# cat ../d3/c3.min.js >> adagucviewer.min.js
# cat ../extjs-4.2.1/ext-all.js >> adagucviewer.min.js

# rm WMJS.min.js
# rm WMJSExt.min.js
# rm jquery-addons.min.js




