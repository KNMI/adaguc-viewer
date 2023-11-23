//Constructor for custom animation panel
Ext.define('webmapjsext.WMJSExt.AnimationPanel',{
  extend:'Ext.panel.Panel', 
  alias:'WMJSExtAnimationPanel',
  requires:['Ext.form.field.ComboBox','Ext.form.field.Picker','Ext.form.field.Trigger','Ext.layout.container.Form'],
  initComponent: function() {
    var _this = this; 
    

    // The data store holding the states
    var layerStore = Ext.create('Ext.data.Store', {
        fields: [
            {type: 'string', name: 'name'},
            {type: 'string', name: 'title'},
            {type: 'object', name: 'wmjslayer'}
            
        ]
    });
    
    var dimensionStore = Ext.create('Ext.data.Store', {
        fields: [
            {type: 'string', name: 'name'},
          
            {type: 'object', name: 'wmjsdimension'}
            
        ]
    });

    var loadLayersInStore = function(){
      //console.log(_this)
      var layers = _this.mappanel.webMapJS.getLayers();
      layerStore.removeAll();
      for(var j=0;j<layers.length;j++){
        layerStore.add({name:layers[j].service+layers[j].name,title:layers[j].title,wmjslayer:layers[j]});
      }
    };
    
    var loadLayers = function(){
      loadLayersInStore();
      if(layerStore.getCount()>0){
        _this.getComponent('layerpanel').getComponent('layercombo').setValue(layerStore.getAt(0));
        layerSelected(layerStore.getAt(0).get('wmjslayer'));
      }
    };
    
    var layerSelected = function(layerObject){
      if(!isDefined(layerObject))return;
      _this.selectedLayer = layerObject;
      var dimcombo = _this.getComponent('dimensionpanel').getComponent('dimensioncombobox');
      dimcombo.disable();
    
      dimensionStore.removeAll();
      for(var j=0;j<layerObject.dimensions.length;j++){
        dimensionStore.add({name:layerObject.dimensions[j].name,wmjsdimension:layerObject.dimensions[j]});
      }
    
      if(dimensionStore.getCount()>0){
        dimcombo.setValue(dimensionStore.getAt(0).get('name'));
        dimensionSelected(dimensionStore.getAt(0).get('wmjsdimension'));
        dimcombo.enable();
      }
    };
    
    var dimensionSelected = function(dimension){
       if(!isDefined(dimension))return;
      _this.getComponent('dimensionvaluespanel').getComponent('dimensioncurrentvalue').setValue(dimension.getValue());
      _this.dimension = dimension;
      //alert(dimension.getValue());
    };
    
    var stopAnimation = function(){
      //alert(_this.currentValue);
      if(isDefined(_this.dimensionName)&&isDefined(_this.currentValue)){
        
        _this.mappanel.webMapJS.stopAnimating();
        //_this.mappanel.webMapJS.abort();
        _this.mappanel.webMapJS.setDimension(_this.dimensionName,_this.currentValue);
        _this.mappanel.webMapJS.draw("AnimationPanel::stop");
      }
      
    };

    Ext.apply(this, {
      //layout:'form',
      border:false,
      frame:true,
      items:[{
        xtype:'panel',
        itemId:'layerpanel',
        layout:'border',
        frame:true,
        border:false,
        margin:3,
        height:36,
        items:[{
          margin:3,
          xtype:'combobox',
          itemId:'layercombo',
          region:'center',
          fieldLabel: I18n.select_layer.text,
          labelWidth:110,
          displayField: 'title',
          valuefield:'name',
         
          store: layerStore,
          queryMode: 'local',
          listeners:{select:{fn:function(combo,records){
            var layerObject = records[0].get('wmjslayer');
            layerSelected(layerObject);
           
          }}}
        },{
          xtype:'button',
          region:'east',
          width:23,
           
          iconCls:'button_refresh',
          handler:function(){
            loadLayersInStore();
          }
        }]
      },{
        xtype:'panel',
        itemId:'dimensionpanel',
        layout:'fit',
        frame:true,
        border:false,
        margin:3,
        height:36,
     
    
          items:[{
            margin:3,
            xtype:'combobox',
            itemId:'dimensioncombobox',
            region:'center',
            fieldLabel: I18n.select_dimension.text,
            labelWidth:110,
            disabled:true,
            store:dimensionStore,
            displayField: 'name',
            valuefield:'name',
            queryMode: 'local',
            listeners:{select:{fn:function(combo,records){dimensionSelected(records[0].get('wmjsdimension'));}}}
        
        }]
      },{
        xtype:'panel',
        itemId:'dimensionvaluespanel',
        frame:true,
        border:false,
        margin:3,
        layout:'border',
         height:36,
        items:[{xtype:'label',text: I18n.start_at.text+':',width:110,region:'west',margin:3},{
          itemId:'dimensioncurrentvalue',
          xtype:'textfield',
          region:'center',
          frame:false,
          border:false,
          margin:3
         
        },{
          xtype:'button',
          region:'east',
          width:23,
          iconCls:'button_refresh',
          handler:function(){
            if(layerStore.getCount()>0){
              layerSelected(_this.selectedLayer);
            }
          }
        }]
          
      },{
        xtype:'panel',
        layout:'border',
        itemId:'numberofstepspanel',
        border:false,
        frame:true,
        height:36,
        margin:3,
        items:[
          {xtype:'label',text:I18n.number_of_steps.text+':',width:110,region:'west',margin:3},
          {
            xtype:'numberfield',
            itemId:'numberofstepsnumberfield',
            region:'center',
            value:12
        }]
      },{
        xtype:'panel',
        layout:'border',
        itemId:'delaypanel',
        border:false,
        frame:true,
        height:36,
        margin:3,
        items:[
          {xtype:'label',text:I18n.delay_ms.text+':',width:110,region:'west',margin:3},
          {
            xtype:'numberfield',
             itemId:'delaynumberfield',
            region:'center',
            value:300
          }
        ]
      }
      ],
      buttons:[
        {text:I18n.stop.text,handler:stopAnimation},{text:I18n.start.text,handler:function(){
        var v = _this.getComponent('dimensionvaluespanel').getComponent('dimensioncurrentvalue').getValue();
        var numberOfSteps = _this.getComponent('numberofstepspanel').getComponent('numberofstepsnumberfield').getValue();
        var delayMs = _this.getComponent('delaypanel').getComponent('delaynumberfield').getValue();
        //alert(numberOfSteps +' and '+delayMs);
        var startIndex = _this.dimension.getIndexForValue(v);
        var maxNumberOfAnimationsSteps = _this.mappanel.webMapJS.getMaxNumberOfAnimations();
        if(numberOfSteps>maxNumberOfAnimationsSteps){
          numberOfSteps = maxNumberOfAnimationsSteps;
           _this.getComponent('numberofstepspanel').getComponent('numberofstepsnumberfield').setValue(numberOfSteps);
        }
        numberOfSteps--;
        if(numberOfSteps<0)numberOfSteps = 0;
             
        var stopIndex = startIndex+numberOfSteps;
        if(stopIndex>=_this.dimension.size()){
          var d=_this.dimension.size() - (stopIndex+1);
          //alert(d);
          startIndex+=d;
          stopIndex+=d;
        }
        if(startIndex<0){startIndex = 0;}
        if(stopIndex<0){stopIndex = 0;}
        var dates = [];
        for(var j=startIndex;j<stopIndex+1;j++){
          dates.push({name:_this.dimension.name, value:_this.dimension.getValueForIndex(j)});
        }
        if(_this.mappanel.webMapJS.isAnimating == false){
          if (_this.dimension.linked === false){
            alert("La capa debe estar sincronizada para crear la animación")
          } 
          _this.dimensionName = _this.dimension.name;
          _this.currentValue = _this.dimension.currentValue;
        }
        _this.mappanel.webMapJS.setAnimationDelay(delayMs);
        _this.mappanel.webMapJS.draw(dates);
        
      }}],
      listeners:{
        afterrender:{
          fn:function(){
            loadLayers();
          }
        },
        destroy:{
          fn:function(){
            stopAnimation();
          }
        }
      }
    });
    //this.callParent(arguments);
    webmapjsext.WMJSExt.AnimationPanel.superclass.initComponent.apply(this, arguments);
  
  }
});
