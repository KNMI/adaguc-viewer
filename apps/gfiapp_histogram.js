var gfiapp_histogram = function (element, webmapjs) {
  var plotData = function (datatoplot, elementid) {
    $("#" + elementid).empty();
    $("#" + elementid).append(
      "<div style='height=240px;border=2px solid blue;' class='chart'>a</div>"
    );
    // $('#' + elementid).append("<div style='height=40px;border=2px solid red;' class='controls gfiapp_histogram_export_to_csv_button'>b</div>");

    let graph = $("#" + elementid).find(".chart");
    // let controls = $('#' + elementid).find('.controls');
    graph.html("graph");
    // controls.button({label:'Export to CSV'}).click(function(){
    //   console.log('Export to CSV');
    //   let csvExport = '';
    //   let data = datatoplot.datatoplot;
    //   for (let line=0;line<data[0].length;line++){
    //     for (let j=0;j<data.length;j++) {
    //       if (j > 0)csvExport+=';';
    //       csvExport += JSON.stringify(data[j][line]);
    //     }
    //     csvExport += '\n\r';
    //   }
    //   const link = document.createElement('a');

    //   link.setAttribute('download', `export.csv`);
    //   link.setAttribute('href', encodeURI(`data:text/csv;charset=utf-8,${csvExport}`));
    //   console.log('Clicking link');
    //   document.body.appendChild(link);
    //   link.click();
    //   link.remove();
    // });
    console.log(datatoplot.datatoplot);
    const columns = [
      ["x", ...datatoplot.datatoplot["interval"]],
      ["value", ...datatoplot.datatoplot["quantity"]],
    ];
    //   const columns =[
    //     ['x', 30, 50, 100, 230, 300, 310],
    //     ['data1', 30, 200, 100, 400, 150, 250],
    //     ['data2', 130, 300, 200, 300, 250, 450]
    // ]
    console.log(columns);
    var chart = c3.generate({
      bindto: graph.get(0),
      data: {
        x: "x",
        columns: columns,
      },
      bar: {
        width: {
          ratio: 0.5, // this makes bar width 50% of length between ticks
        },
        // or
        //width: 100 // this makes bar width 100px
      },
    });
  };

  var date_sort_asc = function (date1, date2) {
    if (date1 > date2) return 1;
    if (date1 < date2) return -1;
    return 0;
  };

  var containsSameDate = function (k, myarray) {
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

  var parseADAGUCGFIToPlotData = function (gfidata, elementid) {
    console.log(gfidata);
    const label = "";
    var timeFormat = "%Y-%m-%d %H:%M";
    const keys = Object.keys(gfidata);
    console.log(keys);
    const firstkey = keys[0];
    const datatoplot = gfidata[firstkey];
    plotData(
      { datatoplot: datatoplot, ylabel: label, timeFormat: timeFormat },
      elementid
    );
  };

  var loadDataForURL = function (mURL, elementid) {
    //console.log(mURL);
    mURL += "&JSONP=?";
    $.ajax({
      type: "GET",
      url: mURL,
      dataType: "jsonp",
      cache: false,
      success: function (dataWeGotViaJsonp) {
        try {
          parseADAGUCGFIToPlotData(dataWeGotViaJsonp, elementid);
        } catch (e) {
          console.error(e);
          $("#" + elementid).html(
            "Sorry! An error occurred while parsing JSON data: [" + e + "]"
          );
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        $("#" + elementid).html(
          "Sorry! An error occurred while receiving JSON data from the server: [" +
            errorThrown +
            "]"
        );
        console.log("Error " + errorThrown);
      },
    });
  };

  var _this = this;

  var enabled = true;
  var currentOptions = [];
  currentOptions.set = false;
  var pointOnMapClicked = function (options) {
    if (enabled == false) return;
    currentOptions.x = options.x;
    currentOptions.y = options.y;
    currentOptions.set = true;
    var lalo = webmapjs.getLatLongFromPixelCoord({
      x: options.x,
      y: options.y,
    });

    $("#chart").html('<img src="./img/ajax-loader.gif" alt="Loading..."/>');
    var layers = webmapjs.getLayers();
    if (!isDefined(layers)) {
      $("#info").html("No valid data received:<br/>" + data);
      return;
    }
    var html = "";

    html +=
      "timeseries graph for location [" +
      Math.round(lalo.x * 100) / 100 +
      "," +
      Math.round(lalo.y * 100) / 100 +
      "]<br/>";
    //html+="shift key: "+data.shiftKeyPressed+"<br/>";
    //console.log("START");
    $("#chart").empty();
    for (var j = 0; j < layers.length; j++) {
      var getMapURL = webmapjs.buildWMSGetMapRequest(layers[j]);

      var urlObject = composeUrlObjectFromURL(getMapURL);
      var GETMAPURL = urlObject.location + "?";

      for (key in urlObject.kvp) {
        var value = urlObject.kvp[key];
        //console.log("A"+key+"="+value);
        if (key == "request") value = "GetHistoGram";
        //console.log("B"+key+"="+value);
        GETMAPURL += key + "=" + URLEncode(value) + "&";
      }

      console.log(GETMAPURL);
      //GETMAPURL+="figwidth="+($( window ).width()-20)+"&";
      //GETMAPURL+="figheight=200";
      //html+='<img src="'+GETMAPURL+'"/><br/>';
      $("#chart").append("<div class='chartstyle' id='chart" + j + "'></div>");
      $("#chart" + j).html(
        '<img src="./img/ajax-loader.gif" alt="Loading..."/>'
      );
      loadDataForURL(GETMAPURL, "chart" + j);
    }
    $("#info").html(html);
  };
  webmapjs.addListener("mouseclicked", pointOnMapClicked, true);

  var init = function () {
    element.html(
      '<div id="info"></div><div id="chart" class="gfiapp_histogram"></div>'
    );
    $("#info").html("Click on the map to create a histogram graph.");
    console.log("init");
    webmapjs.enableInlineGetFeatureInfo(false);
    webmapjs.setMapModeZoomBoxIn();

    webmapjs.addListener(
      "beforemapdragend",
      () => {
        return true;
      },
      true
    );
  };

  this.enable = function () {
    init();
    enabled = true;
  };
  this.disable = function () {
    enabled = false;
    webmapjs.enableInlineGetFeatureInfo(true);
    currentOptions.set = false;
  };
  this.resize = function (w, h) {
    console.log("w=" + w);
    $("#chart").width(w);
    if (currentOptions.set) {
      pointOnMapClicked(currentOptions);
    }
  };

  _this.enable();
};

try {
  WMJSExtApplications["Histogram mode"] = gfiapp_histogram;
} catch (e) {}
