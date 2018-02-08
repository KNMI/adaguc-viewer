var versionInfo = 'ADAGUC viewer version 3.0.4.';
var mainWebmapJS;

function decimalFormatter(input,width){
  //print decimal with fixed length (preceding zero's)
  var string=parseInt(input)+'';
  var len = parseInt(width)-string.length;
  var j,zeros='';
  for(j=0;j<len;j++)zeros+="0";
  string=zeros+string;
  return string;
}

var myUTCDateParser = function(dateString,strict){
  var date = parseISO8601DateToDate(dateString+"T00:00:00Z");
  date.add(parseISO8601IntervalToDateInterval("P0D"));
  return date;
};

var myUTCDateFormatter = function(){
  var date = this;
  if(date == undefined)return undefined;

  var iso=decimalFormatter(date.getFullYear(),4)+
      "-"+decimalFormatter(date.getMonth()+1,2)+
      "-"+decimalFormatter(date.getDate(),2);
      return iso;
};

var myUTCTimeFormatter = function(){
  var date = this;
  if(date == undefined)return undefined;

  var iso=decimalFormatter(this.getUTCHours(),2)+
          ":"+decimalFormatter(this.getUTCMinutes(),2)+
          ":"+decimalFormatter(this.getUTCSeconds(),2);
  return iso;
};

var myUTCTimeParser = function(timeString,strict){
  var date = parseISO8601DateToDate("2000-01-01T"+timeString+"Z");
  return date;
};

Ext.Date.formatFunctions['Y-m-d UTC'] = myUTCDateFormatter;
Ext.Date.parseFunctions ['Y-m-d UTC'] = myUTCDateParser;
Ext.Date.formatFunctions['H:i:s UTC'] = myUTCTimeFormatter;
Ext.Date.parseFunctions ['H:i:s UTC'] = myUTCTimeParser;

Ext.state.Manager.setProvider(new Ext.state.CookieProvider({
  expires: new Date(new Date().getTime()+(1000*60*60*24*7))
}));
  
var firstTimeOpening = false;

var clearLayers = function(webMapJS){
  var llp = Ext.getCmp('layerlistpanel');
  llp.removeAll();
  webMapJS.removeAllLayers();
};

var updateLayers = function() {
  var llp = Ext.getCmp('layerlistpanel');
  var items=llp.items;
  for (var i=0; i<items.getCount(); i++) {
    items.get(i).parseLayer(true); 
  }
};

var getLayerObjects = function() {
  var layerObjects = [];
  var llp = Ext.getCmp('layerlistpanel');
  var items=llp.items;
  for (var i=0; i<items.getCount(); i++) {
    layerObjects.push(items.get(i));
  }
  return layerObjects;
};

var getSelectedLayer = function(){
  var layerObjects = getLayerObjects();
  for (var i=0; i<layerObjects.length; i++) {
    if(layerObjects[i].selected == true){
      return layerObjects[i];
    }
  }
  return undefined;
};

var removeLayer = function(){
  var layerObjects = getLayerObjects();
  var lastIndex = -2;
  for (var i=0; i<layerObjects.length; i++) {
    if(layerObjects[i].selected == true){
      lastIndex=i-1;
      layerObjects[i].close();
      break;
    }
  }
  layerObjects = getLayerObjects();
  if(layerObjects.length>0){
    if(lastIndex != -2){
      if(lastIndex<0)lastIndex = 0;
      if(lastIndex>layerObjects.length-1)lastIndex = layerObjects.length-1;
      layerObjects[lastIndex].select();
    }
  }
};

var createNewLayerPanel = function(webMapJS,config){
 
  if(isDefined(config)==false){
    config = [];
  }
  var servicename = undefined;if(isDefined(config.service))servicename=config.service;
  var layername = undefined;if(isDefined(config.name))layername=config.name;
  var style = undefined;if(isDefined(config.style))style=config.style;
  
 
  
  var opacity = undefined;if(isDefined(config.opacity)){if((''+config.opacity).length>0)opacity=config.opacity;}
  var enabled = undefined;if(isDefined(config.enabled))enabled=config.enabled;
  var autoChooseLayer = undefined;if(isDefined(config.autoChooseLayer))autoChooseLayer=config.autoChooseLayer;
  

  if(!isDefined(enabled)){
    enabled = true;
  }

  var llp = Ext.getCmp('layerlistpanel');
  llp.removeLayer = removeLayer;
  var t = Ext.create('webmapjsext.WMJSExt.LayerPanel',{
    parentPanelList:llp,
    title:layername,
    service:servicename,
    name:layername,
    style:style,
    opacity:opacity,
    enabled:enabled,
    autoChooseLayer:autoChooseLayer,
    parentWebMapJS:webMapJS,
    afterlayerready:function(layerPanel){

      if(layerPanel.layerAddedToWebMapJS != true){
        layerPanel.WMJSLayer.enabled = this.enabled;
        layerPanel.layerAddedToWebMapJS = true;
      }
      if(config.ready){
        config.ready(layerPanel,webMapJS);
        config.ready = undefined;
      }else{
        if(config.zoomtolayer == true){
          config.zoomtolayer = false;
          webMapJS.setProjection(layerPanel.WMJSLayer.getProjection("EPSG:4326"));  
        }
        //alert(173);
        webMapJS.draw("createNewLayerPanel");
        
        if(config.notifyadded == true){ 
          config.notifyadded = false;
          // alert(layerPanel.WMJSLayer.name+' added.');
        }
      }
    }
  });
  t.WMJSLayer.enabled=false;
  webMapJS.addLayer(t.WMJSLayer);
  llp.insert(0,t);
  t.select();
  return t;
};

var timeselectorWindow = Ext.create("Ext.window.Window",{
  title: "Time selection",
  width:310,
  height:150+21*22+12,
  constrain:true,
  autoDestroy:false,
  collapsible:true,
  frame:false,plain:true,border:false,
  closeAction:'hide',
  html:"<div class='timeselector'/>",
  listeners:{
    afterrender:{
      fn:function(t){
        var wmjstimecallback = function(value){
          mainWebmapJS.webMapJS.setDimension("time",value);
          mainWebmapJS.webMapJS.draw('timeselectorWindow');
        };
        var timeselector = new WMJSTimeSelector($(this.getEl().dom).find(".timeselector"),wmjstimecallback);
        mainWebmapJS.webMapJS.addListener("onmapdimupdate",function(){timeselector.dimensionUpdate(mainWebmapJS.webMapJS);},true);
        mainWebmapJS.webMapJS.addListener("ondimchange",function(){timeselector.dimensionChange(mainWebmapJS.webMapJS);},true);
        mainWebmapJS.webMapJS.addListener("onimageload",function(){timeselector.loadingComplete(mainWebmapJS.webMapJS);},true);
        timeselector.dimensionUpdate(mainWebmapJS.webMapJS);
      }
    },
    show:{
      fn:function(){
        mainWebmapJS.webMapJS.stopAnimating();
      }
    }
    
  }
});

var timeselectorPanel = Ext.create("Ext.panel.Panel",{
  iconCls:'button_time32',
  title:' ',
  bodyCls:'layerlistbg',
  autoDestroy:false,
  collapsible:false,
  frame:false,plain:true,border:false,
  closeAction:'hide',
  html:"<div class='timeselector layerlistbg'/>",
  listeners:{
    afterrender:{
      fn:function(t){
        var wmjstimecallback = function(value){
          mainWebmapJS.webMapJS.setDimension("time",value);
          mainWebmapJS.webMapJS.draw('timeselectorPanel');
        };
        var timeselector = new WMJSTimeSelector($(this.getEl().dom).find(".timeselector"),wmjstimecallback);
        mainWebmapJS.webMapJS.addListener("onmapdimupdate",function(){timeselector.dimensionUpdate(mainWebmapJS.webMapJS);},true);
        mainWebmapJS.webMapJS.addListener("ondimchange",function(){timeselector.dimensionChange(mainWebmapJS.webMapJS);},true);
        mainWebmapJS.webMapJS.addListener("onimageload",function(){timeselector.loadingComplete(mainWebmapJS.webMapJS);},true);
        timeselector.dimensionUpdate(mainWebmapJS.webMapJS);
      }
    },
    show:{
      fn:function(){
        mainWebmapJS.webMapJS.stopAnimating();
      }
    }
    
  }
});



//Ext OnReady
Ext.onReady(function(){
  base = './webmapjs';

  
  // var scaleBarURL        = "http://webgis.nmdc.eu/viewer2.0/webmapjs/php/makeScaleBar.php?";
// var requestProxy       = "webmapjs/php/MakeRequest.php?";
// var xml2jsonrequestURL = "webmapjs/php/xml2jsonrequest.php?"

  //FOR JSP:
  /*xml2jsonrequestURL = "/impactportal/AdagucViewer?SERVICE=XML2JSON&";
  requestProxy = "/impactportal/AdagucViewer?SERVICE=PROXY&";*/
  //scaleBarURL = "http://webgis.nmdc.eu/viewer2.0/webmapjs/php/makeScaleBar.php?";
    
  Ext.tip.QuickTipManager.init();
  
  mainWebmapJS = Ext.create('webmapjsext.WMJSExt.MapPanel',{
      region: 'center',border:true
  });
    

  var ISO_8601_re = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d{3}))?(Z|[\+-]\d{2}(?::\d{2})?)$/;
  var startDate = Ext.create('Ext.form.field.Text',{
    value:'1000-01-01T00:00:00Z',
    regex:ISO_8601_re,
    regexText:'Format should be YYYY-MM-DDThh:mm:ssZ'
  });
  var stopDate = Ext.create('Ext.form.field.Text',{value:'3000-01-01T00:00:00Z',
    regex:ISO_8601_re,
    regexText:'Format should be YYYY-MM-DDThh:mm:ssZ'
  });
    
  var mouseDownX = 0;
  var mouseDownY = 0;
  

  
  var eastPanelGFI = Ext.create('Ext.panel.Panel',{
    region:'east',
    collapsible:true,
    closable:true,
    //src: "apps/gfiapp.html",
    split:true,header:false,
    hidden:true,
    width:600,
    autoScroll:false,
    layout:'fit',
    title:'test',
    
    tbar:[
      
      {xtype:'label',text:'App',scale:'large'},
      {xtype:'tbfill',scale:'large'},  
      {xtype:'tool',scale:'large',type:'close',handler:function(){
        eastPanelGFI.hide();mainWebmapJS.webMapJS.enableInlineGetFeatureInfo(true);
        
        mainWebmapJS.webMapJS.removeListener('mouseclicked');
      }}
    ],
    listeners:{
      show:{
        fn:function(){
          eastPanelGFI.update("<div id=\"webmapjs_customapplication\" class=\"webmapjs_customapplication\"></div>")
          
          var APP = WMJSExtApplications[eastPanelGFI.applicationSettings.name];
          if(!APP){
            alert("Application with name "+eastPanelGFI.applicationSettings.name+" not registered");
            return;
          }
          eastPanelGFI.applicationSettings.app = new APP($("#webmapjs_customapplication"),mainWebmapJS.webMapJS);
          eastPanelGFI.applicationSettings.app.enable(eastPanelGFI.width,mainWebmapJS.webMapJS.getHeight()-24);
        }
      },hide:{
        fn:function(){
          if(eastPanelGFI.applicationSettings.app ){
            eastPanelGFI.applicationSettings.app.disable();
            eastPanelGFI.applicationSettings.app = undefined;
          }
        }
      },resize:{
        fn:function(){
          if(eastPanelGFI.applicationSettings.app ){
            eastPanelGFI.applicationSettings.app.resize(eastPanelGFI.width,mainWebmapJS.webMapJS.getHeight());
          }
        }
      }
      
      
    },
    setApplication: function(applicationSettings){
      eastPanelGFI.applicationSettings = applicationSettings;
      
      
    }
  });
  
  
  
  
  var contentPanel1 = Ext.create('Ext.panel.Panel',{
      region: 'center',layout:'border',
      split:true,frame:false,border:false,margin:0,
      items:[mainWebmapJS,eastPanelGFI]
  });
  
  var dataPanelClicked = function(node){
   
    
    var panel = createNewLayerPanel(mainWebmapJS.webMapJS,{
      service:node.service,
      name:node.layer,
      style:node.style,
      opacity:node.opacity,
      ready:function(layer,webmapjs){
        var srs=node.srs;
        var bbox=node.bbox;
        var baselayername=node.baselayername;
        var baselayerservice=node.baselayerservice;
        
        if(srs&&!bbox){
          webmapjs.setProjection(layer.getProjection(srs));
        }else if(srs&&bbox){
          webmapjs.setProjection({srs:srs,bbox:bbox});
        }
        
        if(baselayername&&baselayerservice){
          mainWebmapJS.baseLayer.setService(baselayerservice);
          mainWebmapJS.baseLayer.name=baselayername;
          
          //alert(97);
          mainWebmapJS.baseLayer.parseLayer(function(){webmapjs.draw("dataPanelClicked::parseLayer");},undefined,"WMJSExtMain::dataPanelClicked");
        }else{
        //alert(100);
          webmapjs.draw("dataPanelClicked");
        }
        
        if(isDefined(panel)){
          if(isDefined(node.ready)){

            node.ready(panel,webmapjs);
            if(panel.WMJSLayer.hasError == true){
              panel.close();
            }
          }
        }
      }
    });
    return panel;
  };
  
  var maptypeclicked = function(node){
    mainWebmapJS.webMapJS.setProjection({bbox:node.get('bbox'),srs:node.get('srs')});  
    var bs = node.get('baselayer');
    if(bs){
      if(bs.service&&bs.name){
        bs.enabled = true;
        mainWebmapJS.baseLayer.setService(bs.service);
        mainWebmapJS.baseLayer.name=bs.name;
        mainWebmapJS.baseLayer.enabled=true;
        if(isDefined(bs.transparent)){
          mainWebmapJS.baseLayer.transparent=bs.transparent;
        }
        //alert(114);
        mainWebmapJS.baseLayer.parseLayer(function(){mainWebmapJS.webMapJS.draw("maptypeclicked");},undefined,"WMJSExtMain::maptypeclicked");
      }
    }
    
    //alert(119);
    //mainWebmapJS.webMapJS.draw("maptypeclicked");
  }
  



  
  var showAnimationWindow = function(webmapJS){
    var animationWindow;
    //if(!isDefined(animationWindow))
    {
      animationWindow = Ext.create('Ext.window.Window',{
        title: I18n.create_animation.text,
        width:460,height:300,layout:'form',autoDestroy:true,closeAction:'destroy',autoScroll:true,collapsible:true,
        items:[Ext.create('webmapjsext.WMJSExt.AnimationPanel',{mappanel:mainWebmapJS})]          
      });
    }
    animationWindow.show();
  };
  var permaLinkWindow;
  var showPermaLinkWindow = function(webmapJS){
      permaLinkWindow = Ext.create('Ext.window.Window',{
        title: I18n.create_permanent_links.text,
        width:800,height:260,layout:'fit',autoDestroy:true,closeAction:'destroy',autoScroll:true,modal:false,
        items:[Ext.create('webmapjsext.WMJSExt.PermaLinkPanel',{mappanel:mainWebmapJS})]          
      });
    permaLinkWindow.show();
  };
  
  var debugWindow;
  var myConsole = new Console();
  debug = myConsole.println;
  error= myConsole.errprintln;
  
  var debugPanel = Ext.create('Ext.panel.Panel',{
    html:'<div id="debuginfodiv"></div>',
    layout:'fit',
    listeners:{
      afterrender:{
        fn:function(){
          myConsole.setElement(document.getElementById('debuginfodiv'));
        }
      }
    }
  });
          
  var showDebugWindow = function(webmapJS){
    if(!isDefined(debugWindow)){
      debugWindow = Ext.create('Ext.window.Window',{
        title:'Debug info',
        width:800,height:260,layout:'fit',autoDestroy:true,closeAction:'hide',autoScroll:true,modal:false,
        items:[debugPanel]
        });
    }
    debugWindow.show();
  };
  
  
  var mainOptionMenuItems = [
    {
      text: I18n.show_time_selection_window.text,iconCls:'button_settings_icon',handler:function(){timeselectorWindow.show();}
    },
    {
      text: I18n.create_animation.text + '&hellip;',iconCls:'button_settings_icon',handler:function(){showAnimationWindow(maptypeclicked);}
    },{
    text: I18n.create_link.text,iconCls:'button_makeLink',handler:function(){showPermaLinkWindow(maptypeclicked);}
    },/*{
      text:'Timeseries mode',iconCls:'button_getfeatureinfo',handler:function(){eastPanelGFI.show();}
    },*/{
      text: I18n.show_debug_information.text,
      iconCls:'button_console_icon',
      handler:function(){
        showDebugWindow();
      }
    },{
      text: I18n.add_custom_wms_service.text,
      iconCls:'button_layerlist_layernew',
      handler:function(){
        var t = Ext.create('webmapjsext.WMJSExt.DataPanel',{
              dataPanelClicked:dataPanelClicked,
              webMapJS:mainWebmapJS.webMapJS
            });
            t.showCustomWMSWindow();
      }
    },{
      text: I18n.undo_zoom_pan_action.text,
      iconCls:'button_undo',
      handler:function(){
        mainWebmapJS.webMapJS.setPreviousExtent();
      }
    },{
      text: I18n.redo_zoom_pan_action.text,
      iconCls:'button_redo',
      handler:function(){
        mainWebmapJS.webMapJS.setNextExtent();
      }
    },{
      text: I18n.abort_loading.text,
      iconCls:'button_stoploading',
      handler:function(){
        mainWebmapJS.webMapJS.abort();
      }
    }
  ];

  try{
    if(isDefined(getFeatureInfoApplications)){};
  }catch(e){
    getFeatureInfoApplications = [];
  }
  
  for(var j=0;j<getFeatureInfoApplications.length;j++){
    var location = getFeatureInfoApplications[j];
    mainOptionMenuItems.push({
      text:getFeatureInfoApplications[j].name,iconCls:getFeatureInfoApplications[j].iconCls,location:location,handler:function(){eastPanelGFI.setApplication(this.location);eastPanelGFI.show();}
    });
  }
  
  mainOptionMenuItems.push({
    text: I18n.about_the_adaguc_viewer.text,
    iconCls:'button_info',
    tooltip: I18n.about_the_adaguc_viewer.tooltip,
    handler:function(){
      Ext.create('Ext.window.Window', {
        title: I18n.about_adaguc.text,
        height: 200,
        width: 400,
        modal:true,
        layout: 'fit',
        items: {  // Let's put an empty grid in just to illustrate fit layout
            xtype: 'panel',
            html:'<div class="about_adaguc" style="position:absolute;top:0px;left:0px;height:100px;width:520px;"/><div style="position:absolute;top:100px;padding:10px;margin:10px;">'+versionInfo+I18n.about_adaguc_more_information.text           
            
        }
      }).show();
    }
  });
  

  
  var layerlistpanel =  Ext.create('Ext.panel.Panel',{
    header:false,title:' ',frame:false,border:0,split:false,id:'layerlistpanel',  tooltip: I18n.layers.tooltip,
    overflowY: 'auto',
    //bodyStyle:{"background-color":"#D8E0F0"},
    //bodyStyle:{"background-color":"#a8b8c8"},
    bodyCls:'layerlistbg',
    iconCls:'button_layers32',

    bbar:[{
      scale:'small',tooltip:I18n.add_new_layer.tooltip,iconCls:'layer_logos button_layerlist_layernew',handler:function(){
        //addData(dataPanelClicked,mainWebmapJS.WebMapJS);
          createNewLayerPanel(mainWebmapJS.webMapJS,{
            service:""
        });
      }
    },{
        iconCls:'button_duplicate',tooltip: I18n.clone_this_layer.tooltip,
        handler:function(){
          var layer = getSelectedLayer();
          if(isDefined(layer)){
            layer.duplicateLayer();
          }
        }
      },{
      xtype:'button',
      tooltip: I18n.remove_this_layer.tooltip,
      iconCls:'button_layerlist_layerdelete',
      handler:function(o,c){
        removeLayer();
      }
    },{
      xtype:'button',
      tooltip: I18n.move_layer_up.tooltip,
      iconCls:'button_layerlist_layerup',
      handler:function(o,c){
        var layer = getSelectedLayer();
        if(isDefined(layer)){
          layer.moveUp();
        }
      }
    },{
      xtype:'button',
      tooltip: I18n.move_layer_down.tooltip,
      iconCls:'button_layerlist_layerdown',
      handler:function(o,c){
                            var layer = getSelectedLayer();
        if(isDefined(layer)){
          layer.moveDown();
        }

      }
    },{xtype:'tbfill'},   
    {iconCls:'button_settings_icon',tooltip: I18n.settings_and_options.tooltip,
      menu:
        {
          xtype:'menu',items:mainOptionMenuItems
      }
    }
    ]  
  });
  
  var projectionchooserpanel = Ext.create('webmapjsext.WMJSExt.MapTypeSelector',{maptypeclicked:maptypeclicked,webmapjsext:mainWebmapJS});
  var basemapselectorpanel = Ext.create('webmapjsext.WMJSExt.BaseMapSelector',{webmapjsext:mainWebmapJS});
  var layersandmaps = {
    layout:'fit',
    border:false,
    autoScroll:false,
    region: 'center',
    xtype:'tabpanel',
    scale:'large',
    cls:'LayersAndMapsTab',
    items:[layerlistpanel,projectionchooserpanel,basemapselectorpanel,timeselectorPanel]
  };
  
  var viewportwestpanel =  {
        id:'viewportwestpanel',
        width:400,
        region: 'west',layout:'border',collapsible:true,animCollapse:false,border:true,split:true,header:false,autoScroll:false,
        frame:true,
        items:[layersandmaps],    tbar:[
          {scale:'large',text: I18n.add_layers.text,tooltip: I18n.add_layers.tooltip,iconCls:'button_adddata32',handler:function(){
            var t = Ext.create('webmapjsext.WMJSExt.DataPanel',{
              dataPanelClicked:dataPanelClicked,
              webMapJS:mainWebmapJS.webMapJS
            });
            t.show();
//                 t.setMapType(maptypeclicked,mainWebmapJS);
//                 addData(dataPanelClicked,mainWebmapJS.webMapJS);
            
          }},    {iconCls:'button_settings32',tooltip:I18n.settings_and_options.tooltip,scale:'large',
      menu:
        {
          xtype:'menu',items:mainOptionMenuItems
      }
    }]
      };

  var viewport = Ext.create('Ext.Viewport', {
    layout: 'border',
    
    items: [
     viewportwestpanel,contentPanel1],
    renderTo: Ext.getBody(),
    listeners:{
      resize:{
        fn:function(){
          //alert("a");
          try{
            var bottom = (viewportwestpanelwindow.y+viewportwestpanelwindow.height);
            if(bottom>viewport.height)
            {
              bottom = viewport.height-70;
              if(bottom<70)bottom = 70;
            }
            viewportwestpanelwindow.setSize(viewportwestpanelwindow.width,bottom);
          }catch(e){
          }
        }
        
      }
    }
  });
  
  //console.log(viewport);
  
//   var viewportwestpanelwindow = Ext.create('Ext.window.Window',{
//         //title:'Adaguc viewer',
//         width:300,height:viewport.height-70,layout:'fit',autoDestroy:true,closeAction:'destroy',autoScroll:false,collapsible:true,closable:false,constrainHeader:true,// collapseDirection: 'left',
//         items:[viewportwestpanel]          
//       });
//   viewportwestpanelwindow.showAt( 4,4);
  
  var createNewServicePanel = function(config){
    var service="";
    if(isDefined(config)){
      service=config.service;
    }
    var slp = Ext.getCmp('servicelistpanel');
    var t = Ext.create('webmapjs.WMJSExt.ServicePanel',{
      title:'WMS Service '+slp.items.length,
      collapsed:false,
      service:service
    });
    slp.add(t);
    t.expand();
  };
  
  
  var hashTagHasChanged = function(identifier,hashUrlVars){
    if(identifier.indexOf('addlayer(\'')>=0){
  
      var service = (identifier.substring(identifier.indexOf('addlayer(\'')+10,identifier.indexOf('\',')));
      var name = (identifier.substring(identifier.indexOf(',\'')+2,identifier.indexOf('\')')));
    //alert(service);
      //Goes wrong with difficult service names like "/testspatie/RAD+plus-min test.h5"
      //service = URLDecode(service);
      //name = URLDecode(name);
      
      if(service&&name){
        
        var layerAlreadyAdded = false;
        var layersAvailable = mainWebmapJS.webMapJS.getLayers();
        for(var j=0;j<layersAvailable.length;j++){
          ////alert(layersAvailable[j].service +" and "+service);
          if(layersAvailable[j].service == service&&layersAvailable[j].name == name){
            layerAlreadyAdded = true;
            break;
          }
        }
        if(layerAlreadyAdded == false){
          var notifyadded = true;
          if(isDefined(hashLocationNotfiyAddLayer)){
            notifyadded = hashLocationNotfiyAddLayer;
          }
//           if(notifyadded === true && firstTimeOpening === true){
//             alert("Adding "+name)
//           }
          firstTimeOpening = true;
          createNewLayerPanel(mainWebmapJS.webMapJS, {service:service,name:name,zoomtolayer:false,notifyadded:true});

        }else{
          //alert('Already added '+name);
        }
      }
      
    }else if(identifier.indexOf('positionmappinbylatlon(')>=0){
      debug(identifier);
      var coordString = (identifier.substring(23,identifier.indexOf(')')));
      debug(coordString);
      var coords=coordString.split(",");
      debug(coords[0]+" "+coords[1]);
      mainWebmapJS.webMapJS.positionMapPinByLatLon({x:parseFloat(coords[0]), y:parseFloat(coords[1])});
    }else if(identifier.indexOf('refreshlayers')>=0){
      updateLayers();
    }else{
      //Could a classic adaguc state be given with a hashtag instead of a ? sign?
      checkIfClassicADAGUCStateIsGiven(hashUrlVars);
      //getUrlVarsFromHashTag
    }
  };
  
  var checkIfClassicADAGUCStateIsGiven = function(urlVars){
      
    var zoomToLayer = false;
    
    var autoChooseLayer = false;
    if(isDefined(urlVars.collapse)){if(urlVars.collapse=="1"){Ext.getCmp('viewportwestpanel').collapse();}}
    
    if(isDefined(urlVars.zoomtolayer)){if(urlVars.zoomtolayer=="1"){zoomToLayer=true;}}

    
    if(isDefined(urlVars.srs)&&isDefined(urlVars.bbox)){
      
      mainWebmapJS.webMapJS.setProjection({srs:urlVars.srs,bbox:urlVars.bbox});
    }
      
    
    if(isDefined(urlVars.service)){
      
        
      clearLayers(mainWebmapJS.webMapJS);
      //Add layers
      var services=URLDecode(urlVars.service).split(',');
      
      var layers=''.split(',');
      if(isDefined(urlVars.layer)){
        layers=URLDecode(urlVars.layer).split(',');
      }else{
        if(zoomToLayer == true){
          //Auto detect layer
          autoChooseLayer = true;
          
        }
      }
      
      var selectedLayerNr = 0;
      if(isDefined(urlVars.selected)){
        selectedLayerNr = urlVars.selected;
      }
      
      
      var numLayers = layers.length;
      
      for(var j=0;j<layers.length;j++){
    
        try{
          var layerProps = layers[(layers.length-1)-j].split('$');
          
          var name    = layerProps + '';
          var format  = 'image/png';
          var enabled = true;
          var style   = '';
          var opacity = 1;
          var service = services[0] + '';
          
          if(layerProps.length==6){
            name    = layerProps[0];
            format  = layerProps[1];
            enabled = layerProps[2];
            style   = layerProps[3];
            opacity = layerProps[4];
            if(isDefined(enabled)){
              if(enabled === 'true'){enabled = true;}
              if(enabled === 'false'){enabled = false;}
            }
            service = services[layerProps[5]];
          }
          
          var readyFunction = function(layer,webMapJS){
            numLayers--;
          
            
            if(numLayers == 0){
              if(isDefined(urlVars.dims)){
                var dims = urlVars.dims.split(',');
                for(var j=0;j<dims.length;j++){
                  var dim = dims[j].split('$');
                  if(dim.length==2){
                    //layer.setDimension(dim[0],dim[1]);
                    mainWebmapJS.webMapJS.setDimension(dim[0],dim[1]);
                  }
                }
              }

              if(zoomToLayer == true){
                layer.WMJSLayer.zoomToLayer();
              }
              webMapJS.draw("index.html::numlayers=0");
              //alert(mainWebmapJS.webMapJS.getDimension("time").currentValue);
            }
          }
          
          
          var layerPanel = createNewLayerPanel(mainWebmapJS.webMapJS,{
            service:service,
            name:name,
            style:style,
            enabled:enabled,
            opacity:opacity,
            ready:readyFunction,
            autoChooseLayer:autoChooseLayer
          });
          // layerPanel.WMJSLayer.setDimension('time','2013-04-10T12:00:00Z');
          
        }catch(e){
          error('Unable to parse layer nr '+j);
        }
      }
      
    
      
      if(isDefined(urlVars.baselayers)){
       
      // alert(urlVars.baselayers);
        var baselayers = urlVars.baselayers.split('$');
        var newBaseLayerConfig = [];
        //Search for layer names in mapTypeConfiguration and baselayerconfig
        var nrOfFoundBaselayers = 0;
        for(var j=0;j<baselayers.length;j++){
          var found =false;
          for(var i=0;i<mapTypeConfiguration.length;i++){
//             try{
            if(mapTypeConfiguration[i].baselayer.name==baselayers[j]){
              mapTypeConfiguration[i].baselayer.enabled = true;
              newBaseLayerConfig.push(mapTypeConfiguration[i].baselayer);
              found=true;
              nrOfFoundBaselayers++;
              break;
            }
//             }catch(e){
//               //console.log(e);
//             }
          }
          if(!found){
            for(var i=0;i<baseLayerConfiguration.length;i++){
              if(baseLayerConfiguration[i].name==baselayers[j]){
                baseLayerConfiguration[i].enabled=true;
                newBaseLayerConfig.push(baseLayerConfiguration[i]);
                found=true;
                nrOfFoundBaselayers++;
                break;
              }
            }
          }
          if(!found){
            error("Warning: unable to find baselayer "+baselayers[j]);
          }
        }
        
        for(var j=0;j<baseLayerConfiguration.length;j++){
          if(baseLayerConfiguration[j].enabled==false)
          {
            newBaseLayerConfig.push(baseLayerConfiguration[j]);
          }else{
            if(nrOfFoundBaselayers==0){
              newBaseLayerConfig.push(baseLayerConfiguration[j]);
            }
          }
          
        }
        
        baseLayers = [];
        
        for(var j=0;j<newBaseLayerConfig.length;j++){
          var a = new WMJSLayer(newBaseLayerConfig[j]); 
          if(j==0)mainWebmapJS.baseLayer = a;
          baseLayers.push(a);
        }
        if(baseLayers.length>0){
          mainWebmapJS.webMapJS.setBaseLayers(baseLayers);
        }
        
      }
      
      
    }
    ////alert(dump(urlVars));
  };
  if(window.location.hash.length==0){
    checkIfClassicADAGUCStateIsGiven(getUrlVars());
  }
  
  checkIfHashTagChanged(hashTagHasChanged);
  //eastPanelGFI.show();
  
 //mainWebmapJS.webMapJS.showBoundingBox(new WMJSBBOX(-10,-10,10,10));
  
  //timeselectorWindow.show();
 
  
  
  
});
