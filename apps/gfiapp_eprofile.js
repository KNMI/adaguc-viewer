var gfiapp_eprofile = function (element, webmapjs) {
  var _this = this;

  var gfiWindows = [];
  var enabled = true;

  var init = function (w, h) {
    element.html('<div id="info"></div><div class="gfiapp_eprofile">bla</div>');

    var onupdatebbox_eprofile = function (newBBOX, t) {
      var gfiWindowNr = t.id;
      for (var j = 0; j < gfiWindows.length; j++) {
        var profileMap = gfiWindows[j].getWebMapJS();
        profileMap.suspendEvent("onupdatebbox");
        if (j != gfiWindowNr) {
          if (
            newBBOX.equals(gfiWindows[j].getWebMapJS().getProjection().bbox) ==
            false
          ) {
            profileMap.zoomTo(newBBOX);
            gfiWindows[j].updateBBOX(newBBOX);
          }
        }
        profileMap.resumeEvent("onupdatebbox");
      }
    };

    var onloadingcomplete_eprofile = function (newBBOX, t) {
      var gfiWindowNr = t.id;
      for (var j = 0; j < gfiWindows.length; j++) {
        var profileMap = gfiWindows[j].getWebMapJS();
        profileMap.suspendEvent("onupdatebbox");
        profileMap.suspendEvent("onloadingcomplete");

        if (j != gfiWindowNr) {
          profileMap.draw();
        }
        profileMap.resumeEvent("onloadingcomplete");
        profileMap.resumeEvent("onupdatebbox");
      }
    };

    var onlayeradd = function () {
      var graphElements = element.find(".gfiapp_eprofile");
      graphElements.empty();
      var layers = webmapjs.getLayers();
      for (var j = 0; j < layers.length; j++) {
        var layer = layers[j];
        var graphArea = jQuery("<div />", { css: { margin: 8 } });
        graphElements.append(graphArea);
        gfiWindows[j] = new GFITimeElevationWindow(graphArea);
        gfiWindows[j].getWebMapJS().addLayer(layer);
        gfiWindows[j].getWebMapJS().getListener().id = j; //Shortcut, assign which window id corresponds to this listener, used in callback (t.id)
        gfiWindows[j]
          .getWebMapJS()
          .addListener("onupdatebbox", onupdatebbox_eprofile, true);
        gfiWindows[j]
          .getWebMapJS()
          .addListener("onloadingcomplete", onloadingcomplete_eprofile, true);
      }
      _this.resize(w, h);
    };

    onlayeradd();

    var ondimchange = function () {
      var firstProfileMap = gfiWindows[0].getWebMapJS();
      var newBBOX = firstProfileMap.getProjection().bbox.clone();
      var timeWidth =
        firstProfileMap.getProjection().bbox.right -
        firstProfileMap.getProjection().bbox.left;
      var newLeft = new Date(
        webmapjs.getDimension("time").currentValue
      ).getTime();
      newBBOX.left = newLeft;
      newBBOX.right = newLeft + timeWidth;
      for (var j = 0; j < gfiWindows.length; j++) {
        var profileMap = gfiWindows[j].getWebMapJS();
        profileMap.zoomTo(newBBOX);
        //profileMap.draw();
      }
    };

    //     console.log("Adding listeners");
    webmapjs.addListener("ondimchange", ondimchange, true);
    webmapjs.addListener("onlayeradd", onlayeradd, true);

    var ondimchange_profile = function () {
      var profileMap = gfiWindows[0].getWebMapJS();
      var newBBOX = profileMap.getProjection().bbox.clone();
      $("#info").html(
        "Displaying dates " +
          webmapjs.dateToISO8601(new Date(newBBOX.left)) +
          " till " +
          webmapjs.dateToISO8601(new Date(newBBOX.right))
      );
    };

    gfiWindows[0]
      .getWebMapJS()
      .addListener("onloadingcomplete", ondimchange_profile, true);

    webmapjs.enableInlineGetFeatureInfo(false);
  };

  this.enable = function (w, h) {
    init(w, h);
    enabled = true;
  };

  this.disable = function () {
    enabled = false;
    webmapjs.enableInlineGetFeatureInfo(true);
  };

  this.resize = function (w, h) {
    for (var j = 0; j < gfiWindows.length; j++) {
      gfiWindows[j].setSize(w, h / gfiWindows.length);
    }
    for (var j = 0; j < gfiWindows.length; j++) {
      //gfiWindows[j].getWebMapJS().draw();
    }
  };

  _this.enable();
};

try {
  WMJSExtApplications["EProfile"] = gfiapp_eprofile;
} catch (e) {}
