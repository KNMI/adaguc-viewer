    //Constructor for custom service panel
    Ext.define('webmapjsext.WMJSExt.StylePanel', {
      extend   : 'Ext.panel.Panel',
      alias    : 'WMJSExtStylePanel',
      initComponent: function() {
        var _this = this; 
        _this.buildData = function(){
          var data = [];
          if(!this.WMJSLayerObject.styles)return {name:I18n.default.text,title: I18n.default.text,abstracttext: I18n.no_styles_available.text};
          for(var j=0;j<_this.WMJSLayerObject.styles.length;j++){
            var styleObject = {
              title:_this.WMJSLayerObject.styles[j].title,
              name:_this.WMJSLayerObject.styles[j].name,
              abstracttext:_this.WMJSLayerObject.styles[j].abstracttext,
              legend:_this.WMJSLayerObject.styles[j].legendURL
            };
            data.push(styleObject);
            if(j==0){
              _this.defaultStyle=styleObject;
            }
          }
          
          
          
          return data;
        }
        
        _this.store = Ext.create('Ext.data.Store', {
            fields:[{name:'title',type:'string'},{name:'name',type:'string'},{name:'legend',type:'string'},{name:'abstracttext',type:'string'}]
        });
        _this.grid = Ext.create('Ext.grid.Panel', {
          store: _this.store,
          columns: [
            {header: I18n.title.text,  dataIndex: 'title', width: 180},
            {header: I18n.name.text,  dataIndex: 'name', width: 100},
            {header: I18n.description.text,  dataIndex: 'abstracttext', flex: true}
          ],
          //hideHeaders: true,
          border:0,
          listeners:{
            itemclick:{
              fn:function(grid, record, item, index, e, eOpts){
                if(_this.itemclick){
                  _this.itemclick(_this,{name:record.get('name'),title:record.get('title')});
                }
              }
            },
            itemmouseenter:{
              fn:function(grid, record, item, index, e, eOpts){
                
                  var legend = record.get('legend');
                  if(!_this.legendWindow)
                  {
                    _this.legendWindow =  Ext.create('Ext.window.Window',{
                        header:false,
                        layout: 'auto',
                        //html:'<img src="./webmapjs/img/ajax-loader.gif"/>',
                        width:200,minHeight:300,autoDestroy:false,closeAction:'hide',autoScroll:false
                    });
                  }
                  //var xy=Ext.EventObject.getXY();
                  var x= _this.getPosition()[0]+_this.getWidth()+10;
                  var y= _this.getPosition()[1];
                  _this.legendWindow.showAt([x,y]);
                  _this.legendWindow.update('<img class="legendimage" src="'+legend+'&transparent=true"/>');
              }
            },
            itemmouseleave:{
              fn:function(){
                 _this.legendWindow.hide();
              }
            }
          }
        });
        
        _this.loadStyles = function(layerObject){
          _this.WMJSLayerObject = layerObject;
          _this.store.loadRawData(_this.buildData());
        }
        Ext.apply(this, {
          closable:true,border:false,
          layout:'fit',
          maxHeight:300,
          autoScroll:true,
          items:[this.grid]
        });
        this.superclass.initComponent.apply(this, arguments);
      }
    });