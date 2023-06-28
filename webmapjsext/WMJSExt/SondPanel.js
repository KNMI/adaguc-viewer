Ext.define("webmapjsext.WMJSExt.SondPanel", {
  extend: "Ext.window.Window",
  alias: "WMJSExtSondPanel",

  initComponent: function () {
    var _this = this;

    //window.alert(dataChooserConfigurationFolder[0].dataChooserConfiguration[0].title);
    //window.alert(dataChooserConfigurationFolder[1].dataChooserConfiguration[0].title);
    DataFolderModel = Ext.define("DataSondModel",{
      extend: "Ext.data.Model",
      fields:[
       {name: "iURL"}   
      ], 
    });
    
    var store = Ext.create("Ext.data.Store", {
      model: "DataSondModel",
    });

    console.log("{iURL}") 

    Ext.apply(this, {
      title: "Sondeo",
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
      items:
        Ext.create('Ext.panel.Panel', {
            collapsible: true,
            closable: true,
        //src: "apps/gfiapp.html",
            split: true,
            header: false,
            width: 600,
            autoScroll: false,
            layout: "fit",
            itemId: "Sond",
            title: "Sond",
            height: 512,
            html: '<div style="height:100%;width:100%" id="mitdd">"Hello World"</div>',
        //renderTo: Ext.getBody()
        })
    });
      
    webmapjsext.WMJSExt.SondPanel.superclass.initComponent.apply(
      this,
      arguments
    );
  },
});
