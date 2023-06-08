var histograms = [];

var gfiapp_histogram = function (element, webmapjs) {
  var plotData = function (datatoplot, elementid) {
    $("#" + elementid).empty();
    $("#" + elementid).append(
      "<div style='height=240px;border=2px solid blue;' class='chart'>a</div>"
    );
    let graph = $("#" + elementid).find(".chart");
    graph.html("graph");

    histograms.push([datatoplot.ylabel, ...datatoplot.datatoplot["quantity"]]);

    const columns = [["x", ...datatoplot.datatoplot["interval"]]];
    for (let j = 0; j < histograms.length; j++) {
      columns.push(histograms[j]);
    }
    // console.log(columns);pointOnMapClicked
    var chart = c3.generate({
      bindto: graph.get(0),
      data: {
        x: "x",
        columns: columns,
      },
    });
  };
  var parseADAGUCGFIToPlotData = function (gfidata, elementid) {
    var timeFormat = "%Y-%m-%d %H:%M";
    const keys = Object.keys(gfidata);
    const firstkey = keys[0];
    const label = "layer" + "_" + histograms.length + "_" + firstkey;
    const datatoplot = gfidata[firstkey];
    plotData(
      { datatoplot: datatoplot, ylabel: label, timeFormat: timeFormat },
      elementid
    );
  };

  var loadDataForURL = function (mURL, elementid) {
    mURL += "&JSONP=?";
    $.ajax({
      type: "GET",
      url: mURL,
      dataType: "jsonp",
      cache: false,
      success: function (dataWeGotViaJsonp) {
        try {
          // console.log(dataWeGotViaJsonp);
          parseADAGUCGFIToPlotData(dataWeGotViaJsonp, elementid);
        } catch (e) {
          console.error(e);

          // parseADAGUCGFIToPlotData(
          //   { error: { quantity: [], interval: [0] } },
          //   elementid
          // );
          if (histograms.length === 0) {
            $("#" + elementid).html("Error occured....");
          }
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        // $("#" + elementid).html(
        //   "Sorry! An error occurred while receiving JSON data from the server: [" +
        //     errorThrown +
        //     "]"
        // );
        // parseADAGUCGFIToPlotData(
        //   { error: { quantity: [0], interval: [0] } },
        //   elementid
        // );
        console.log("Error " + errorThrown);
        if (histograms.length === 0) {
          $("#" + elementid).html("Error occured....");
        }
      },
    });
  };

  var _this = this;

  var enabled = true;
  var currentOptions = [];
  currentOptions.set = false;
  var pointOnMapClicked = function (options) {
    // console.log("pointclickec");
    histograms = [];
    if (enabled == false) return;

    currentOptions.set = true;
    var lalo = { x: 1, y: 1 };

    $("#chart").html('<img src="./img/ajax-loader.gif" alt="Loading..."/>');
    histograms = [];
    var layers = webmapjs.getLayers();
    if (!isDefined(layers)) {
      $("#info").html("No valid data received:<br/>" + data);
      return;
    }
    var html = "";

    html +=
      "Histogram graph for area [" +
      Math.round(options.left * 100) / 100 +
      "," +
      Math.round(options.bottom * 100) / 100 +
      "," +
      Math.round(options.right * 100) / 100 +
      "," +
      Math.round(options.top * 100) / 100 +
      "]<br/>";
    $("#chart").empty();
    for (var j = 0; j < layers.length; j++) {
      // console.log(j);
      if (layers[j].enabled) {
        var getMapURL = webmapjs.buildWMSGetMapRequest(layers[j]);

        var urlObject = composeUrlObjectFromURL(getMapURL);
        var GETMAPURL = urlObject.location + "?";

        for (key in urlObject.kvp) {
          var value = urlObject.kvp[key];
          if (key == "request") value = "GetHistoGram";

          if (key == "bbox") {
            const version = urlObject.kvp["version"];
            const crs = urlObject.kvp["crs"];
            let swapLatLon = false;
            if (version === "1.3.0" && crs === "EPSG:4326") {
              swapLatLon = true;
            }
            if (!swapLatLon) {
              value =
                options.left +
                "," +
                options.bottom +
                "," +
                options.right +
                "," +
                options.top;
            } else {
              value =
                options.bottom +
                "," +
                options.left +
                "," +
                options.top +
                "," +
                options.right;
            }
          }
          GETMAPURL += key + "=" + URLEncode(value) + "&";
        }

        const chartNumber = 0;
        $("#chart").append(
          "<div class='chartstyle' id='chart" + chartNumber + "'></div>"
        );
        $("#chart" + j).html(
          '<img src="./img/ajax-loader.gif" alt="Loading..."/>'
        );
        // console.log("load");
        loadDataForURL(GETMAPURL, "chart" + chartNumber);
      }
    }
    $("#info").html(html);
  };

  var init = function () {
    element.html(
      '<div id="info"></div><div id="chart" class="gfiapp_histogram"></div>'
    );
    $("#info").html("Click on the map to create a histogram graph.");

    webmapjs.enableInlineGetFeatureInfo(false);
    webmapjs.setMapModeZoomBoxIn();
    if (_this.initialized !== true) {
      webmapjs.addListener(
        "beforezoomend",
        (args) => {
          // console.log(args.left, args.bottom, args.right, args.top);
          pointOnMapClicked(args);
          return false;
        },
        true
      );
    }
    _this.initialized = true;
  };

  this.enable = function () {
    init();
    enabled = true;
  };
  this.disable = function () {
    // console.log("disable", _this.initialized);
    enabled = false;
    webmapjs.enableInlineGetFeatureInfo(true);
    webmapjs.setMapModePan();
    webmapjs.removeListener("beforezoomend");
    webmapjs.divZoomBox.style.display = "none";
    currentOptions.set = false;
  };
  this.resize = function (w, h) {
    // console.log("w=" + w);
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
