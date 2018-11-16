    //Constructor for custom service panel

    Ext.define('webmapjsext.WMJSExt.ServicePanel', {
    extend   : 'Ext.panel.Panel',
    alias    : 'WMJSExtServicePanel',
    initComponent: function() {
      var _this = this; 
      _this.store = Ext.create('Ext.data.TreeStore', {
        root: {
            text: 'Ext JS',
            id: 'src',
            name:'test',
            expanded: true
        },
        fields: ['text', 'name'],
        folderSort: true,
        sorters: [{
            property: 'text',
            direction: 'ASC'
        }]
      });
      
      _this.selectedLayerName = _this.name;
      
      _this.tree = Ext.create('Ext.tree.Panel', {
        store: _this.store,
        hideHeaders: true,
        rootVisible: false,
    
        fields: ['text', 'name'],
        border:0,
        listeners:{
          itemclick:{
            
            fn:function(grid, record, item, index, e, eOpts){
              if(_this.itemclick){
                _this.selectedLayerName = record.get('name');
                if(record.get('leaf') == true){
                  _this.itemclick(_this,_this.selectedLayerName,_this.service);
                }
              }
              // _this.tree.deselectAll(); TODO
            }
          }
        }
      });
      
      _this.buildTreeFromNodes = function(forceReload){
        if(isDefined(_this.service)==false)return;
        if(_this.service.length == 0)return;     
        _this.setLoading("Reading getCapabilities ...");
        _this.WMSService = WMJSGetServiceFromStore(_this.service, xml2jsonrequestURL);
        var getNodes = function(nodeData) {
          _this.tree.getRootNode().removeAll();
          _this.tree.getRootNode().appendChild(nodeData);
          _this.setLoading(false);
        }
        var failure = function(e){
          error("WMJSExtServicePanel: Unable to do GetCapabilities: "+e);
          
          Ext.Msg.alert("WMJSExtServicePanel","Exception:\n"+e);
          _this.tree.getRootNode().removeAll();
          _this.setLoading(false);
        }
        try{
          _this.WMSService.getNodes(getNodes,failure,forceReload, xml2jsonrequestURL);
        }catch(e){
          failure(e);
        }
        
      };
      
      Ext.apply(this, {
        closable:false,border:false,
        layout:'fit',
    //minHeight:300,
  // maxHeight:500,
    autoScroll:true,
        listeners:{
          afterrender:{
            fn:function(){
              _this.buildTreeFromNodes();
            }
          }
        },
        items:[this.tree]//,          bbar:[{iconCls:'button_refresh',handler:function(){_this.buildTreeFromNodes(true);}}]
      });
      this.superclass.initComponent.apply(this, arguments);
    }
  });
