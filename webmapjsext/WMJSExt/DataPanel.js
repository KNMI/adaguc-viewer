Ext.define('webmapjsext.WMJSExt.DataPanel', {
  extend   : 'Ext.window.Window',
  alias    : 'WMJSExtDataPanel',
  initComponent: function() {

    var _this = this; 
    DataSelectorModel = Ext.define('DataSelectorModel', {
      extend: 'Ext.data.Model',
      fields: [
      {name: 'title'},
      {name: 'thumbnail'},
      {name: 'service'},
      {name: 'layer'},
      {name: 'style'},
      {name: 'srs'},
      {name: 'bbox'},
      {name: 'baselayerservice'},
      {name: 'baselayername'},
      {name: 'opacity'}
      
      ]
    });
    var store = Ext.create('Ext.data.Store', {
      model: 'DataSelectorModel',
      data: dataChooserConfiguration
    });
    
    
    
    var showAddCustomWMSWindow = function(dataPanelClicked,webMapJS){
      var customWMSWindow;
      var submitCustomWMSURL = function(webMapJS){
        var value = customWMSWindow.getComponent('AddCustomWMSPanel').getComponent('customwmsurltextarea').getValue();
        
        value = WMJScheckURL(value);
        
        if(value.length<5){
          alert('Invalid url given.');
          return;
        }
        try{
          Ext.state.Manager.set('formFieldValues', value);
        }catch(e){
          console.log(e);
        }
        var readyFunction = function(layerpanel,webmapjs){
          if(isDefined(layerpanel)){
            if(layerpanel.WMJSLayer.hasError){
              var t = new WMJSTimer();
              t.init(10, function(){Ext.Msg.alert(I18n.unable_to_connect_server.text,I18n.unable_to_connect_server.text + '<br/><br/>'+layerPanel.WMJSLayer.lastError);});
            }else{
              customWMSWindow.hide();
            }
          }else{
              customWMSWindow.hide();
          }
        };
        _this.layerPanel = dataPanelClicked({service:value,ready:readyFunction});
        //     createNewLayerPanel(webMapJS, {service:value,zoomtolayer:false,notifyadded:false,ready:function(layerPanel){
        //       if(layerPanel.WMJSLayer.hasError){
        //         layerPanel.close();
        //         var t = new WMJSTimer();
        //         t.init(10, function(){Ext.Msg.alert('Unable to connect to WMS service','Cannot connect to WMS service.<br/><br/>'+layerPanel.WMJSLayer.lastError);});
        //         
        //       }
        //       else{
        //         customWMSWindow.hide();
        //       }
        //     }
        //     });
        //createNewServicePanel({service:value});
      };
      var myTextarea = Ext.create('Ext.form.field.Text',{
        //value:'http://geoservices.knmi.nl/cgi-bin/RADNL_OPER_R___25PCPRR_L3.cgi?',
        itemId:'customwmsurltextarea',
        emptyText: I18n.enter_wms_version_url.text,
        height:25,
        margin:10,
        stateful:true,
        
        listeners: {
          specialkey: function(f,e){
            if(e.getKey() == e.ENTER){
              submitCustomWMSURL(webMapJS);
            }
          },
          afterrender: function(form) {
            var values = Ext.state.Manager.get('formFieldValues');
            if (values) {
              console.log(values);                
              myTextarea.setValue(values);
//               Ext.Object.each(values, function(key, value) {
//                   form.count += 1;
//                   form.add({
//                       xtype: 'textfield',
//                       name: 'field' + form.count,
//                       fieldLabel: 'field ' + form.count,
//                       value: value
//                   });
//               });
          }
          }
        }
      });
      
      //this.mon(myTextarea, 'keyup', this.onMyTextareaKeyup, this, {buffer: 1000});
      //if(!isDefined(customWMSWindow)){
      customWMSWindow = Ext.create('Ext.window.Window',{
        title: I18n.add_custom_service.text,
                                   width:620,height:200,layout:'fit',autoDestroy:true,autoScroll:false,modal:true,layout:'border',
                                   items:[
                                   {
                                     xtype:'panel',region:'north',layout:'fit',border:false,//title:'WMS service address:',
                                   itemId:'AddCustomWMSPanel',
                                   items:[myTextarea]
                                   },{
                                     xtype:'label',
                                   margin:10,
                                   html : 'Add your own WMS version 1.1.1 server address in the box above. For example:<br> http://geoservices.knmi.nl/cgi-bin/RADNL_OPER_R___25PCPRR_L3.cgi? ',
                                   region:'center'
                                   }
                                   ],
                                   buttons:[{text:I18n.add.text,handler:function(){submitCustomWMSURL(webMapJS);}}]
      });
      //}
      customWMSWindow.show();
    };
    
    _this.showCustomWMSWindow = function(){
      showAddCustomWMSWindow(_this.dataPanelClicked,_this.webMapJS);
    };
    
    Ext.apply(this, {    
      title: I18n.add_layers_and_services.text,
      width:$(window).width()*0.8 ,height:$(window).height()*0.8 ,autoDestroy:true,modal:true,autoScroll:true,
      id:'images-view',
      buttons:[{scale:'large',text: I18n.add_custom_wms_service.text,handler:function(){_this.close();showAddCustomWMSWindow(_this.dataPanelClicked,_this.webMapJS);}}],
              items:
              
              Ext.create('Ext.view.View', {
                store: store,
                tpl: [
                '<tpl for=".">',
                '<div class="thumb-wrap" id="{title}">',
                '<div class="thumb"><img src="{thumbnail}" title="{title}"></div>',
                '<span class="x-editable">{title}</span></div>',
                '</tpl>',
                '<div class="x-clear"></div>'
                ],
                trackOver: true,
                overItemCls: 'x-item-over',
                itemSelector: 'div.thumb-wrap',
                emptyText: 'No images to display',
                listeners: {
                  itemclick: function(dv, node ){
                    _this.dataPanelClicked({
                      title:node.get('title'),
                                           thumbnail:node.get('thumbnail'),
                                           service:node.get('service'),
                                           layer:node.get('layer'),
                                           srs:node.get('srs'),
                                           bbox:node.get('bbox'),
                                           style:node.get('style'),
                                           baselayerservice:node.get('baselayerservice'),
                                           baselayername:node.get('baselayername'),
                                           opacity:node.get('opacity')
                    }
                    );
                    
                    _this.close();
                  }
                }
              })
    });
    webmapjsext.WMJSExt.DataPanel.superclass.initComponent.apply(this, arguments);
  }
});



