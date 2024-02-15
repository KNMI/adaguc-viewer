var hipatia_app = function (element, webmapjs) {
  initWMJS();
  element.addClass("autowms_app_container");

  let requestURL = "https://geoservices.knmi.nl/autowms?";

  try {
    requestURL = autowmsURL;
    serverURL = autowmsURL.replace("autowms","adaguc-server")
  } catch (e) {
  }

  var _this = this;
  var baseProj = "/adaguc::autowms/files/"
  var currentData = {};
  var fold_list = [] 
  var proj_list = [] 
  var prevPath = [];

  var enabled = false;

  var errormessage = function (data) {
    var html = createReturnLink();

    element.html(html + JSON.stringify(data));
    $(".autowms_app_fileitem_return")
      .attr("onclick", "")
      .click(function (t) {
        prevPath = [];
        makeFileListRequest("");
      });
  }; 

  function scanDirs(directoryPath){
    $.ajax({
      url: './hipatia/project.ls',
      type: 'GET',
      dataType: 'text',
      success: function (data) {
          datalist=data.split("\n")
          for (var j=0;j<datalist.length;j++){
            if (datalist[j]!=""){  proj_list.push(datalist[j].trim())} 
          } 
          if (! hipatiaURL || hipatiaURL === "") {
            hipatiaURL = proj_list[0] ;
          }
          makeFileListRequest(baseProj+hipatiaURL);
      },
      error: function(xhr, status, error){
        console.log(error)
      },
      cache: false
  })
 }

  var createListXML = function(xmlFile,fold,arr_lay){
    console.log("FOLD",fold)
    $.ajax(
      {
            url : xmlFile,
            dataType: "text",
            success : function (data) 
            {
              lines=data.split("\n")
              let writesF=false
              let writesN=false
              for (var j=0;j<lines.length;j++){
                line=(lines[j])
                //console.log(line)
                if(line.includes("BEGIN "+fold)){writesF=true} 
                if(line.includes("END")){writesF=false}
                if(line.includes("<Layer")){writesN=true} 
                if(line.includes("</Layer")){writesN=false}
                if (writesF && writesN && line.includes("<Name>")){ 
                  nombre=line.substring(line.indexOf(">")+1,line.indexOf("</")) 
                  arr_lay.push(nombre)
                }   
              } 
            },
            error: function(xhr, status, error) {
             
            },
            cache: false
      });
  } 

  var createFile = function (folder) {
    let name = folder;
      return (
        "<span class='autowms_app_fileitem' name='" +
        folder +
        "'>&#128451;&nbsp;" +
        folder +
        "</span>"
      );
  };

  var createLayer = function (data, wmsServiceURL) {
    console.log("WMS",wmsServiceURL)
    // if(data.name == "baselayer" || data.name == "overlay")return "";
    var previewURL =
      wmsServiceURL +
      "&service=WMS&request=getmap&format=image/png&layers=" +
      data.name +
      "&width=400&CRS=EPSG:4326&STYLES=&EXCEPTIONS=INIMAGE&showlegend=true&" +
      //"&width=400&CRS=EPSG:4326&STYLES=&EXCEPTIONS=INIMAGE&showlegend=true&dim_reference_time=*&" +
      Math.random();
    var html =
      "<span class='autowms_app_layeritem' title='Click to add to viewer' name='" +
      data.name +
      "'><span class='autowms_app_layeritem_text'>Layer " +
      data.text +
      " - (" +
      data.name +
      ")</span>";
    html +=
      "<span class='autowms_app_layeritem_image'><img src=\"" +
      previewURL +
      '" /></span>';
    html += "</span>";
    return html;
  };

  var createReturnLink = function (path) {
    var html = "";
    html +=
      "<span class='autowms_app_currentpath'>" +
      "Project: " +
      "<span class='autowms_app_request_container'>" +
      '<input class=\'autowms_app_request_input\' type="text" value="' +
      hipatiaURL +
      '"></input>' +
      '<span class=\'dropdown\'>  <button class=\'dropbtn\'>Search</button> '+
      '<span id="myDropdown" class="dropdown-content">'
    for(var j=0; j<proj_list.length;j++) {
      //html += '<a type="button" href="./index.'+proj_list[j]+'.html" onclick="myfunciton()">'+proj_list[j] +'</a>'
      html += '<a href="index.'+proj_list[j]+'.html">'+proj_list[j] +'</a>'
    }   
      html +='</span></span>'
      html +="  <span class='autowms_app_request_button'>-></span>" +
      "</span>";
    //     html+="<span class='autowms_app_currentpath'>Current folder: /"+prevPath[prevPath.length-1]+"</span>";
    html +=
      "<hr/><span class='autowms_app_currentpath'> Current Data: ./" +
      path +
      "</span>";
    html +=
      '<span class="autowms_app_fileitem_header"><span class="autowms_app_fileitem_return">&#128193;&nbsp;<b>../ (&#8679;)</b></span><span class="autowms_app_fileitem_refresh" name="' +
      path +
      '">&#8635;&nbsp;<b>Refresh</b></span></span>';
    console.log(html)
    return html;
  };

  var init = function () {
    element.html("<div>Initializing...</div>"); 
    scanDirs("./hipatia")
  };

  var makeGetCapabilitiesRequest = function (path) {
    element.html("... working ... ");
    var wmsServiceURL=serverURL+"dataset="+hipatiaURL
    console.log("SERVICES",wmsServiceURL)
    var service = WMJSGetServiceFromStore(wmsServiceURL, xml2jsonrequestURL);
    let arr_=[] 
    
    createListXML(hipatiaURL+".xml",path,arr_)
    console.log("path",path)
    var getcapabilitiesdone = function (layers) {
      var html = "";

      html += createReturnLink(path);

      html += "</span>";

      element.html("... working ... ");

      currentData = {};
      
      for (var j = 0; j < layers.length; j++) {
        if (arr_.includes(layers[j].name) ){ 
          console.log(layers[j].name)
          html += createLayer(layers[j], wmsServiceURL);
          currentData[layers[j].name] = layers[j];
        } 
      }
      console.log("LAYER",currentData)
      element.html(html);
      $(".autowms_app_layeritem")
        .attr("onclick", "")
        .click(function (t) {
          var layerObj = currentData[$(this).attr("name")];
          //console.log(layerObj)
          window.location.hash =
            "addlayer('" + wmsServiceURL + "','" + layerObj.name + "')";
        });
      $(".autowms_app_fileitem_return")
        .attr("onclick", "")
        .click(function (t) {
          makeFileListRequest(prevPath.pop());
        });

      $(".autowms_app_request_button")
        .attr("onclick", "")
        .click(function (t) {
          makeFileListRequest("");
        });

      $(".autowms_app_request_input").keyup(function (e) {
        if (e.keyCode == 13) {
          makeFileListRequest("");
        }
      });

    };


    service.getLayerObjectsFlat(
      getcapabilitiesdone,
      (e) => {
        console.log("HOLA")
        var html = createReturnLink();
        html += "<span class='autowms_app_error_container'>";
        html +=
          "<span class='autowms_app_error_container_header'>Unable to get WMS GetCapabilities</span>";
        html +=
          "<a target='_blank' href=\"" +
          (wmsServiceURL + "service=WMS&request=GetCapabilities") +
          '">' +
          wmsServiceURL +
          "</a>";
        html += "</span>";
        element.html(html);
        $(".autowms_app_fileitem_return")
          .attr("onclick", "")
          .click(function (t) {
            prevPath = [];
            makeFileListRequest("");
          });
      },
      true
    );
  };

  var makeFileListRequest = function (path) {
    console.log("HACIENDO",path)
    if (!path || path === "undefined") {
      path = proj_list[0] ;
    }
    let customInput = $(".autowms_app_request_input").first().val();
    console.log("CUSTOMInput",customInput)
    if (customInput && customInput.length > 0) {
      hipatiaURL = customInput
    }

    var succes = function (data) {
      if (data.error) {
        element.html("Error from server: " + data.error);
        return;
      }
      currentData = {};
      fold_list = [] 
      lines=data.split("\n")
        for (var j=0;j<lines.length;j++){
          line=(lines[j])
          if(line.includes("BEGIN ")){
            folder=line.substring(line.indexOf("BEGIN ")+6,line.indexOf("-->"))
            fold_list.push(folder) 
            } 
        }  
      console.log("Folders", fold_list)
      var html = createReturnLink(path);

      element.html("... working ... ");
      
      fold_list.sort((a, b) => {
        if (a.name <= b.name) return -1;
        if (a.name > b.name) return 1;
        if (a.name == b.name) return 0;
      });

      for (var j = 0; j < fold_list.length; j++) {
        html += createFile(fold_list[j]); 
        currentData[fold_list[j]] = fold_list[j];
      }

      element.html(html);
      $(".autowms_app_fileitem_return")
        .attr("onclick", "")
        .click(function (t) {
          if (prevPath[prevPath.length - 1] === baseProj ){
            makeFileListRequest(baseProj)
          } else { 
            prevPath.pop();
            makeFileListRequest(prevPath[prevPath.length - 1]);
          } 
        });

      $(".autowms_app_fileitem_refresh")
        .attr("onclick", "")
        .click(function (t) {
          var path = $(this).attr("name");
          // element.html("... refreshing "+path+" ... ");
          $(".autowms_app_fileitem").remove();
          $(".autowms_app_layeritem").remove();
          setTimeout(() => {
            makeFileListRequest(path);
          }, 100);
        });

      $(".autowms_app_fileitem")
        .attr("onclick", "")
        .click(function (t) {
          var fileObj = currentData[$(this).attr("name")];
          console.log("FILEOBJ",fileObj)
          makeGetCapabilitiesRequest(fileObj);
        });

      $(".autowms_app_request_button")
        .attr("onclick", "")
        .click(function (t) {
          makeFileListRequest(hipatiaURL);
        });
      $(".autowms_app_request_input").keyup(function (e) {
        if (e.keyCode == 13) {
          makeFileListRequest(hipatiaURL);
        }
      });

      /*for(var j=0; j<proj_list.length;j++){        
          document.getElementById(proj_list[j] ).onclick = function(e) {
            $(".autowms_app_request_input").val=this.id
            makeFileListRequest() 
           };
      } 

      $(".dropbtn")
      .attr("onclick", "")
      .click(function (t) {
        document.getElementById("myDropdown").classList.toggle("show");
        //makeFileListRequest("");
      });
      */


    };

    let url = requestURL + "request=getfiles&path=" + path;

    let xml = hipatiaURL+".xml"
    element.html('... Reading <a href="' + url + '">' + url + "</a> ... ");

    
    try {
      $.ajax(
        {
              url : xml,
              dataType: "text",
              success : succes,
              error: function(xhr, status, error) {
                console.error("Request failed without jsonp, trying jsonp");
                errormessage("Unable extract data list");

              },
              cache: false
        });
    } catch (e) {
      console.error(e);
      errormessage(e);
    }
  };

  this.enable = function () {
    init();

    enabled = true;
  };
  this.disable = function () {
    enabled = false;
  };
  this.resize = function (w, h) {};
};

try {
  WMJSExtApplications["Hipatia"] = hipatia_app;
} catch (e) {}
