var defaultBaselayer={
  service:'http://geoservices.knmi.nl/cgi-bin/worldmaps.cgi?',
  name:'world_line'
}

Ext.define('webmapjsext.WMJSExt.MapTypeSelector',{
  extend:'Ext.panel.Panel', 
  alias:'WMJSExtMapTypeSelector',
  requires:['Ext.form.field.Checkbox','Ext.form.Label','Ext.layout.container.Border','Ext.slider.Single','Ext.grid.Panel'],
  
  initComponent: function() {
    var _this = this;

      var _maptypeclicked = _this.maptypeclicked;
      var _webmapjsext = _this.webmapjsext;

        MapTypeSelectorModel = Ext.define('MapTypeSelectorModel', {
            extend: 'Ext.data.Model',
            fields: [
              {name: 'title'},
              {name: 'bbox'},
              {name: 'srs'},
              {name: 'url'},
              {name: 'baselayer'}
            ]
        });
        
        var mapTypeConfigurationStore = Ext.create('Ext.data.Store', {
            model: 'MapTypeSelectorModel',
            data:mapTypeConfiguration
        });

        var maptypeclicked = function(node){
          _maptypeclicked(node);
        };
     
        Ext.apply(this, {        
          id:'maptypeselector',
          title:' ',tooltip:I18n.predefined_areas.tooltip,  iconCls:'button_maptype32',
          autoScroll:true,plain:true,frame:false,border:false,
          baseCls:'layerlistbg',
          cls:'layerlistbg',
          items:[
            Ext.create('Ext.view.View', {
              title:'Baselayers',
              plain:true,frame:false,border:false,
              cls:'layerlistbg',
              store: mapTypeConfigurationStore,
              tpl: [
                  '<tpl for=".">',
                      '<div class="thumb-wrap" id="{title}">',
                      '<div class="thumb"><img src="{url}" title="{title}"></div>',
                      '<span class="x-editable">{title}</span></div>',
                  '</tpl>',
                  '<div class="x-clear"></div>'
              ],
              trackOver: true,
              overItemCls: 'x-item-over',
              itemSelector: 'div.thumb-wrap',
              emptyText: 'No images to display',
              prepareData:function(item){
                var bbox=[item.bbox[0],item.bbox[1],item.bbox[2],item.bbox[3]];
                var ratio=110/80;
                if((item.bbox[2]-item.bbox[0])/(item.bbox[3]-item.bbox[1])>ratio){
                  var h=(item.bbox[2]-item.bbox[0])/ratio;
                  h=(h-(item.bbox[3]-item.bbox[1]))/2;
                  bbox[1]=item.bbox[1]-h;
                  bbox[3]=item.bbox[3]+h;
                }else{
                  var w=(item.bbox[3]-item.bbox[1])*ratio;

                  w=(w-(item.bbox[2]-item.bbox[0]))/2;
                  
                  bbox[0]=item.bbox[0]-w;
                  bbox[2]=item.bbox[2]+w;
                }
                
                var service = defaultBaselayer.service;
                var name = defaultBaselayer.name;
                if(item.baselayer.service&&item.baselayer.name){
                  service=item.baselayer.service;
                  name=item.baselayer.name;
                }
                item.url=service+'service=WMS&request=GetMap&styles=&width=160&height=120&format=image/png'
                item.url+='&layers='+name,
                item.url+='&version=1.1.1';
                item.url+='&bbox='+bbox[0]+','+bbox[1]+','+bbox[2]+','+bbox[3];
                item.url+='&srs='+item.srs;
                return item;
              },
              listeners: {
                  itemclick: function(dv, node ){
                    maptypeclicked(node);
                  }
              }
            })]
        });
        this.superclass.initComponent.apply(this, arguments);
  }
});