Ext.define('webmapjsext.WMJSExt.WCSPanel', {
  extend   : 'Ext.panel.Panel',
  alias    : 'WCSPanel',
  initComponent: function() {
    var _this = this;
      var Linkproperties  = function(){
        this.srs = undefined;
        this.bbox = undefined;
        this.coverages = [];
        
      };
      
      var linkProperties = new Linkproperties();
      //console.log(this.WMJSLayer);
      linkProperties.srs=this.WMJSLayer.parentMaps[0].getProjection().srs;
      linkProperties.bbox=this.WMJSLayer.parentMaps[0].getProjection().bbox.toString();
      var coverage = new WMJSCoverage({
        service:this.WMJSLayer.WMJSService.service,
        name:this.WMJSLayer.name
      });
      linkProperties.coverages.push(coverage);
      coverage.dimensions = this.WMJSLayer.dimensions;
 

      
   
      var failed = function(msg){
        alert('failed:\n '+msg);
      };
      
      var selectedProjection = "EPSG:4326";
      var selectedFormat = "AAIGRID";
      var selectedBBOX = "-180,-90,180,90";
      
      var projectionStore = Ext.create('Ext.data.Store', {
        fields:['title', 'srs', 'bbox'],
        data:{'items':[]},proxy: {type: 'memory',reader: {type: 'json',root: 'items'}}
      });

      
      var projectionsGrid = Ext.create('Ext.grid.Panel', {
          border:false,
          store: projectionStore,
          columns: [
              { text: 'Title',  dataIndex: 'title' ,flex:1},
              { text: 'ESPG Code', dataIndex: 'srs' }
          ],
          listeners:{
            select:{
              fn:function(id,record){
                var bbox = record.get('bbox');
                selectedProjection = record.get('srs');
                //console.log(bbox);
                //console.log(selectedProjection);
                selectedBBOX = bbox;
                midPanel.getComponent('column2').getComponent('areaPanel').getComponent('bboxtop').setValue(bbox.split(",")[3]);
                midPanel.getComponent('column2').getComponent('areaPanel').getComponent('bbox').getComponent('bboxwest').setValue(bbox.split(",")[0]);
                midPanel.getComponent('column2').getComponent('areaPanel').getComponent('bbox').getComponent('bboxeast').setValue(bbox.split(",")[2]);
                midPanel.getComponent('column2').getComponent('areaPanel').getComponent('bboxbottom').setValue(bbox.split(",")[1]);
                
                var bboxWidth = Math.abs(selectedBBOX.split(",")[2]-selectedBBOX.split(",")[0]);
                var bboxHeight = Math.abs(selectedBBOX.split(",")[3]-selectedBBOX.split(",")[1]);
                var c=linkProperties.coverages[0];
                
                midPanel.getComponent('column2').getComponent('gridproperties').getComponent('field').getComponent('xresolution').setValue(bboxWidth/c.width);
                midPanel.getComponent('column2').getComponent('gridproperties').getComponent('field').getComponent('yresolution').setValue(bboxHeight/c.height);
          
                //midPanel.getComponent('column2').getComponent('gridproperties').getComponent('field').getComponent('xresolution').setValue(c.cellsizeX);
                //midPanel.getComponent('column2').getComponent('gridproperties').getComponent('field').getComponent('yresolution').setValue(c.cellsizeY);
                buildGetCoverageRequest();
              }
            }
          }
      });
        
  
      var formatsStore = Ext.create('Ext.data.Store', {
        fields:['title', 'format'],
        data:{'items':[]},proxy: {type: 'memory',reader: {type: 'json',root: 'items'}}
      });

      var formatsGrid = Ext.create('Ext.grid.Panel', {
          border:false,
          store: formatsStore,
          columns: [
              
              { text: I18n.format.text, dataIndex: 'format' },
              { text: I18n.title.text,  dataIndex: 'title' ,flex:1}
          ],
          listeners:{
            select:{
              fn:function(id,record){
                selectedFormat = record.get('format');
                buildGetCoverageRequest();
              }
            }
          }
      });
        
      
   
      
      
      linkProperties.onReady = function(){
        projectionsGrid.setLoading(false);
        var _this = this;
        var c = _this.coverages[0];
        for(var j=0;j<c.supportedProjections.length;j++){
          var description = c.supportedProjections[j].srs;
          try{
            description = epsgDescriptionLookup[c.supportedProjections[j].srs];
          }catch(e){}
          if(!isDefined(description))description=c.supportedProjections[j].srs;
          projectionStore.add({title:description,srs:c.supportedProjections[j].srs,bbox:c.supportedProjections[j].bbox});
        }
        
        //midPanel.getComponent('column2').getComponent('gridproperties').getComponent('field').getComponent('xresolution').setValue(c.cellsizeX);
        //midPanel.getComponent('column2').getComponent('gridproperties').getComponent('field').getComponent('yresolution').setValue(c.cellsizeY);


        
        var rowIndex = projectionStore.find('srs',  c.nativeCRS);
        if(rowIndex==-1){
          rowIndex = projectionStore.find('srs',  "EPSG:4326");
        }
        if(rowIndex==-1){
          rowIndex = 0;
        }
        projectionsGrid.getView().select(rowIndex);
     
          
        projectionStore.add({title:'Viewer window projection and area',srs:_this.srs,bbox:_this.bbox});
        
        midPanel.getComponent('column2').getComponent('gridproperties').getComponent('field').getComponent('rasterwidth').setValue(c.width);
        midPanel.getComponent('column2').getComponent('gridproperties').getComponent('field').getComponent('rasterheight').setValue(c.height);
        
     
        
      
        //Dimensions
        var dimPanel = midPanel.getComponent('column3').getComponent('dimensionPanel');
        for(var j=0;j<c.dimensions.length;j++){
          dimPanel.add({xtype:'textfield',fieldLabel:c.dimensions[j].name,value:c.dimensions[j].currentValue,labelWidth:40,padding:'30',width:200,itemId:'dimtextfield_'+c.dimensions[j].name,listeners:{change:{fn:function(){buildGetCoverageRequest();}}}});
        }
        
        //Formats
        for(var j=0;j<c.formats.length;j++){
          var description = c.formats[j];
          var key = c.formats[j].toUpperCase();
          try{
            description = formatDescriptionLookup[key];
          }catch(e){}
          if(!isDefined(description))description=c.formats[j];
          formatsStore.add({title:description,format:c.formats[j]});
          if(key == "AAIGRID"){
            formatsGrid.getView().select(j);    
          }
        }
        buildGetCoverageRequest();
        
        topPanel.update('<table style="margin:5px;"><tr><td><b>Coverage:</b></td><td>'+c.name+'</td></tr><tr><td><b>Title:</b></td><td>'+c.title+'</td></tr><tr><td><b>Description:</b></td><td>'+c['abstract']+'</td></tr></table>');
      }
      
      
      
      var leftPanel = Ext.create('Ext.panel.Panel',{
         region: 'west',border:true,width:100
      });
 
      var midPanel = Ext.create('Ext.panel.Panel',{
        region: 'center',border:false,
        layout: {
            type: 'hbox',
           align: 'stretch'
        }, defaults:{
          border:true
        },
        items: [
          {xtype:'panel',flex:2,title: I18n.coordinate_reference_system.text,itemId:'projectionPanel',layout:'fit',items:[projectionsGrid],border:true,split:true},
          {xtype:'panel',layout:'border',
            itemId:'column2',
             split:true,
             autoScroll:true,
             border:false,
             flex:1,
            items:[{
              itemId:'areaPanel',
                height:'50%',
                xtype: 'panel',
                title: I18n.area_bounding_box.text,
                region:'center',
                autoScroll:true,
                layout: {
                    type: 'vbox',
                    // The total column count must be specified here
                    columns: 3
                },
                items:[
                  {xtype:'textfield',fieldLabel: I18n.north.text,itemId:'bboxtop',labelWidth:20,padding:'30 5 5 130',width:180,listeners:{change:{fn:function(){buildGetCoverageRequest();}}}},
                  {xtype:'panel',itemId:'bbox',border:false,layout:'hbox',items:[{xtype:'textfield',fieldLabel: I18n.west.text,itemId:'bboxwest',labelWidth:30,padding:'15 0 0 15' ,width:180,listeners:{change:{fn:function(){buildGetCoverageRequest();}}}},{xtype:'textfield',fieldLabel:I18n.east.text,itemId:'bboxeast',labelWidth:30,padding:'15 0 0 15',width:180,listeners:{change:{fn:function(){buildGetCoverageRequest();}}}}]},
                  {xtype:'textfield',fieldLabel: I18n.south.text,itemId:'bboxbottom',labelWidth:40,padding:'15 5 5 110',width:200,listeners:{change:{fn:function(){buildGetCoverageRequest();}}}}
                ]
              },
              {
                xtype:'panel',region:'south',height:'50%',title:'Grid properties',split:true,autoScroll:true,
                itemId:'gridproperties',
                items:{ 
                  xtype:'fieldcontainer',
                  itemId:'field',
                  items:[
                    {xtype:'radiofield',boxLabel:'Cell size',name:'resolution',checked:true,itemId:'radioselectcellsize',padding:'15 15 15 15',
                      handler:function(o,checked){
                        if(checked === true){
                          midPanel.getComponent('column2').getComponent('gridproperties').getComponent('field').getComponent('rasterwidth').disable();
                          midPanel.getComponent('column2').getComponent('gridproperties').getComponent('field').getComponent('rasterheight').disable();
                          midPanel.getComponent('column2').getComponent('gridproperties').getComponent('field').getComponent('xresolution').enable();
                          midPanel.getComponent('column2').getComponent('gridproperties').getComponent('field').getComponent('yresolution').enable();
                        }
                        buildGetCoverageRequest();
                      }
                    },
                    {xtype:'textfield',fieldLabel:'X resolution',padding:'0 0 0 40',itemId:'xresolution',width:170,listeners:{change:{fn:function(){buildGetCoverageRequest();}}}},
                    {xtype:'textfield',fieldLabel:'Y resolution',padding:'0 0 0 40',itemId:'yresolution',width:170,listeners:{change:{fn:function(){buildGetCoverageRequest();}}}},
                    {xtype:'radiofield',boxLabel:'Raster size',name:'resolution',padding:15,
                      handler:function(o,checked){
                        if(checked === true){
                          
                          midPanel.getComponent('column2').getComponent('gridproperties').getComponent('field').getComponent('rasterwidth').enable();
                          midPanel.getComponent('column2').getComponent('gridproperties').getComponent('field').getComponent('rasterheight').enable();
                          midPanel.getComponent('column2').getComponent('gridproperties').getComponent('field').getComponent('xresolution').disable();
                          midPanel.getComponent('column2').getComponent('gridproperties').getComponent('field').getComponent('yresolution').disable();
                        }
                      }  
                    },
                    {xtype:'textfield',fieldLabel:'Raster Width',padding:'0 0 0 40',disabled:true,itemId:'rasterwidth',width:170,listeners:{change:{fn:function(){buildGetCoverageRequest();}}}},
                    {xtype:'textfield',fieldLabel:'Raster Height',padding:'0 0 0 40',disabled:true,itemId:'rasterheight',width:170,listeners:{change:{fn:function(){buildGetCoverageRequest();}}}}
                  ]
                }
              }
            ]},{
              itemId:'column3',
              xtype:'panel',layout:'border',border:false,
              split:true,
              flex:1,
              items:[{
                xtype: 'panel',
                region:'center',
                height:'50%',
                itemId:'dimensionPanel',
                title: I18n.dimensions.text,
                autoScroll:true
              },{
                xtype:'panel',
                split:true,
                autoScroll:true,
                region:'south',
                height:'50%',
                title: I18n.formats.text,
                items:[formatsGrid]
              }]
            }
          ]
      });
        
      var centerPanel = Ext.create('Ext.panel.Panel',{
         layout: 'border',
         region: 'center',border:true,width:300,
         items:[midPanel]
      });
      
      var linkPanel = Ext.create('Ext.panel.Panel',{
        border:false,padding:20
      });
      
      var bottomPanel = Ext.create('Ext.panel.Panel',{
         title:'GetCoverage request link',
         
         region: 'south',border:true,height:100,layout:'fit',items:[linkPanel]
      });
      
      var topPanel = Ext.create('Ext.panel.Panel',{
         region: 'north',border:false,height:80,frame:false
      });
      
      Ext.apply(this, {
      
      
        layout: 'border',padding:0,frame:false,border:true,
        items:[centerPanel,topPanel,bottomPanel]
      });
      projectionsGrid.setLoading(true);
      
      
      var buildGetCoverageRequest = function(){
       
        var service = linkProperties.coverages[0].service;
        service = WMJScheckURL(service);
        var coverage = linkProperties.coverages[0].name;
        
        var bbox = midPanel.getComponent('column2').getComponent('areaPanel').getComponent('bbox').getComponent('bboxwest').getValue()+        ","+midPanel.getComponent('column2').getComponent('areaPanel').getComponent('bboxbottom').getValue()+        ","+midPanel.getComponent('column2').getComponent('areaPanel').getComponent('bbox').getComponent('bboxeast').getValue()+        ","+midPanel.getComponent('column2').getComponent('areaPanel').getComponent('bboxtop').getValue();
       
        if(service.indexOf("?")==-1){
          service+="?";
        }else{
          if(service.charAt(service.length - 1)!='&'){
            service+="&";
          }
        }
        
        
        
        
        var url = service+"SERVICE=WCS&REQUEST=GetCoverage&COVERAGE="+coverage+"&CRS="+URLEncode(selectedProjection)+"&FORMAT="+selectedFormat+"&BBOX="+bbox;
        
        if(midPanel.getComponent('column2').getComponent('gridproperties').getComponent('field').getComponent('radioselectcellsize').getValue() == true){
          url+="&RESX="+midPanel.getComponent('column2').getComponent('gridproperties').getComponent('field').getComponent('xresolution').getValue();
          url+="&RESY="+midPanel.getComponent('column2').getComponent('gridproperties').getComponent('field').getComponent('yresolution').getValue();
        }else{
          url+="&WIDTH="+midPanel.getComponent('column2').getComponent('gridproperties').getComponent('field').getComponent('rasterwidth').getValue();
          url+="&HEIGHT="+midPanel.getComponent('column2').getComponent('gridproperties').getComponent('field').getComponent('rasterheight').getValue();
        }
        
        
        for(var j=0;j<linkProperties.coverages[0].dimensions.length;j++){
          try{
            var dimPanel = midPanel.getComponent('column3').getComponent('dimensionPanel');
            var dimValue = dimPanel.getComponent('dimtextfield_'+linkProperties.coverages[0].dimensions[j].name).getValue();
            var dimName = linkProperties.coverages[0].dimensions[j].name;
            dimName = dimName.toUpperCase();
            if(dimName != 'ELEVATION' && dimName!= 'TIME'){
              dimName="DIM_"+dimName;
            }
            url+="&"+dimName+"="+dimValue;
          }catch(e){ }
        }
        //dimtextfield_'+c.dimensions[j].name
        linkPanel .update('<a target="_blank" href="'+url+'">'+url+'</a>');
        return selectedProjection;
      };
      WCJSRequest(linkProperties.coverages[0].service,linkProperties.coverages[0].name,function(jsonDoc){
        linkProperties.coverages[0] = parseDescribeCoverage(jsonDoc,coverage);
        
        //linkProperties.coverages[0].dimensions=this.WMJSLayer.dimensions;
        
        linkProperties.onReady()
        
      },failed);
      webmapjsext.WMJSExt.WCSPanel.superclass.initComponent.apply(this, arguments);
    }
    
  
});
  
  
