    
    //Constructor for custom webmapjs panel
    Ext.define('webmapjsext.WMJSExt.MapPanel', {
    extend   : 'Ext.panel.Panel',
    alias    : 'WMJSExtMapPanel',
      initComponent: function() {
        var _this = this; 
        _this.webmapjsid=_this.id+"wmjs";
        _this.pointinfobutton=_this.id+"pib";
        _this.baseLayer = undefined;
        Ext.apply(this, {
          html:'<div id="'+_this.webmapjsid+'"/>',
          layout:'fit',
          frame:false,border:false,margin:0,
          /*tbar:[
            {scale:'medium',iconCls:'button_zoomfullextent',tooltip:'Zoom to the extent of the current active layer',handler:function(){_this.webMapJS.zoomToLayer()}},
            {scale:'medium',enableToggle:true,toggleGroup:'toolBar1',iconCls:'button_zoomin',tooltip:'Zoom in by pulling a box over the map',handler:function(){_this.webMapJS.setMapModeZoomBoxIn();}},
            {scale:'medium',enableToggle:true,toggleGroup:'toolBar1',iconCls:'button_zoomout',tooltip:'Zoom out by clicking on the map',handler:function(e){_this.webMapJS.setMapModeZoomOut();_this.webMapJS.zoomOut();}},
            {scale:'medium',enableToggle:true,toggleGroup:'toolBar1',iconCls:'button_pan',tooltip:'Pan the map by clicking and dragging',handler:function(e){_this.webMapJS.setMapModePan();}},
            {scale:'medium',enableToggle:true,toggleGroup:'toolBar1',iconCls:'button_getfeatureinfo',tooltip:'Obtain information for a specific location on the map',handler:function(e){_this.webMapJS.setMapModeNone();_this.webMapJS.setMapModeGetInfo();}},
            {scale:'medium',disabled: true,enableToggle:true,toggleGroup:'toolBar1',iconCls:'button_getfeatureinfo',tooltip:'Open single point on map graphing',id:  _this.pointinfobutton,handler:function(e){_this.webMapJS.setMapModeNone();_this.webMapJS.setMapModePoint();}}
          ],*/
          listeners:{
            afterlayout:{
              fn:function(){
                if(!_this.webMapJS){
                  initWMJS();
                  _this.webMapJS = new WMJSMap(Ext.fly(_this.webmapjsid).dom);
                  _this.webMapJS.setWMJSTileRendererTileSettings(WMJSTileRendererTileSettings);
                  _this.webMapJS.setBaseURL('./webmapjs/');
                  _this.webMapJS.requestProxy = './webmapjs_php/MakeRequest.php?'
                  var baseLayers = [];
                  for(var j=0;j<baseLayerConfiguration.length;j++){
                    var a = new WMJSLayer(baseLayerConfiguration[j]); 
                    if(j==0){
                      var a = new WMJSLayer(baseLayerConfiguration[j]); 
                      _this.baseLayer = a;
                      baseLayers.push(a);
                      var b = new WMJSLayer(baseLayerConfiguration[j]); 
                      b.enabled = false;
                      baseLayers.push(b);
                    }else{
                      var a = new WMJSLayer(baseLayerConfiguration[j]); 
                      baseLayers.push(a);
                    }
                  }
                  _this.webMapJS.setBaseLayers(baseLayers);
                  
                  var size=_this.getSize();
                  _this.webMapJS.setSize(size.width,size.height);
                  _this.webMapJS.setProjection(defaultProjection);
                  _this.webMapJS.draw("resize event");
                  
                }
              }
            },
            resize:{
              fn:function(a,w,h){
                if(isDefined(_this.webMapJS)){
                  var size=_this.getSize();
                  _this.webMapJS.setSize(size.width,size.height);
                  _this.webMapJS.draw("resize event");
                }
              }
            }
            
          }
        });
        this.superclass.initComponent.apply(this, arguments);
      }
    });
