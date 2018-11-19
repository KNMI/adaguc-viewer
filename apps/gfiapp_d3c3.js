var gfiapp_d3c3 = function(element, webmapjs) {
  var plotData = function(datatoplot, elementid) {
    $('#' + elementid).empty();
    $('#' + elementid).append("<div style='height=240px;border=2px solid blue;' class='chart'>a</div>");
    $('#' + elementid).append("<div style='height=40px;border=2px solid red;' class='controls gfiapp_d3c3_export_to_csv_button'>b</div>");

    let graph = $('#' + elementid).find('.chart');
    let controls = $('#' + elementid).find('.controls');
    graph.html('graph');
    controls.button({label:'Export to CSV'}).click(function(){
      console.log('Export to CSV');
      let csvExport = '';
      let data = datatoplot.datatoplot;
      for (let line=0;line<data[0].length;line++){
        for (let j=0;j<data.length;j++) {
          if (j > 0)csvExport+=';';
          csvExport += JSON.stringify(data[j][line]);
        }
        csvExport += '\n\r';
      }
      const link = document.createElement('a');
      
      link.setAttribute('download', `export.csv`);
      link.setAttribute('href', encodeURI(`data:text/csv;charset=utf-8,${csvExport}`));
      console.log('Clicking link');
      document.body.appendChild(link);
      link.click();
      link.remove();
    });
    
    var chart = c3.generate({
      bindto: graph.get(0),
      data: {
        x: 'x',
        x_format: '%Y%m%d',
        columns: datatoplot.datatoplot,
        types: {
          x: 'area'
        }
      },
      axis: {
        x: {
          type: 'timeseries',
          tick: {
            //format : "%e %b %Y @ %H:%M:%S" // https://github.com/mbostock/d3/wiki/Time-Formatting#wiki-format
            format: datatoplot.timeFormat
          }
        },
        y: {
            label: datatoplot.ylabel
        }
      },
      zoom: {
        enabled: true
      },
      subchart: {
        show: false
      }
    });
  };

  var date_sort_asc = function(date1, date2) {
    if (date1 > date2) return 1;
    if (date1 < date2) return -1;
    return 0;
  };


  var containsSameDate = function(k, myarray) {
    var i = 0;
    for (i = 0; i < myarray.length; i++) {
      try {
        if (myarray[i].getTime() === k.getTime()) {
          return i;
        }
      } catch (e) {}
    }
    return -1;
  };


  var parseADAGUCGFIToPlotData = function(gfidata, elementid) {
    var ndims = 1;
    if (typeof(gfidata[0].dims) != 'string') {
      ndims = gfidata[0].dims.length;
    }

    var newFormat = [];

    var assembleData = function(keynames, obj, data) {
      var name = obj.name;
      //console.log(name);

      var newFormatDate = ['x'];
      var newFormatValue = [name + " " + keynames];
      //var newFormatValue = [keynames];
      for (var key in data) {
        var date = d3.time.format("%Y-%m-%dT%H:%M:%SZ").parse(key);
        var value = parseFloat(data[key]);
        newFormatDate.push(date);
        newFormatValue.push(value);
      }
      newFormat.push({
        date: newFormatDate,
        value: newFormatValue
      });
    }

    var iterateDataObject = function(depth, gfidata, dataObject, keynames) {
      //console.log(depth+" and " + ndims);
      if (ndims == 1) {
        assembleData("", gfidata, dataObject);
      } else {
        if (depth + 2 < ndims) {
          for (d in dataObject) {
            //console.log("d["+d+"]");

            iterateDataObject(depth + 1, gfidata, dataObject[d], keynames + "[" + d + "]");

          }
        } else
          for (d in dataObject) {
            //console.log("Plot "+d);
            assembleData("[" + d + "]", gfidata, dataObject[d]);
            //assembleData("" + d + "", gfidata, dataObject[d]);
          }
      }
    }
    for (var j = 0; j < gfidata.length; j++) {
      iterateDataObject(0, gfidata[j], gfidata[j].data, "");
      // iterateDataObject(0, gfidata[j], gfidata[j].data, "");//TODO CHECK WHY THIS WAS ADDED TWICE
    }



    var sortDataObject = function(datevalobj) {
      var newComposedDates = [];
      //console.log("datevalobj.length="+datevalobj.length);
      var numberOfObjects = datevalobj.length;
      //console.log("Start");
      for (var j = 0; j < numberOfObjects; j++) {
        var dateObj = datevalobj[j].date;
        //console.log("dateObj.length="+dateObj.length);
        for (var i = 1; i < dateObj.length; i++) {
          var value = dateObj[i];
          var index = containsSameDate(value, newComposedDates);
          if (index == -1) {
            newComposedDates.push(value);
          }
        }
      }

      newComposedDates.sort(date_sort_asc);
      newComposedDates.unshift("x");
      ////console.log("Nu dit: "+newComposedDates.length);

      var dataObjects = [];
      for (var i = 0; i < numberOfObjects; i++) {
        dataObjects.push([]);
      }


      for (var j = 0; j < numberOfObjects; j++) {
        dataObjects[j].push(datevalobj[j].value[0]);
        for (var i = 1; i < newComposedDates.length; i++) {
          var index = containsSameDate(newComposedDates[i], datevalobj[j].date);
          // //console.log(i+" and "+index);
          if (index == i) {
            ////console.log("FITS"+datevalobj[j].date[i]);
            var value = datevalobj[j].value[index];
            //if(value>10000)value= NaN;
            if (value == "nodata") value = NaN;
            dataObjects[j].push(parseFloat(value));
          } else {
            //console.log("FITSN"+datevalobj[j].date[i]+"index="+index);
            dataObjects[j].push(NaN);
          }
        }
        ////console.log("dataObjects pushed:"+dataObjects[j].length);
      }

      ////console.log("There are dates: "+newComposedDates.length);
      var a = [];

      a.push(newComposedDates);
      for (var j = 0; j < numberOfObjects; j++) {
        a.push(dataObjects[j]);
      }
      return a;
    };
    var datatoplot = sortDataObject(newFormat);
    var label = gfidata[0].name;
    if(gfidata[0].units){
      label+=" in "+gfidata[0].units;
    }
    var timeFormat = "%Y-%m-%d %H:%M";
    plotData({datatoplot:datatoplot,ylabel:label,timeFormat:timeFormat}, elementid);
  };


  var loadDataForURL = function(mURL, elementid) {
    //console.log(mURL);
    mURL += "&JSONP=?";
    $.ajax({
      type: 'GET',
      url: mURL,
      dataType: 'jsonp',
      cache: false,
      success: function(dataWeGotViaJsonp) {
        try {
          parseADAGUCGFIToPlotData(dataWeGotViaJsonp, elementid);
        } catch (e) {
          $('#' + elementid).html("Sorry! An error occurred while parsing JSON data: [" + e + "]");
        }
      },
      error: function(jqXHR, textStatus, errorThrown) {
        $('#' + elementid).html("Sorry! An error occurred while receiving JSON data from the server: [" + errorThrown + "]");
        console.log("Error " + errorThrown);
      }
    });
  };




  var _this = this;


  var enabled = true;
  var currentOptions = [];
  currentOptions.set = false;
  var pointOnMapClicked = function(options) {
    if(enabled == false)return;
    currentOptions.x = options.x;
    currentOptions.y = options.y;
    currentOptions.set = true;
    var lalo = webmapjs.getLatLongFromPixelCoord({
      x: options.x,
      y: options.y
    });

    $("#chart").html("<img src=\"./img/ajax-loader.gif\" alt=\"Loading...\"/>");
    var layers = webmapjs.getLayers();
    if (!isDefined(layers)) {
      $("#info").html("No valid data received:<br/>" + data);
      return;
    }
    var html = "";

    html += "timeseries graph for location [" + Math.round(lalo.x * 100) / 100 + "," + Math.round(lalo.y * 100) / 100 + "]<br/>";
    //html+="shift key: "+data.shiftKeyPressed+"<br/>";
    //console.log("START");
    $("#chart").empty();
    for (var j = 0; j < layers.length; j++) {
      var gfiUrl = webmapjs.getWMSGetFeatureInfoRequestURL(layers[j], options.x, options.y);
  
      var urlObject = composeUrlObjectFromURL(gfiUrl);
      var GFIURL = urlObject.location + "?";
   
      for (key in urlObject.kvp) {
        var value = urlObject.kvp[key];
        //console.log("A"+key+"="+value);
        if (key == 'info_format') value = 'application/json';
        if (key == 'time') value = '1000-01-01T00:00:00Z/3000-01-01T00:00:00Z';
        if(key == 'dim_member')value = '*';
        if(key == 'dim_ensemble_member')value = '*';
        //console.log("B"+key+"="+value);
        GFIURL += (key + "=" + URLEncode(value)) + "&";
      }
    
      //console.log(GFIURL);
      //GFIURL+="figwidth="+($( window ).width()-20)+"&";
      //GFIURL+="figheight=200";
      //html+='<img src="'+GFIURL+'"/><br/>';
      $("#chart").append("<div class='chartstyle' id='chart" + j + "'></div>")
      $("#chart" + j).html("<img src=\"./img/ajax-loader.gif\" alt=\"Loading...\"/>");
      loadDataForURL(GFIURL, 'chart' + j);
    }
    $("#info").html(html);

  }
  webmapjs.addListener('mouseclicked', pointOnMapClicked, true);
  
  var init = function(){
    element.html('<div id="info"></div><div id="chart" class="gfiapp_d3c3"></div>');
    $("#info").html("Click on the map to create a timeseries graph.");
    console.log('init');
    webmapjs.enableInlineGetFeatureInfo(false);
  };
  
  this.enable = function(){
    init();
    enabled = true;
  };
  this.disable = function(){
    enabled = false;
    webmapjs.enableInlineGetFeatureInfo(true);
    currentOptions.set = false;
  };
  this.resize = function(w,h){
    console.log("w="+w);
    $("#chart").width(w);
    if(currentOptions.set){
      pointOnMapClicked(currentOptions);
    }
  };
  
  _this.enable();
};

try{
  WMJSExtApplications["Time series mode"]=gfiapp_d3c3;
}catch(e){}
