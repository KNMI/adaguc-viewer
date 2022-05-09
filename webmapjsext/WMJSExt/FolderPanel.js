Ext.define("webmapjsext.WMJSExt.FolderPanel", {
  extend: "Ext.window.Window",
  alias: "WMJSExtFolderPanel",

  initComponent: function () {
    var _this = this;

    DataFolderModel = Ext.define("DataFolderModel",{
      extend: "Ext.data.Model",
      fields:[
       {name: "title"},
       {name: "abs"}, 
       {name: "thumbnail" },
       {name: "dataChooserConfiguration"},   
      ], 
    });
    
    var store = Ext.create("Ext.data.Store", {
      model: "DataFolderModel",
      data: dataChooserConfigurationFolder,
    });

    //window.alert(dataChooserConfigurationFolder[0].dataChooserConfiguration[0].title);
    //window.alert(dataChooserConfigurationFolder[1].dataChooserConfiguration[0].title);
     
    Ext.apply(this, {
      title: "Selector",
      width: $(window).width() * 0.8,
      height: $(window).height() * 0.8,
      autoDestroy: true,
      modal: true,
      autoScroll: true,
      id: "images-view",
      buttons: [
        {
          scale: "large",
          text: "CLOSE",
          handler: function () {
            _this.close();
          },
        },
      ],
      items: Ext.create("Ext.view.View", {
        store: store,
        tpl: [
          '<tpl for=".">',
          '<div class="thumb-wrap" id="{title}">',
          '<div class="thumb"><img src="{thumbnail}" title="{abs}"></div>',
          '<span class="x-editable">{title}</span></div>',
          "</tpl>",
          '<div class="x-clear"></div>',
        ],
        trackOver: true,
        overItemCls: "x-item-over",
        itemSelector: "div.thumb-wrap",
        emptyText: "No images to display",
        listeners: {
          itemclick: function (dv, node) {
            //title: node.get("title"), 
            //thumbnail: node.get("thumbnail"),
            //console.log(_this.dataPanelClicked);
            dataChooserConfiguration = node.get("dataChooserConfiguration");
            var t = Ext.create("webmapjsext.WMJSExt.DataPanel", {
              dataPanelClicked: _this.dataPanelClicked,
              webMapJS: mainWebmapJS.webMapJS,
              
            });
             
            _this.close();
            t.show();
          },
        },
      }),
    });
    webmapjsext.WMJSExt.FolderPanel.superclass.initComponent.apply(
      this,
      arguments
    );
  },
});
