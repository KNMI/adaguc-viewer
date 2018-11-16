var defaultBaselayer={
  service:'http://geoservices.knmi.nl/cgi-bin/worldmaps.cgi?',
  name:'world_line'
}

Ext.define('webmapjsext.WMJSExt.BaseMapSelector',{
  extend:'Ext.panel.Panel', 
  alias:'WMJSExtBaseMapSelector',
  requires:['Ext.form.field.Checkbox','Ext.form.Label','Ext.layout.container.Border','Ext.slider.Single','Ext.grid.Panel'],
  
  initComponent: function() {
    var _this = this;

    var _webmapjsext = _this.webmapjsext;
    
    OverlaySelectorModel = Ext.define('OverlaySelectorModel', {
        extend: 'Ext.data.Model',
        fields: [
          {name: 'title'},
          {name: 'enabled', type: 'bool'},
          {name: 'type'},
          {name: 'layer',type:'object'},
          {name: 'name'}
        ]
    });

    var overlayConfigurationStore = Ext.create('Ext.data.Store', {
        model: 'OverlaySelectorModel'
    });

    Ext.apply(this, {
      autoScroll:true,plain:true,frame:false,border:false,
      bodyCls:'layerlistbg',
      title:' ',
      tooltip: I18n.basemaps_overlays.tooltip,
      iconCls:'button_basemaps32',
      defaultType: 'checkbox', 
      layout:'anchor',
      items: Ext.create('Ext.grid.Panel', {
        header:false,
          bodyCls:'layerlistbg',
          autoScroll:false,plain:true,frame:false,border:false,
        store: overlayConfigurationStore,
        columns: [
          {
            text: "", dataIndex: 'enabled', xtype: 'checkcolumn',width:30,
            listeners: {
              checkchange: function (column, recordIndex, checked) {
                overlayConfigurationStore.getAt(recordIndex).get('layer').enabled = checked;
                _webmapjsext.webMapJS.draw("WMJSExtMapTypePanel::enableLayer");
              }
            }
          },
          {text: I18n.title.text,  dataIndex: 'title',flex:2},
          {text: I18n.layer.text,  dataIndex: 'name',flex:1},
          {text: I18n.type.text, dataIndex: 'type'}
        ],
        columnLines: true,
        iconCls: 'icon-grid'
      }),
      listeners:{
        show:{
          fn:function(){
            var myOverlayConfig = [];
            var wmjsBaseLayerConfig = _webmapjsext.webMapJS.getBaseLayers();
            for(var j=0;j<wmjsBaseLayerConfig.length;j++){
              var title = wmjsBaseLayerConfig[j].title;
              if(j == 0)title= "Default base layer";
              myOverlayConfig.push({
                title:title,
                layer:wmjsBaseLayerConfig[j],
                name:wmjsBaseLayerConfig[j].name,
                enabled:wmjsBaseLayerConfig[j].enabled,
                type:((wmjsBaseLayerConfig[j].keepOnTop == true) ? 'overlay' : 'baselayer')
              });
            }
            overlayConfigurationStore.loadRawData(myOverlayConfig);
          }
        }
      }
    });
    this.superclass.initComponent.apply(this, arguments);
  }
});