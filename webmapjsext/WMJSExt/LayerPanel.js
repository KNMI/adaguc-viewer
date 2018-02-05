//Constructor for custom layer panel

var webmapjsext_WMJSExt_LayerPanel_ServicePanelManager;

var getServicePanelManager = function(){
  if(!webmapjsext_WMJSExt_LayerPanel_ServicePanelManager){
    webmapjsext_WMJSExt_LayerPanel_ServicePanelManager = Ext.create('webmapjsext.WMJSExt.ServicePanelManager',{});
  }
  return webmapjsext_WMJSExt_LayerPanel_ServicePanelManager;
};

Ext.define('webmapjsext.WMJSExt.LayerPanel',{
  extend:'Ext.panel.Panel', 
  alias:'WMJSExtLayerPanel',
  requires:['webmapjsext.WMJSExt.DimensionPanel','webmapjsext.WMJSExt.StylePanel','webmapjsext.WMJSExt.LayerPropertiesPanel','Ext.form.field.Checkbox','Ext.form.Label','Ext.layout.container.Border','Ext.slider.Single','Ext.grid.Panel'],
  
  initComponent: function() {
    var _this = this; 
    
    var legendcanvasheight = 250;
    var legendcanvaswidth = 90;
    
    if(!isDefined(_this.opacity)){
      _this.opacity = 1.0;
    }
   _this.WMJSLayer = new WMJSLayer({service:_this.service,name:_this.name,style:_this.style,opacity:_this.opacity,transparent:_this.transparent,enabled:_this.enabled}); 
    
    _this.opacitySliderChanged = function(value){
      if(_this.WMJSLayer){
        _this.WMJSLayer.setOpacity(value/100);
        _this.opacity=value;
        if(_this.WMJSLayer.enabled==false){
          if(value>0){
            _this.WMJSLayer.display(true);
            _this.hideShowButton.setIconCls('button_layer_visible');
            _this.WMJSLayer.draw("LayerPanel::Opacity");
          }
         
        }else{
           if(value == 0){
            _this.opacity_backup = 100;
            _this.hideShowButton.setIconCls('button_layer_hidden');
            _this.WMJSLayer.display(false);
            _this.WMJSLayer.draw("LayerPanel::Opacity")
          }
        }
      }

    };
    
    _this.opacitySlider = Ext.create('Ext.slider.Single',{
      width:50,useTips:false,animate:false,
      value:_this.opacity*100,minValue:0,maxValue:100,increment:1,tooltip:'transparency',
      listeners:{
        drag:{fn:function(t){_this.opacitySliderChanged(t.getValue());}},
        change:{fn:function(t){_this.opacitySliderChanged(t.getValue());}}
      }
    });
    
    _this.hideShowButton = Ext.create("Ext.button.Button",{
      xtype:'button',tooltip: I18n.hide_or_display_layer.tooltip,
      iconCls:_this.WMJSLayer.enabled===true?'button_layer_visible':'button_layer_hidden',handler:function(o,c){
      _this.WMJSLayer.display(!_this.WMJSLayer.enabled);
      if(_this.WMJSLayer.enabled==false){
        this.setIconCls('button_layer_hidden');
          _this.opacity_backup = _this.opacitySlider.getValue();
          _this.opacitySlider.setValue(0);
      }else {
        this.setIconCls('button_layer_visible');
        _this.opacitySlider.setValue(_this.opacity_backup);
      }
      _this.WMJSLayer.draw("LayerPanel::HideShow");
    }});
    /**
     * selects this layer panel and colors the borders
     */
    _this.select = function(){
      var llp = _this.parentPanelList;
      var items=llp.items;
      for (var i=0; i<items.getCount(); i++) {
        items.get(i).unselect();
      }
      
      try{
      _this.getEl().dom.style.border = '3px solid #8080FF'; 
      }catch(e){
      }
      _this.selected = true;
    }
    
    _this.unselect = function(){
      //_this.getEl().dom.style.border = '5px solid #D8E0F0';
      try{
      _this.getEl().dom.style.border = '3px solid #777'; 
      }catch(e){
      }
      _this.selected = false;
    }
    
    /**
     * Sets opacity of this layer and sets the slider position
     * 
     * @param opacity Value between 0 and 1
     */
    _this.setOpacity = function(opacity){
      _this.opacitySlider.setValue(opacity*100);
      _this.opacity = opacity*100;
    }
    
    _this.dimCallBackAdded = false;
    
    _this.dimensionPanels = [];
    
    /**
     * Parses this layer, after it has been constructed with a service and a name
     * 
     * @param forceReload Set to true if getcapabilities should be reloaded and not taken from local store
     */
    _this.parseLayer = function(forceReload,afterlayerready){
      
      if(isDefined(this.WMJSLayer.service)==false){
        return;
      }
      if(this.WMJSLayer.service.length==0)return;
      _this.setLoading("GetCapabilities...");

      var dimBackup = [];
      for(var j=0;j<_this.WMJSLayer.dimensions.length;j++){

        dimBackup.push(this.WMJSLayer.dimensions[j].clone());
      }
      
      _this.dimensionPanels = [];
      
      /**
       * Updates the dimensionpanel sliders based on the dimension settings of the layer
       */
      _this.dimUpdate = function(){

        
        for(var j=0;j<_this.dimensionPanels.length;j++){
          //if(_this.dimensionPanels[j].dimension.linked == true){
            var dim=_this.WMJSLayer.getDimension(_this.dimensionPanels[j].dimension.name);
            _this.dimensionPanels[j].setValue(dim.getValue());
          //}
        }
        
      };
      
      /**
       * Sets the dimensions by its name and value and updates the panels accordingly
       * 
       * @param name
       * @param value
       */
      _this.setDimension = function(name,value){
        
        var dimPanel = _this.getDimensionPanel(name);
        if(!isDefined(dimPanel)){
          error("WMJSExtLayerPanel::Dimension "+name+" not found");
          return;
        }
        _this.WMJSLayer.setDimension(name,value);
        dimPanel.setValue(value);
      };
      
      /**
       * Gets the WMJSExtDimensionPanel of this layer by dimensionname
       * 
       * @param name The name of the dimension to look for
       * @return When found the corresponding WMJSExtDimensionPanel, undefined when not found.
       */
      _this.getDimensionPanel = function(name){
        for(var j=0;j<_this.dimensionPanels.length;j++){
          if(_this.dimensionPanels[j].dimension.name === name){
            return _this.dimensionPanels[j];
          }
        }
      };
      
      var failed = function(msg2){
        let errorMessage = msg2;
        if(msg2.message){
          errorMessage = msg2.message;
        }
        _this.setLoading(false);
        var msg = 'Unable to parse layer '+_this.WMJSLayer.name+'\n'+errorMessage;
        console.log(msg);
        _this.WMJSLayer.hasError = true;
        error(msg);
      };
      
      var layerParsedCallback = function(parsedLayer){
        if(_this.WMJSLayer.parentMaps[0] == undefined)return;
        if(_this.WMJSLayer != parsedLayer){
          if(isDefined(parsedLayer)){
            failed("WMJSExtLayerPanel internal error:\n"+parsedLayer);
          }
          if(afterlayerready)afterlayerready(_this);
          if(_this.afterlayerready)_this.afterlayerready(_this);
          
          return;
        };
        
        if(_this.WMJSLayer.hasError){
          _this.setLoading(false);
          
          //_this.layerNameLabel.setText(_this.WMJSLayer.path+_this.WMJSLayer.title);
          _this.productButton.setText(_this.WMJSLayer.path+_this.WMJSLayer.title);
          
          //_this.styleNameLabel.setText('');
          _this.styleButton.setText('');
         var msg = _this.WMJSLayer.lastError;
         if(!isDefined(msg)){
           msg="An error occurred connecting to WMS server";
         }
          _this.setTitle(msg);
          error(msg);
          var t = new WMJSTimer();
          msg = msg.replaceAll("\n","<br/>");
          t.init(10, function(){Ext.Msg.alert(I18n.unable_to_connect_server.text, I18n.unable_to_connect_server.text + '<br/><br/>'+msg);});
          if(afterlayerready)afterlayerready(_this);
          if(_this.afterlayerready)_this.afterlayerready(_this);
          return;
        }
        
        //_this.setTitle(_this.WMJSLayer.serviceTitle);
        
        //_this.layerNameLabel.setText(_this.WMJSLayer.path+_this.WMJSLayer.title);
        
        
        var success = function(layer,layerindex,nroflayers){
          _this.productButton.setText("("+(layerindex+1)+"/"+nroflayers+") "+_this.WMJSLayer.title);
        };
        var failure = function(error){
          _this.productButton.setText(_this.WMJSLayer.path+_this.WMJSLayer.title);
        };
        _this.WMJSLayer.getLayerRelative(success,failure);
        
        //_this.styleNameLabel.setText(_this.WMJSLayer.currentStyle);
        //_this.styleButton.setText(_this.WMJSLayer.currentStyle);
        
        _this.setStyleText(_this.WMJSLayer.getStyleObject(_this.WMJSLayer.currentStyle));
        
        _this.dimensionPanels = [];
        _this.dimensionPanelContainer.removeAll();

        var dimensionPanelContainerTitle = "";
        for(var j=0;j<_this.WMJSLayer.dimensions.length;j++){
          for(var i=0;i<dimBackup.length;i++){
            if(dimBackup[i].name == _this.WMJSLayer.dimensions[j].name){
              _this.WMJSLayer.dimensions[j].currentValue = dimBackup[i].currentValue;
            }
          }
          var dimPanel = Ext.create('WMJSExtDimensionPanel',{dimension:_this.WMJSLayer.dimensions[j],layer:_this.WMJSLayer,dimensionPanels:_this.dimensionPanels});
          _this.dimensionPanels.push(dimPanel);
          _this.dimensionPanelContainer.add(dimPanel);
          if(dimensionPanelContainerTitle.length>0)dimensionPanelContainerTitle+=", ";
          dimensionPanelContainerTitle +=_this.WMJSLayer.dimensions[j].name;
        }
//         if(_this.WMJSLayer.dimensions.length == 1){
//           _this.dimensionPanelContainer.setTitle(dimensionPanelContainerTitle);
//         }else{
//           _this.dimensionPanelContainer.setTitle("("+dimensionPanelContainerTitle+")");
//         }
        
//         _this.servicePanel.service=_this.service;
//         _this.servicePanel.buildTreeFromNodes(true);
        
     
        if(_this.afterlayerready){
          if(afterlayerready)afterlayerready(_this);
          _this.afterlayerready(_this);
        }
      
        _this.setLoading(false);
        

       
  
        //_this.WMJSLayer.parentMaps[0].rebuildMapDimensions(); 
        for(var j=0;j< _this.WMJSLayer.dimensions.length;j++){
          var mapDim = _this.WMJSLayer.parentMaps[0].getDimension( _this.WMJSLayer.dimensions[j].name);
          if(isDefined(mapDim)){
             _this.WMJSLayer.dimensions[j].setClosestValue(mapDim.currentValue);
          }
        }
        
        for(var j=0;j<_this.WMJSLayer.dimensions.length;j++){
          _this.dimensionPanels[j].setValue(_this.WMJSLayer.dimensions[j].currentValue);
        }
        
        _this.WMJSLayer.parentMaps[0].rebuildMapDimensions(); 
        
        if(_this.dimCallBackAdded == false){
          _this.WMJSLayer.parentMaps[0].addListener("ondimchange",_this.dimUpdate,true);
          _this.dimCallBackAdded = true;
        }
        
        try{
          _this.styleButton.loadStyles();
        }catch(e){
          console.log(e);
        }
      
       var layerHasName = false; 
       if(isDefined(_this.name)){
         if(_this.name.length>0){
           layerHasName = true;
         }
       }
       
       _this.setTitle("Layer "+ _this.WMJSLayer.name);
        
       if(layerHasName === false){
         if(_this.autoChooseLayer == true){
           _this.autoChooseLayer = false;
          _this.WMJSLayer.autoSelectLayer(function(layer){_this.setLayer(layer.name); _this.WMJSLayer.zoomToLayer();layerHasName=true;});
          return;
         }else{
          _this.productButton.showService();
         }
          }
          
        if(_this.WMJSLayer.WMJSService){
          //console.log(_this.WMJSLayer.WMJSService);
          _this.layerAbstractPanel.update(
            "<span style='margin:5px;display:block;padding:5px;'>"+
            "<b>"+ I18n.layer.text+"</b><table class='adagucviewer_wmsjsext_layerpanel_abstract'>"+
            "<tr><td style='width:50px;'><i>"+ I18n.title.text+"</i></td><td>"+_this.WMJSLayer.title+"</td></tr>"+
            "<tr><td><i>"+ I18n.name.text+"</i></td><td>"+_this.WMJSLayer.name+"</td></tr>"+
            "<tr><td><i>"+ I18n.abstract.text+"</i></td><td>"+_this.WMJSLayer.abstract+"</td></tr>"+
            "</table>"+
            "<hr/>"+
            "<b>"+ I18n.service.text+"</b><table class='adagucviewer_wmsjsext_layerpanel_abstract'>"+
            "<tr><td><i>"+ I18n.title.text+"</i></td><td> "+_this.WMJSLayer.WMJSService.title+"</td></tr>"+
            "<tr><td><i>"+ I18n.service.text+"</i></td><td>"+_this.WMJSLayer.WMJSService.onlineresource+"</td></tr>"+
            "<tr><td><i>"+ I18n.abstract.text+"</i></td><td>"+_this.WMJSLayer.WMJSService.abstract+"</td></tr>"+
            
            "</table>"+
            "</span>"
            
            
            
          
          );
        }else{
          _this.layerAbstractPanel.update("...");
        }
       
       var setLegendForLayer = function (){
         var url = _this.WMJSLayer.parentMaps[0].getLegendGraphicURLForLayer(_this.WMJSLayer);
           var legendStore = _this.WMJSLayer.parentMaps[0].getLegendStore();
           if(_this.layerLegendPanel.getEl()){
            var canvas = $(_this.layerLegendPanel.getEl().dom).find("canvas")
              var ctx=canvas[0].getContext("2d");

              
            var img = legendStore.getImageForSrc(url);
            if(img){
                ctx.rect(0, 0, legendcanvaswidth,legendcanvasheight);
                ctx.fillStyle = 'white';
                ctx.fill();            
                ctx.drawImage(img.getElement()[0],0,0);
            }else{
                ctx.rect(0, 0, legendcanvaswidth,legendcanvasheight);
                ctx.fillStyle = 'gray';
                ctx.fill();
            }
           }

       };
       
       _this.WMJSLayer.parentMaps[0].getListener().addToCallback("onlegendready",setLegendForLayer,true);
       setLegendForLayer();
       
      };//layerParsedCallback
      
      try{
        _this.WMJSLayer.parseLayer(layerParsedCallback,forceReload,"LayerPanel::parseLayer");
      }catch(e){
        console.log(e);
        failed(e);
      }
      
    
    };
    
    /**
     * Duplicates/clones this layer and adds a new layer to the list
     */
    _this.duplicateLayer = function(){
      createNewLayerPanel(_this.parentWebMapJS,_this.WMJSLayer);
    };
    
   
    

    _this.productButton = Ext.create('Ext.button.Button',{
        text: I18n.please_select_product.text,
      
        textAlign:'left',
        iconAlign:'right',
        iconCls:'button_combobox',
        tooltip: I18n.select_layer_product_from_service.tooltip,
        handler:function(a){
          if(_this.service == undefined || _this.service.length == 0){

            var t = Ext.create('webmapjsext.WMJSExt.DataPanel',{
              dataPanelClicked:function(node){
              _this.service = node.service;
              _this.name = node.layer;
              _this.WMJSLayer.service=_this.service;
              _this.WMJSLayer.name=_this.name;
              
              var afterlayerready = function(layer,webmapjs){
                if(isDefined(node.ready)){
                  node.ready(_this,_this.parentWebMapJS);
                }
                
              }
              _this.parseLayer (true,afterlayerready );
              
              
              return _this;
            },
              webMapJS:_this.parentWebMapJS
            });
            t.show();
            

          }else{
            a.showService();
          }
        }                
      });
    
     
  
    _this.productButton.showService = function(){
      
      var a = getServicePanelManager();
      _this.servicePanelWindow = a.getServicePanel(_this.service,_this);
      _this.servicePanelWindow.showAt([this.getPosition()[0]+32,this.getPosition()[1]]);
    };
    
    _this.styleButton = Ext.create('Ext.button.Button',{
        text: I18n.default.text,
       
        
        textAlign: 'left',
        iconAlign: 'right',
        iconCls:'button_combobox',
        tooltip: I18n.change_style_layer.tooltip,
        //scale:'medium',
        handler:function(){

          
           _this.styleButton.loadStyles();
          
          _this.stylePanel.showAt([this.getPosition()[0]+32,this.getPosition()[1]]);
        },
        listeners:{
          afterrender:{
            fn:function(){
              
              if(!_this.stylePanel){
                _this.stylePanel =  Ext.create('webmapjsext.WMJSExt.WindowFader',{
                  title: I18n.available_styles.text,
                  width:650,autoDestroy:false,closeAction:'hide',
                  items:[
                    Ext.create('WMJSExtStylePanel',{
                      header:false,
                      WMJSLayerObject:_this.WMJSLayer,
                      border:0,
                      itemclick:function(t,style){
                        _this.setStyle(_this.WMJSLayer.getStyleObject(style.name));
                        /*
                        try{
                          _this.WMJSLayer.setStyle(style.name);
                        }catch(e){
                        }
                        _this.WMJSLayer.draw("325");
                        _this.stylePanel.hide();
                        //_this.styleButton.setText('Style: '+style.title);
                        //_this.styleNameLabel.setText(style.title);
                        _this.styleButton.setText(style.title);*/
                      }
                    })
                  ]
                });
              }
              
              _this.styleButton.loadStyles = function(){
                
                if(_this.stylePanel){
                  _this.stylePanel.getComponent(0).loadStyles(_this.WMJSLayer);
                  var styleText='default';
                  _this.styleButton.setText(styleText);
                  if(_this.WMJSLayer.currentStyle.length>0){
                    styleText=_this.WMJSLayer.currentStyle;
                    _this.styleButton.setText(styleText);
                    try{
                      
                      _this.setStyleText(_this.WMJSLayer.getStyleObject(_this.WMJSLayer.currentStyle));
                    }catch(e){
                      console.log(e);
                    }
                  }
                  //_this.styleNameLabel.setText(styleText);
                  
                  //_this.styleButton.setText('Style: '+styleText);
                }
              }
              
               
            }
          }
        }
      });
    

    
      _this.dimensionPanelContainer = Ext.create('Ext.panel.Panel',{border:false,padding:1,collapsed:false,collapsible:true,title: I18n.dimensions.text,cls:'WMJSExtLayerPanelDimensionHeader'});
      
      _this.servicePanelContainer = Ext.create('webmapjsext.WMJSExt.ServicePanel',{
          title: I18n.layers.text,
          cls:'WMJSExtLayerPanelDimensionHeader',
          header:true,collapsible:true,collapsed:true,
          service:_this.WMJSLayer.service,
          name:_this.WMJSLayer.name,
          border:2,
          itemclick:function(t,layername,service){
          _this.setLayer(layername,service);
        }
      });
      
      //_this.layerNameLabel = Ext.create('Ext.form.Label',{text:'',    style: {backgroundColor:'#FFF',fontSize:'10px'}});
      //_this.styleNameLabel = Ext.create('Ext.form.Label',{text:'',    style: {backgroundColor:'#FFF',fontSize:'10px'}});
      
      _this.layerInfoPanelContainer = Ext.create('Ext.panel.Panel',{
        border:false,frame:false,height:35,padding:'3 3 3 3',
        layout:'border',
        items:[{
          xtype:'panel',
          region:'center',
          //width:24,
          layout:'fit',
          border:false,frame:false,
          items:[_this.productButton]
        },{
          style: {borderColor:'#EEE', borderStyle:'solid', borderWidth:'0px',backgroundColor:'#FFF'},
          xtype:'panel',
          region:'east',
          itemId:'layerinfo',
          width:40,
         
          layout:'hbox',
          border:false,frame:false,
          padding:'0 0 0 0',
          items:[
                  {
                    xtype:'button',text:'&lt;',width:20,height:29,
                    handler:function(){
                      _this.WMJSLayer.getPreviousLayer(
                        function(layer){_this.setLayer(layer.name);}
                      )
                    }
                  },
                  {
                    xtype:'button',text:'&gt;',width:20,height:29,
                    handler:function(){
                      _this.WMJSLayer.getNextLayer(
                        function(layer){_this.setLayer(layer.name);}
                      )
                    }
                  }
                ]
          
        }]
      });
      
      
      _this.setLayer = function(layerName,serviceName){
          _this.WMJSLayer.name=layerName;
          if(isDefined(serviceName)){
            _this.WMJSLayer.service=serviceName;
          }
          
          _this.parseLayer();
          _this.WMJSLayer.draw("LayerPanel::setLayer");
          if(_this.servicePanelWindow){
            _this.servicePanelWindow.hide();
          }
          if(_this.stylePanel){
            _this.styleButton.loadStyles();         
          }
      };
      
      _this.setStyleText = function(styleObject){
        if(isDefined(styleObject)==false){
          _this.styleButton.setText("default");
          return;
        }
        _this.styleButton.setText("("+(styleObject.index+1)+"/"+styleObject.nrOfStyles+") "+styleObject.title);      
      };
      
      _this.setStyle = function(styleObject){
        try{
          _this.WMJSLayer.setStyle(styleObject.name);
        }catch(e){
          console.log(e);
        }
        _this.WMJSLayer.draw("LayerPanel::setStyle");
        _this.stylePanel.hide();
         
        _this.setStyleText(styleObject);
      };
      
      _this.styleInfoPanelContainer = Ext.create('Ext.panel.Panel',{
        border:false,frame:false,height:32,padding:'0 3 3 3',
        layout:'border',
        items:[{
          xtype:'panel',
          region:'center',
          //width:24,
          layout:'fit',
          border:false,frame:false,
         
          items:[_this.styleButton]
        },{
          style: {borderColor:'#EEE', borderStyle:'solid', borderWidth:'0px',backgroundColor:'#FFF'},
          xtype:'panel',
          region:'east',
          width:40,
          layout:'hbox',
          border:false,frame:false,
          items:[{xtype:'button',text:'&lt;',width:20,height:29,handler:function(){_this.setStyle(_this.WMJSLayer.getStyleObject(_this.WMJSLayer.currentStyle,-1));}},
                 {xtype:'button',text:'&gt;',width:20,height:29,handler:function(){_this.setStyle(_this.WMJSLayer.getStyleObject(_this.WMJSLayer.currentStyle,+1));}}]
          
        }]
      });
      
      _this.animationButton = {
        listeners:{
          afterrender:{
            fn:function(t){
              if(_this.WMJSLayer.parentMaps[0].isAnimating){
                t.setIconCls("button_stop_animation");
              }
              _this.WMJSLayer.parentMaps[0].addListener("onstopanimation",function(){t.setIconCls("button_play_animation");},true);
              _this.WMJSLayer.parentMaps[0].addListener("onstartanimation",function(){t.setIconCls("button_stop_animation");},true);
            }
          }
        },
        scale:'small',iconCls:'button_play_animation',tooltip: I18n.start_or_stop_animation.tooltip,handler:function(t){
        //_this.WMJSLayer.zoomToLayer();
          if(_this.WMJSLayer.parentMaps[0].isAnimating){
              _this.WMJSLayer.parentMaps[0].stopAnimating();
            t.setIconCls("button_play_animation");
            
          }else{
            t.setIconCls("button_stop_animation");
            var timeDim = _this.WMJSLayer.getDimension('time');
            if(timeDim == undefined){
              alert(I18n.no_time_dimension_in_layer.text);
              return;
            }
            
            var dates = [];
            
            var maxIndex = timeDim.size();
            var startIndex = maxIndex-24;//_this.WMJSLayer.parentMaps[0].getMaxNumberOfAnimations();
            var stopIndex = maxIndex;
            
            var currentIndex = timeDim.getIndexForValue(timeDim.currentValue);
            var diff = (stopIndex -1) - currentIndex;
            startIndex-=diff;
            stopIndex-=diff;
            
            if(startIndex<0){
              stopIndex+=(-startIndex);
              startIndex=0;
            }
            if(stopIndex<0){
              stopIndex = 0;
            }
            if(startIndex>maxIndex-1)startIndex = maxIndex-1;
            if(stopIndex>maxIndex)stopIndex = maxIndex;
              
            
            for(var j=startIndex;j<stopIndex;j++){
              dates.push({name:timeDim.name,value:timeDim.getValueForIndex(j)});
            }
            _this.WMJSLayer.parentMaps[0].draw(dates);
          }
        
      }};
      

      
      _this.moveUp = function(){
        var myContainer=_this.up('panel');
        var childIndex = myContainer.items.indexOf(_this);
        if(childIndex>0){
          myContainer.move(childIndex,childIndex-1);
          _this.WMJSLayer.moveUp();
        }
      };
      _this.moveDown = function(){
        var myContainer=_this.up('panel');
        var childIndex = myContainer.items.indexOf(_this);
        if(childIndex<myContainer.items.length-1){
          myContainer.move(childIndex,childIndex+1);
          _this.WMJSLayer.moveDown();
        }
      };
    
      
  
  _this.layerLegendPanel = Ext.create('Ext.panel.Panel',{
      xtype:'panel',
      region:'west',
      html:"<canvas width="+legendcanvaswidth+" height="+legendcanvasheight+"></canvas>",
     border:false,
      frame:false,
      plain:true,
      width:legendcanvaswidth
    });
  
      
  _this.layerAbstractPanel = Ext.create('Ext.panel.Panel',{
      xtype:'panel',
      region:'center',
      layout:'fit',
      autoScroll:true,
      border:false,
      frame:false,
      plain:true
    });

  
    Ext.apply(this, {
      margin:'0 0 2 0',
      frame:true,plain:true,padding:'0 0 0 0',collapsible:false,closable:true,hideCollapseTool:false,header:true,
      layout:{
        type:'vbox',
        align:'stretch'
      },
        items:[
        _this.layerInfoPanelContainer,_this.styleInfoPanelContainer,
      
        _this.dimensionPanelContainer,
        _this.servicePanelContainer,
          {
          xtype:'panel',
          layout:'border',
          frame:false,border:false,
          plain:true,
          title:'Service info',//TODO Make I18
          cls:'WMJSExtLayerPanelDimensionHeader',
          collapsible:true,
           collapsed:true,
          height:legendcanvasheight,
          region:'center',
          items:[_this.layerAbstractPanel,_this.layerLegendPanel]
        }

      ],
      
      bbar:[

        /*{
          xtype:'button',
          tooltip:'Remove this layer',
          iconCls:'button_layerlist_layerdelete',
          handler:function(o,c){
            _this.select();
            _this.parentPanelList.removeLayer();;
            //_this.close();
          }          
        },*/{
          xtype:'button',
          tooltip: I18n.move_layer_up.tooltip,
          iconCls:'button_layerlist_layerup',
          handler:function(o,c){
            _this.moveUp();
          }
        },{
          xtype:'button',
          tooltip: I18n.move_layer_down.tooltip,
          iconCls:'button_layerlist_layerdown',
          handler:function(o,c){
            _this.moveDown();
          }
        },/*{
            iconCls:'button_duplicate',tooltip:'Clone this layer and add it on top of the layer list.',
            handler:function(){
              _this.duplicateLayer();
            }
          },*/{
            iconCls:'button_settings_icon',tooltip: I18n.layer_properties.tooltip,
            handler:function(o,c){
              if(!_this.propertiesPanel){
                _this.propertiesPanel =  Ext.create('Ext.window.Window',{
                  title: I18n.properties_for.text+_this.WMJSLayer.title,
                  width:600,autoDestroy:false,closeAction:'hide',
                  layout:'fit',
                  items:[
                    Ext.create('WMJSExtLayerPropertiesPanel',{
                      header:false,
                      WMJSLayerObject:_this.WMJSLayer,
                      border:0,
                      itemclick:function(t,style){
                        
                      }
                    })
                  ]
                });
              }
              //alert(o.findParentByType('button'));
              _this.propertiesPanel.showAt(o.getPosition());
            }
          },{
          iconCls:'button_refresh',tooltip: I18n.reload_this_layer.tooltip,
          handler:function(){
            if(isDefined(_this.servicePanelWindow)){
              _this.servicePanelWindow.refresh(true);
            }
            _this.parseLayer(true);
          }
        },
        _this.animationButton,
        /*,{
          iconCls:'button_settings_icon',
          tooltip:'Settings and layer information',
          menu:
            [ 
              
              {
                text:'Duplicate layer',iconCls:'button_duplicate',tooltip:'Clone this layer',
                handler:function(){
                  _this.duplicateLayer();
                }
              },{
                text:'Download layer with WCS',
                handler:function(){
                  var url = "wcs.html"+WMJSMakePermaLink(_this.WMJSLayer.parentMaps[0],_this.WMJSLayer);
                  debug("Open WCS download window:");
                  debug("<a target=\'_blank\' href='"+url+"'>"+url+"</a>",false);
                  var wcsDownloadWindow = window.open(url,'WCS download');
                  //if(window.focus){wcsDownloadWindow.focus();}
                  //Ext.create('Ext.window.Window',{
                    //title:'Create permanent links',
                    //width:'90%',height:'90%',layout:'fit',autoDestroy:true,closeAction:'destroy',autoScroll:true,modal:false,
                    //items:[ Ext.create ('Ext.ux.IFramePanel',{src:url,layout:'fit'})]          
                  //}).show();
                  
                }
              }
            ]
            
          }*/,
        {xtype:'tbfill'},{xtype:'label',text: I18n.opacity.text},
        _this.opacitySlider,_this.hideShowButton,
        {scale:'small',iconCls:'button_zoomfullextent',tooltip: I18n.zoom_to_this_layer.tooltip,handler:function(){_this.WMJSLayer.zoomToLayer()}}
      ],
      listeners:{
        render: function(panel) {
          if(panel.header){
            panel.header.on('click', function() {
              _this.select();
            });
          }
          _this.select();
        },
        afterrender:{
          fn:function(){
            
             _this.parseLayer();
     
          }
        },
        beforeclose:function(p){
          _this.WMJSLayer.parentMaps[0].stopAnimating();
          _this.WMJSLayer.remove();
        }
      }
    });
    
    this.callParent(arguments);
   _this.parseLayer();
  }
});
