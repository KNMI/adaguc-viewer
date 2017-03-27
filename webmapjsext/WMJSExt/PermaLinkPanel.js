
Ext.define('webmapjsext.WMJSExt.PermaLinkPanel',{
  extend:'Ext.panel.Panel', 
  alias:'WMJSExtPermaLinkPanel',
  initComponent: function() {
    var _this = this; 
    
    
var WMJSGetViewerLocation = function(){
  var currentLoc = location.href.split('?')[0];
  
  currentLoc = currentLoc.split('#')[0];
  
  if (currentLoc.indexOf("/index.html") != -1) {
    currentLoc = currentLoc.substring(0, currentLoc.indexOf("/index.html"));
    currentLoc += "/";
  }
  
  if (currentLoc.indexOf("/index.jsp") != -1) {
    currentLoc = currentLoc.substring(0, currentLoc.indexOf("/index.jsp"));
    currentLoc += "/";
  }
  if (currentLoc.indexOf("/index.php") != -1) {
    currentLoc = currentLoc.substring(0, currentLoc.indexOf("/index.php"));
    currentLoc += "/";
  }

  return currentLoc;
}

var WMJSMakePermaLink = function(webMapJS,wmjsLayer){
  //var webMapJS = ;
  var selId = 0;
  var isDateRefreshing = false;
  var isAnimating = false;
  var activeLayer = webMapJS.getActiveLayer();
  var mapLayers = webMapJS.getLayers();
  if(isDefined(wmjsLayer)){
    mapLayers = [];
    mapLayers.push(wmjsLayer);
  }
  var projection = webMapJS.getProjection();
  //alert(mapLayers);
  
  var url = "?";
  url += "srs=" + URLEncode(projection.srs);
  url += "&bbox=" + URLEncode(projection.bbox);
  
//       if (e == 'withbasetop') {
//         var baseLayers = webMapJS.getBaseLayers();
//         for ( var i = 0; i < baseLayers.length; i++) {
//           if (baseLayers[i].enabled)
//             mapLayers.unshift(baseLayers[i]);
//         }
//         // mapLayers.push(webMapJS.getBaseLayer());
//       }
  if (mapLayers.length > 0) {
    // make a more compact list of the services.
    var services = Array();
    var layers = Array();
    /*
      * services.push(mapLayers[0].service); layers.push(
      * mapLayers[0].name+"$"+ mapLayers[0].format+"$"+
      * mapLayers[0].enabled+"$"+ mapLayers[0].getStyle()+"$"+
      * mapLayers[0].opacity+"$"+ "0" );
      */
    
    var j = 0;
    var serviceIndex;
    for (j = 0; j < mapLayers.length; j++) {
      if (mapLayers[j].name && mapLayers[j].title != WMJSEmptyLayerName) {
        serviceIndex = services.indexOf(mapLayers[j].service);
        if (serviceIndex == -1) {
          services.push(mapLayers[j].service);
          serviceIndex = services.length - 1;
        }
        
        layers.push(mapLayers[j].name.replace(/,/g, ".") + "$" + mapLayers[j].format + "$" + mapLayers[j].enabled + "$" + mapLayers[j].getStyle() + "$" + mapLayers[j].opacity
            + "$" + (serviceIndex));
        if (activeLayer == mapLayers[j]) {
          selId = j;
        }
      }
    }
    var temp = URLEncode(services[0]);
    for ( var j = 1; j < services.length; j++)
      temp += "," + URLEncode(services[j]);
    url += "&service=" + temp;
    
    temp = URLEncode(layers[0]);
    for ( var j = 1; j < layers.length; j++)
      temp += "," + URLEncode(layers[j]);
    url += "&layer=" + temp;
    url += "&selected=" + selId;
    // Dimensions
    var dims = webMapJS.getDimensionList();
    if(isDefined(wmjsLayer)){
      dims = wmjsLayer.dimensions;
    }
    if (dims.length > 0) {
      url += "&dims=";// +dims[0].name+"$"+dims[0].currentValue;
      for (j = 0; j < dims.length; j++) {
        if(j>0)url+=',';
        url+= dims[j].name + '$' + dims[j].currentValue;
        
        /*
        var dim = dims[j];
        var panelType = getDimWindowPanelTypeForDim(dims[j]);
        
        for ( var i = 0; i < dimensionWindows.length; i++) {
          if (dimensionWindows[i].dimension.name == dim.name) {
            if (dimensionWindows[i].panelType == panelType) {
              var dimValue = dimensionWindows[i].getCurrentValue();
              if (isDateRefreshing) {
                if (panelType == 'Range' && dim.name == 'time')
                  dimValue = 'current';
              }
              if (j > 0 && j < dims.length)
                url += ",";
              url += dim.name + "$" + dimValue;
              
            }
          }
        }*/
      }
      
    }
  }
  if (webMapJS.isMapPinVisible() == true) {
    /*
      * var mapPinXY=webMapJS.getMapPinXY(); url+="&x="+mapPinXY[0];
      * url+="&y="+mapPinXY[1];
      */
  }
  if (isDateRefreshing) {
    url += "&refr=1";
  }
  if (isAnimating) {
    url += "&anim=1";
  }
  // Which baseLayer are we using?
  var baseLayers = webMapJS.getBaseLayers();
  var baseLayerName = '';
  for ( var i = 0; i < baseLayers.length; i++) {
    if (baseLayers[i].enabled) {
      if (baseLayerName.length > 0)
        baseLayerName += '$';
      baseLayerName += URLEncode(baseLayers[i].name);
    }
  }
  if (baseLayerName == '')
    baseLayerName = 'none';
  url += "&baselayers=" + baseLayerName;
  return url;
};

    
    Ext.apply(this, {
      //layout:'form',
      border:false,
      frame:true,
      layout:'fit',
      items:[{
        xtype:'panel',
        layout:'border',
        frame:true,
        border:false,
        
        items:[{frame:true,border:0,xtype:'panel',height:28,region:'north',html:'<h1>Paste the link below in an email or chat message</h1>'},
        {xtype:'displayfield',region:'center',itemId:'mainTextField'}]
        
      }],
        listeners:{
        afterrender:{
          fn:function(){
            var mainTextField = _this.getComponent(0).getComponent('mainTextField');
            var link = WMJSGetViewerLocation()+WMJSMakePermaLink(_this.mappanel.webMapJS);
            mainTextField.setValue('<a href="'+link+ '" target="_blank">' + link + ' </a>');
            //alert(_this.mappanel.webMapJS.getLayers().length);
           // loadLayers();
          }
        }
      }
    });
    webmapjsext.WMJSExt.PermaLinkPanel.superclass.initComponent.apply(this, arguments);
  
  }
});
