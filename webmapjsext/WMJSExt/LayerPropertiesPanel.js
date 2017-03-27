//Constructor for custom webmapjs panel

Ext.define('webmapjsext.WMJSExt.LayerPropertiesPanel', {
  extend   : 'Ext.tab.Panel',
  alias    : 'WMJSExtLayerPropertiesPanel',
  initComponent: function() {
    var _this = this; 
    _this.applyColorScaleRange = function(){
      var minValue = _this.getComponent('wmsextensions').getComponent('colorscalerangeminvalue').getValue();
      var maxValue = _this.getComponent('wmsextensions').getComponent('colorscalerangemaxvalue').getValue();
      _this.WMJSLayerObject.wmsextensions({colorscalerange:minValue+','+maxValue});
      _this.WMJSLayerObject.draw("LayerPropertiesPanel::applyColorScaleRange");
    };
    
    _this.applyWMSVersion = function(){
      var wmsValue= _this.getComponent('wmsversionpanel').getComponent('wmsversion').getValue();
      _this.WMJSLayerObject.version = wmsValue;
      _this.WMJSLayerObject.draw("LayerPropertiesPanel::applyWMSVersion");
    };
    
    _this.projectionStore = Ext.create('Ext.data.Store', {
      fields:['title', 'srs', 'bbox'],
      data:{'items':[]},proxy: {type: 'memory',reader: {type: 'json',root: 'items'}}
    });
    
    var showWCSWindow = function(){
        var wcs = Ext.create('Ext.window.Window',{
//                  title:'Properties for '+_this.WMJSLayer.title,
        width:'90%',height:'90%',autoDestroy:true,closeAction:'close',
        maximizable:true,
        layout:'fit',
        items:[
          Ext.create('WCSPanel',{
            autoDestroy:true,closeAction:'close',
            WMJSLayer:_this.WMJSLayerObject

          })
        ]
      });
      wcs.show();
    };
    
    Ext.apply(this, {
      
      layout:'fit',
      frame:false,border:false,margin:0,
      items:[
        {xtype:'panel',title: I18n.color_range.text,margin:6,
        
        itemId:'wmsextensions',
        items:[
          {
            itemId:'colorscalerangeminvalue',
            xtype: 'numberfield',
            fieldLabel: I18n.min_value.text,
            value:0.0,
            margin:6,
            //listeners: {change: function(){_this.applyColorScaleRange();}}
            listeners: {specialkey: function(field, e){if (e.getKey() == e.ENTER){_this.applyColorScaleRange();}}}
          },{
            itemId:'colorscalerangemaxvalue',
            xtype: 'numberfield',
            fieldLabel: I18n.max_value.text,
            value:'1.0',
            margin:6,
            //listeners: {change: function(){_this.applyColorScaleRange();}}
            listeners: {specialkey: function(field, e){if (e.getKey() == e.ENTER){_this.applyColorScaleRange();}}}
          }
        ],
        buttons:[
        {xtype:'button',text: I18n.reset.text,handler:function(){
          _this.WMJSLayerObject.wmsextensions({colorscalerange:''});
          _this.WMJSLayerObject.draw("LayerPropertiesPanel::reset");
        }},
        {xtype:'button',text: I18n.apply.text,handler:function(){
          _this.applyColorScaleRange();
        }}]
        },{
          xtype:'panel',title: I18n.wms_version.text,margin:6,
          itemId:'wmsversionpanel',
          items:[{
            itemId:'wmsversion',
            xtype: 'textfield',
            labelWidth:250,
            margin:6,
            fieldLabel: I18n.wms_version.text,
            value:_this.WMJSLayerObject.version,
            listeners: {specialkey: function(field, e){if (e.getKey() == e.ENTER){_this.applyWMSVersion();}}}
          },{
            xtype:'checkbox',
            itemId:'usewms130comaptmode',
            labelWidth:250,
            fieldLabel: I18n.wms_comp_mode.text,
            margin:6,
            listeners: {change: function(field, c){_this.WMJSLayerObject.wms130bboxcompatibilitymode=c; _this.WMJSLayerObject.draw("LayerPropertiesPanel::WMS1.3.0CompatMode");}}
          }
          ]
        },{
          xtype:'panel',title: I18n.projections.text,margin:6,
          itemId:'wmsprojectionpanel',
          layout:'fit',
          items:[{
            xtype:'grid',
            border:false,
            store: _this.projectionStore,
            columns: [
              { text: I18n.title.text,  dataIndex: 'title' ,flex:2},
              { text: I18n.epsg_code.text, dataIndex: 'srs',flex:1 },
              { text: I18n.bounding_box.text, dataIndex: 'bbox' ,flex:2}
            ],
            listeners:{
              select:{
                fn:function(id,record){
                  var bbox = record.get('bbox');
                  var srs = record.get('srs');
                  _this.WMJSLayerObject.parentMaps[0].setProjection({srs:srs,bbox:bbox});
                  _this.WMJSLayerObject.parentMaps[0].draw();
                } 
              }
            }
          }],
          listeners:{
            show:{
              fn:function(){
                _this.projectionStore.removeAll();
                for(var j=0;j<_this.WMJSLayerObject.projectionProperties.length;j++){
                  var description = _this.WMJSLayerObject.projectionProperties[j].srs;
                  try{
                    description = epsgDescriptionLookup[_this.WMJSLayerObject.projectionProperties[j].srs];
                  }catch(e){}
                  if(!isDefined(description))description=_this.WMJSLayerObject.projectionProperties[j].srs;
                  _this.projectionStore.add({title:description,srs:_this.WMJSLayerObject.projectionProperties[j].srs,bbox:_this.WMJSLayerObject.projectionProperties[j].bbox});
                }
              }
            }
          }
        },{
          xtype:'panel',title: I18n.file_metadata.text,margin:6,
          itemId:'wmsfilemetadatapanel',
          layout:'fit',
          listeners:{
            show:{
              fn:function(){
                //http://localhost/cgi-bin/demo/autowms.cgi?source=%2Fkis%2Finspire_daily_weather_observations_kis_v20131021.nc&&service=wms&request=getmetadata&format=image/png32&srs=EPSG:4326&layer=UG
                _this.getComponent('wmsfilemetadatapanel').update("<a target=\"_blank\" href=\""+_this.WMJSLayerObject.service+"&service=wms&request=getmetadata&format=image/png&srs=EPSG:4326&layer="+_this.WMJSLayerObject.name+"\">" + I18n.show_file_metadata.text + "</a>");
              }
            }
          }
        },{
          xtype:'panel',title: I18n.download_data_wcs.text,margin:6,
          itemId:'wcs',
          layout:'fit',
          items:[{xtype:'button',text: I18n.show.text,handler:function(){showWCSWindow();}}],
          listeners:{
            show:{
              fn:function(){
                showWCSWindow();

              }
            }
          }
        }/*,{
          xtype:'panel',title:'Layer and service metadata',margin:6,height:400,
          itemId:'wmslayermetadatapanel',
          layout:'fit',
          items:[]
        }*/
      ],
      /*tbar:[
        {scale:'medium',disabled: true,enableToggle:true,toggleGroup:'toolBar1',iconCls:'button_getfeatureinfo',tooltip:'Open single point on map graphing',id:  _this.pointinfobutton,handler:function(e){_this.webMapJS.setMapModeNone();_this.webMapJS.setMapModePoint();}}
      ],*/
      listeners:{
        afterlayout:{
          fn:function(){
          }
        }
      }
    });
    webmapjsext.WMJSExt.LayerPropertiesPanel.superclass.initComponent.apply(this, arguments);
  }
});