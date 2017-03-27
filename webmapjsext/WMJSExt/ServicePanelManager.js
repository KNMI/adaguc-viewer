var webmapjsext_WMJSExt_ServicePanels = [];

Ext.define('webmapjsext.WMJSExt.ServicePanelManager', {
   extend   : 'Ext.panel.Panel',
  alias    : 'WMJSExtServicePanelManager',
  requires:['webmapjsext.WMJSExt.ServicePanel'],
  initComponent: function() {
    //console.log("A");
    var _this = this;
    
    _this.getServicePanel = function(service,layerpanel){
      for(var j=0;j<webmapjsext_WMJSExt_ServicePanels.length;j++){
        //console.log(webmapjsext_WMJSExt_ServicePanels[j].service);
        if(webmapjsext_WMJSExt_ServicePanels[j].service == service){
          webmapjsext_WMJSExt_ServicePanels[j].layerpanel = layerpanel;
          return webmapjsext_WMJSExt_ServicePanels[j].window;
        }
      }
      
      var servicePanelObject = [];
      webmapjsext_WMJSExt_ServicePanels.push(servicePanelObject);

      servicePanelObject.layerpanel = layerpanel; // The parent panel
      servicePanelObject.service = service; // The corresponding service
      
      servicePanelObject.servicePanel= Ext.create('webmapjsext.WMJSExt.ServicePanel',{
        header:false,
        constrain:true,
        autoDestroy:false,
        height:400,
        service:servicePanelObject.layerpanel.WMJSLayer.service,
        name:servicePanelObject.layerpanel.WMJSLayer.name,
        border:0,
        itemclick:function(t,id){
          servicePanelObject.layerpanel.setLayer(id);
        }
      });
      
      servicePanelObject.window  =  Ext.create('webmapjsext.WMJSExt.WindowFader',{
        title: I18n.layers.text,
        autoDestroy:false,closeAction:'hide',autoScroll:true,floating:true,animate:true,    constrain:true,
        width:500,  
        

        items:[servicePanelObject.servicePanel],
        bbar:[
        {iconCls:'button_refresh',handler:function(){servicePanelObject.window.refresh();}},
        {
          text: I18n.embed.text,
          tooltip:'Embed layer view',
          handler:function(){
            servicePanelObject.window.hide();
            
            //if(_this.getComponent(3) == undefined){
              servicePanelObject.layerpanel.add(
                Ext.create('webmapjsext.WMJSExt.ServicePanel',{
                title: I18n.layers.text,
                header:true,collapsible:true,
                service:servicePanelObject.layerpanel.WMJSLayer.service,
                name:servicePanelObject.layerpanel.WMJSLayer.name,
                border:2,
                itemclick:function(t,layername,service){
                servicePanelObject.layerpanel.setLayer(layername,service);
                }
                }
              ))
            //}    
          }
        },{
          scale:'small',tooltip: I18n.add_new_layer.tooltip,iconCls:'layer_logos button_layerlist_layernew',
          handler:function(){
            var t = Ext.create('webmapjsext.WMJSExt.DataPanel',{
              dataPanelClicked:function(node){
              servicePanelObject.layerpanel.service = node.service;
              servicePanelObject.layerpanel.name = node.layer;
              servicePanelObject.layerpanel.WMJSLayer.service=servicePanelObject.layerpanel.service;
              servicePanelObject.layerpanel.WMJSLayer.name=servicePanelObject.layerpanel.name;
              
              var afterlayerready = function(layer,webmapjs){
                if(isDefined(node.ready)){
                  node.ready(layerpanel,servicePanelObject.layerpanel.parentWebMapJS);
                }
                
              }
              servicePanelObject.layerpanel.parseLayer (true,afterlayerready );
              
              
              return layerpanel;
            },
              webMapJS:servicePanelObject.layerpanel.parentWebMapJS
            });
            t.show();
          }
        }/*,{
          scale:'small',tooltip:'Add new layer',iconCls:'layer_logos button_layerlist_layernew',handler:function(){
            //addData(dataPanelClicked,mainWebmapJS);
              //createNewLayerPanel(_this.parentWebMapJS);
            var dataPanelClicked = function(node){
              var service = node.get('service');
              var name = node.get('layer');
              _this.WMJSLayer.service=service;
              _this.WMJSLayer.name=name;
              _this.parseLayer (true);
            }
            addData(dataPanelClicked,_this.parentWebMapJS)
          }
        }*/
        ]
      });
   
      servicePanelObject.window.refresh = function(){
        servicePanelObject.servicePanel.buildTreeFromNodes(true);
      };
     
      //console.log("Return new panel");
      return servicePanelObject.window ;

    
      
    };
  }
});
  