var gfiapp_point_interest = function(element, webmapjs) {
  var _this = this;

  var gfiWindows = [];
  var enabled = true;
  
  var featureInfoCallback  = function(data) {
    console.log('Callback');
  };
  
  var init = function(w,h){

    var fullPointInterest = {lon: null, lat: null, name: null}

    setflags = function() {
      if (!(fullPointInterest.lon && fullPointInterest.lat && fullPointInterest.name)) {
        if (!fullPointInterest.name) { $('#webmapjs_point_interest_name').css('border', '2px solid red'); }
        if (!fullPointInterest.lon) { $('#webmapjs_point_interest_lon').css('border', '2px solid red'); }
        if (!fullPointInterest.lat) { $('#webmapjs_point_interest_lat').css('border', '2px solid red'); }
        return;
      }

      lon = fullPointInterest.lon;
      lat = fullPointInterest.lat;
      name = fullPointInterest.name;

      fullUrl = knmiFlagURL + 'file=' + pointInterestFileName + '&location=' + lon + ',' + lat + '&name=' + name;

      /* Called when a point has succesfully been added*/
      function success( obj ) {
        if (obj.status === 'OK') {
          var button = Ext.getCmp('webmapjs_add_point_interest');
          button.getEl().dom.style.background = '#BCED91';
          webmapjs.getImageStore().clear();
          webmapjs.draw("draw");
        } else {
          var button = Ext.getCmp('webmapjs_add_point_interest');
          button.getEl().dom.style.background = '#FF4040';
        }
      }

      $.ajax({
        type: "GET",
        url: fullUrl,
        dataType: "xml",
        success: success,
        dataType: "jsonp",
        contentType: "application/jsonp",
        jsonpCallback: "resultSetFlag",
        crossDomain: true
      });
    };

    delete_flag = function() {
      Ext.MessageBox.show({
          title: I18n.delete_title_confirm.text,
          msg: I18n.are_you_sure.text,
          buttons: Ext.MessageBox.YESNO,
          icon: Ext.MessageBox.WARNING,
          fn: function(btn){
              if(btn == 'yes'){
                name = $('.webmapjs_label_selected_point_interest').text();
                fullUrl = knmiFlagURL + 'file=' + pointInterestFileName + '&name=' + name;

                function success( obj ) {
                  var button = Ext.getCmp('webmapjs_delete_point_interest');
                  button.getEl().dom.style.background = '#BCED91';
                  webmapjs.getImageStore().clear();
                  webmapjs.draw();

                }

                $.ajax({
                  type: "GET",
                  url: fullUrl,
                  dataType: "xml",
                  success: success,
                  dataType: "jsonp",
                  contentType: "application/jsonp",
                  jsonpCallback: "resultSetFlag",
                  crossDomain: true
                });
              } else {
                  return;
              }
          }
      });
    }
    
    element.html("<label class='webmapjs_label_point_interest' for='webmapjs_div_point_interest'>" + I18n.add_point_interest_abstract.text + "</label>" +
      "<div id='webmapjs_div_point_interest' class='webmapjs_div_point_interest'>" + 
      "<input type='number' step='0.01' id='webmapjs_point_interest_lat' class='webmapjs_input_point_interest' placeholder='Lat:'/>" +
      "<input type='number' step='0.01' id='webmapjs_point_interest_lon' class='webmapjs_input_point_interest' placeholder='Lon:'/>" +
      "<input type='text' id='webmapjs_point_interest_name' class='webmapjs_input_point_interest' placeholder='" + I18n.insert_name.text + "' /></div>" +
      "<div class='webmapjs_point_added'></div><div class='webmapjs_point_not_added'></div>" + 
      "<label class='webmapjs_label_selected_point_interest_abstract' for='webmapjs_div_selected_point_interest'>" + I18n.selected_flag.text + "</label>" +
      "<div id='webmapjs_div_selected_point_interest' class='webmapjs_div_selected_point_interest'>" + 
      "<label class='webmapjs_label_selected_point_interest'>" + I18n.default_selected_flag.text + "</label></div>");

    Ext.create('Ext.Button', {
      text: I18n.add_point_interest.text,
      id: 'webmapjs_add_point_interest',
      tooltip: I18n.add_flag_tooltip.tooltip,
      renderTo: 'webmapjs_div_point_interest',
      handler: function() {
          setflags();
      }
    });

    Ext.create('Ext.Button', {
      text: I18n.delete.text,
      id: 'webmapjs_delete_point_interest',
      tooltip: I18n.delete_selected_flag_tooltip.tooltip,
      renderTo: 'webmapjs_div_selected_point_interest',
      cls: 'webmapjs_button_delete_point_interest',
      handler: function() {
          delete_flag();
      }
    });

    $('#webmapjs_point_interest_name, #webmapjs_point_interest_lon, #webmapjs_point_interest_lat').keypress(function (e) {
      if (e.which == 13) {
        setflags();
        return false;
      }
    });
    
    var onupdatebbox_point_interest = function(newBBOX,t){
      var gfiWindowNr = t.id;
      for(var j=0;j<gfiWindows.length;j++){
        var profileMap = gfiWindows[j].getWebMapJS();
        profileMap.suspendEvent("onupdatebbox");    
        if(j!=gfiWindowNr){
          if(newBBOX.equals( gfiWindows[j].getWebMapJS().getProjection().bbox)==false){
            profileMap.zoomTo(newBBOX);
            gfiWindows[j].updateBBOX(newBBOX);
          }
        }
        profileMap.resumeEvent("onupdatebbox");
      }
    };
    
    // var onloadingcomplete_point_interest = function(newBBOX,t){
    //   var gfiWindowNr = t.id;
    //   for(var j=0;j<gfiWindows.length;j++){
    //     var profileMap = gfiWindows[j].getWebMapJS();
    //     profileMap.suspendEvent("onupdatebbox");
    //     profileMap.suspendEvent("onloadingcomplete");    
        
    //     if(j!=gfiWindowNr){
          
    //         profileMap.draw();
          
    //     }
    //     profileMap.resumeEvent("onloadingcomplete");    
    //     profileMap.resumeEvent("onupdatebbox");
    //   }
    // };
    
    var onlayeradd = function(){
      var graphElements = element.find(".gfiapp_point_interest");
      graphElements.empty();
      var layers =webmapjs.getLayers();
      for(var j=0;j<layers.length;j++){
        var layer = layers[j];
        var graphArea = jQuery('<div />', {css:{margin:8}});
        graphElements.append(graphArea);
        graphArea.html("LAYER "+layer.service);

      }
      _this.resize(w,h);
    };
    
    onlayeradd();
    
    // var ondimchange = function(){
    //   var firstProfileMap = gfiWindows[0].getWebMapJS();
    //   var newBBOX = firstProfileMap.getProjection().bbox.clone();
    //   var timeWidth=firstProfileMap.getProjection().bbox.right-firstProfileMap.getProjection().bbox.left;
    //   var newLeft = new Date(webmapjs.getDimension("time").currentValue).getTime();
    //   newBBOX.left= newLeft;
    //   newBBOX.right=newLeft+timeWidth;
    //   for(var j=0;j<gfiWindows.length;j++){
    //     var profileMap = gfiWindows[j].getWebMapJS();
    //     profileMap.zoomTo(newBBOX);
    //     //profileMap.draw();
    //   }
    // };
    
//     console.log("Adding listeners");
//    webmapjs.addListener("ondimchange",ondimchange,true);
    webmapjs.addListener("onlayeradd",onlayeradd,true);
   var pointOnMapClicked = function(options) {
      if(enabled == false)return;
      var lalo = webmapjs.getLatLongFromPixelCoord({
        x: options.x,
        y: options.y
      });
      fullPointInterest.lon = lalo.x;
      fullPointInterest.lat = lalo.y;
      $('#webmapjs_point_interest_lon').val(lalo.x.toFixed(5));
      $('#webmapjs_point_interest_lat').val(lalo.y.toFixed(5));

      // Reset the ( if there is any ) red border.
      $('#webmapjs_point_interest_lon, #webmapjs_point_interest_lat').css('border', '1px solid grey');

      function errormessage ( jqXHR, textStatus, errorThrown ) {
        debug(textStatus + ', ' + errorThrown);
      }
      
      function succes( obj ) {
        if(obj[1] && obj[1].data !== 'nodata') {
          $('.webmapjs_label_selected_point_interest').text(obj[1].data);
          $('.webmapjs_button_delete_point_interest').css('display', 'inline');
        } else {
          $('.webmapjs_label_selected_point_interest').text(I18n.default_selected_flag.text);
          $('.webmapjs_button_delete_point_interest').css('display', 'none');
        }
      };

    

      var layers =webmapjs.getLayers();
      var url = webmapjs.getWMSGetFeatureInfoRequestURL(layers[0], options.x, options.y).replace('&INFO_FORMAT=text/html', '&INFO_FORMAT=application/json') + '&JSONP=featureInfoCallback';

      $.ajax({
        dataType: 'jsonp',
        jsonpCallback: 'featureInfoCallback',
        type: 'GET',
        cache: false,
        url: url,
        success: succes,
        error:errormessage
      });

    };

    webmapjs.addListener('mouseclicked', pointOnMapClicked, true);

    $('#webmapjs_point_interest_name').on('input', function(e) {
      onChangeEvents('name', e);
    });
    $('#webmapjs_point_interest_lon').on('input', function(e) {
      onChangeEvents('lon', e);
      changeMapPin();
    });
    $('#webmapjs_point_interest_lat').on('input', function(e) {
      onChangeEvents('lat', e);
      changeMapPin();
    });

    this.onChangeEvents = function(variableName, e) {
      // Reset the colors of the buttons.
      var button = Ext.getCmp('webmapjs_add_point_interest');
      button.getEl().dom.style.background = '';

      var button = Ext.getCmp('webmapjs_delete_point_interest');
      button.getEl().dom.style.background = '';
      switch(variableName) {
        case 'name':
          fullPointInterest.name = e.target.value; 
          break;
        case 'lon':
          fullPointInterest.lon = e.target.value; 
          break;
        case 'lat':
          fullPointInterest.lat = e.target.value; 
          break;
      }
      $('#webmapjs_point_interest_' + variableName).css('border', '1px solid grey');
    }

    this.changeMapPin = function() {
      webmapjs.positionMapPinByLatLon({x: fullPointInterest.lon, y: fullPointInterest.lat });
    }

    
    // var ondimchange_profile = function(){
    //   var profileMap = gfiWindows[0].getWebMapJS();
    //   var newBBOX = profileMap.getProjection().bbox.clone();
    //   $("#info").html("Displaying dates "+webmapjs.dateToISO8601(new Date(newBBOX.left))+" till "+webmapjs.dateToISO8601(new Date(newBBOX.right)));
    // };
    
    //gfiWindows[0].getWebMapJS().addListener("onloadingcomplete",ondimchange_profile,true);
    
    webmapjs.enableInlineGetFeatureInfo(false);

  };
  
  this.enable = function(w,h){
    init(w,h);
    enabled = true;
  };
  
  this.disable = function(){
    enabled = false;
    webmapjs.enableInlineGetFeatureInfo(true);
  };
  
  this.resize = function(w,h){
    for(var j=0;j<gfiWindows.length;j++){
      gfiWindows[j].setSize(w,h/gfiWindows.length);
    }
    for(var j=0;j<gfiWindows.length;j++){
      //gfiWindows[j].getWebMapJS().draw();
    }
    
  };
  
  _this.enable();
};

WMJSExtApplications["Points of interest"]=gfiapp_point_interest;
