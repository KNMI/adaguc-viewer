var autowms_app = function(element, webmapjs) {

  element.addClass("autowms_app_container");
  
  let requestURL = 'http://localhost:8090//adaguc-services/autowms?';
  
  try{
    requestURL = autowmsURL;
  }catch(e){
  }
    
  var _this = this;

  var currentData = {};
  
  var prevPath = [];  
  
  var enabled = false;
  
  var errormessage = function(data){
    console.log('errormessage called');
    var html = createReturnLink();
     
    element.html(html+JSON.stringify(data));
    $(".autowms_app_fileitem_return").attr('onclick','').click(function(t){
      prevPath = [];        
      makeFileListRequest("");
    });
  }
  
  var createFile = function(data){
    let name = data.name;
    if (data.leaf) {
      return "<span class='autowms_app_fileitem' name='"+data.name+"'>&#128451;&nbsp;" + name + "</span>";
    } else {
      return "<span class='autowms_app_fileitem autowms_app_diritem' name='"+data.name+"'>&#128448;&nbsp;" + name + "</span>";
    }
  };
  
  var createLayer = function(data,wmsServiceURL){
    // if(data.name == "baselayer" || data.name == "overlay")return "";
    var previewURL = wmsServiceURL+"&service=WMS&request=getmap&format=image/png&layers="+data.name+"&width=400&CRS=EPSG:4326&STYLES=&EXCEPTIONS=INIMAGE&showlegend=true&"+Math.random();
    var html =  "<span class='autowms_app_layeritem' title='Click to add to viewer' name='"+data.name+"'><span class='autowms_app_layeritem_text'>Layer " + data.text +" - ("+data.name+")</span>";
    html+="<span class='autowms_app_layeritem_image'><img src=\""+previewURL+"\" /></span>";
    html += "</span>";
    return html;
  };
  
  var createReturnLink = function(data, path){
    var wmsServiceURL = undefined;
    var name = (data && data.name) || "";
    var html = "";
    html+="<span class='autowms_app_currentpath'>"+
      "AutoWMS link: "+
      "<span class='autowms_app_request_container'>" +
        "<input class='autowms_app_request_input' type=\"text\" value=\""+requestURL+"\"></input>"+
      "  <span class='autowms_app_request_button'>-></span>"+
      "</span>";
    //     html+="<span class='autowms_app_currentpath'>Current folder: /"+prevPath[prevPath.length-1]+"</span>";
    html+="<hr/><span class='autowms_app_currentpath'>Current folder: ./"+path+"</span>";
    html += "<span class=\"autowms_app_fileitem_header\"><span class=\"autowms_app_fileitem_return\">&#128448;&nbsp;<b>../ (&#8679;)</b></span><span class=\"autowms_app_fileitem_refresh\" name=\""+path+"\">&#8635;&nbsp;<b>Refresh</b></span></span>" ;
    return html;
  };
  
  
  var init = function(){
    element.html('<div>Initializing...</div>');
    makeFileListRequest("");
  }
  
  var makeGetCapabilitiesRequest = function(data, path) {
    element.html("... working ... ");
    console.log("WMS!"+path, data);
    var wmsServiceURL = path;//data.adagucserver+"source="+URLEncode(path) + "&";
  
    console.log(wmsServiceURL);
    var service = WMJSgetServiceFromStore(wmsServiceURL);
    var getcapabilitiesdone = function(layers){
      console.log(layers);
      // prevPath.push(path);
      
      var html = "";

      html += createReturnLink(data, path);
      console.log(service);
      
      
      html+="<span class='autowms_app_serviceabstract'><b>"+service.title.replace(new RegExp('!', 'g'),"<br/>")+"</b><hr/>"+service.abstract.replace(new RegExp('!', 'g'),"<br/>");
      
      if(wmsServiceURL){
        html+="<hr/>WMS: <a target=\"_blank\" href=\""+wmsServiceURL+"&service=WMS&request=GetCapabilities\">"+wmsServiceURL+"</a>";
        if(wmsServiceURL.split("?").length>1){
          let kvps = WMJSKVP(wmsServiceURL.split("?")[1]);
          console.log(kvps);
          let dapURL = wmsServiceURL.split("?")[0].replace("adagucserver","adagucopendap/");
          dapURL = dapURL.replace(/([^:]\/)\/+/g, "$1");
          if(kvps.source){
            dapURL+=kvps.source;
          }
          if(kvps.dataset){
            dapURL+=kvps.dataset + "/";
          }
          html+="<hr/>OpenDAP: <span class='autowms_app_opendaplinks'><a target=\"_blank\" href=\""+dapURL+"\">"+dapURL+"</a>";
          html+="<a target=\"_blank\" href=\""+dapURL+".das\">DAS</a>";
          html+="<a target=\"_blank\" href=\""+dapURL+".dds\">DDS</a></span>";
        }
      }
      
      html+="</span>";
      
      element.html("... working ... ");
      
      currentData = {};
      for(var j=0;j<layers.length;j++){
        html+=createLayer(layers[j],wmsServiceURL);
        currentData[layers[j].name]=layers[j];
      }
      

      
      element.html(html);
      $(".autowms_app_layeritem").attr('onclick','').click(function(t){
        var layerObj = currentData[$(this).attr('name')];
        console.log(wmsServiceURL, layerObj);
        window.location.hash="addlayer('"+wmsServiceURL+"','"+layerObj.name+"')";
//               var layer = new WMJSLayer({
//                 service:wmsServiceURL,
//                 name:layerObj.name
//               });
//               layer.onReady = function(){
//                 webmapjs.draw();
//               };
//               webmapjs.addLayer(layer);
      });
      $(".autowms_app_fileitem_return").attr('onclick','').click(function(t){
        console.log('t');
        
        makeFileListRequest(prevPath.pop());
      });
      
      /* Bind refresh for GetCapabilities overview */
      $(".autowms_app_fileitem_refresh").attr('onclick','').click(function(t){
        console.log('refresh fileitem');
        // makeFileListRequest(prevPath[prevPath.length-1]);
        var path = $(this).attr('name');
        // element.html("... refreshing "+path+" ... ");
        $(".autowms_app_fileitem").remove();
        $(".autowms_app_layeritem").remove();
        setTimeout(()=>{
          makeGetCapabilitiesRequest(data, path);
        }, 100);
      });

      
      $('.autowms_app_request_button').attr('onclick','').click(function(t){makeFileListRequest("");});
      $('.autowms_app_request_input').keyup(function(e){if(e.keyCode == 13){makeFileListRequest("");}});
      
    };
    service.getLayerObjectsFlat(getcapabilitiesdone,(e) => {
      var html = createReturnLink();
      html+="<span class='autowms_app_error_container'>";
      html+="<span class='autowms_app_error_container_header'>Unable to get WMS GetCapabilities</span>";
      html+="<a target='_blank' href=\"" + (wmsServiceURL + "service=WMS&request=GetCapabilities") + "\">"+wmsServiceURL+"</a>";
      html+="</span>";
      element.html(html);
      $(".autowms_app_fileitem_return").attr('onclick','').click(function(t){
        prevPath = [];        
        makeFileListRequest("");
      });
    }, true);
  };
  
  var makeFileListRequest = function(path){
    
    if(!path || path === 'undefined'){
      path = "";
    }
    let customInput = $(".autowms_app_request_input").first().val();
    console.log(customInput);
    if (customInput && customInput.length > 0){
      requestURL = customInput.trim().split('?')[0];
      if (!requestURL.endsWith('?')){
        requestURL += "?";
      }
      console.log("Setting requestURL to " + requestURL);
    }
    
    console.log("makeFileListRequest ["+path+"]", requestURL);
    
    var succes = function(data){
      if (data.error){
        element.html("Error from server: " + data.error);
        return;
      }
      currentData= {}
      console.log(data);
      if (prevPath[prevPath.length-1] !== path) {
        console.log('pushing new path');
        prevPath.push(path);
      }else{
        console.log('not pushing new path');
      }
      console.log('path = '+path);
      console.log('prevPath = ', prevPath);
      
      var html = createReturnLink(data, path);
      element.html("... working ... ");
      
      data.result.sort((a, b) => {
        if (a.leaf === b.leaf) return 0;
        if (a.leaf === true) return 1;
        if (b.leaf === true) return -1;
      });
      
      for(var j=0;j<data.result.length;j++){
        html+=createFile(data.result[j]);
        currentData[data.result[j].name]=data.result[j];
      }
      //console.log(currentData);
      element.html(html);
      $(".autowms_app_fileitem_return").attr('onclick','').click(function(t){
        console.log('e');
        prevPath.pop();
        makeFileListRequest(prevPath[prevPath.length -1 ]);
      });
      
      $(".autowms_app_fileitem_refresh").attr('onclick','').click(function(t){
        
        var path = $(this).attr('name');
        console.log(path);
        console.log('ref filelist', path);
        // element.html("... refreshing "+path+" ... ");
        $(".autowms_app_fileitem").remove();
        $(".autowms_app_layeritem").remove();
        setTimeout(()=>{
          makeFileListRequest(path);
        }, 100);
      });
      
      
      $(".autowms_app_fileitem").attr('onclick','').click(function(t){
        var fileObj = currentData[$(this).attr('name')];
        console.log(fileObj);
        if(fileObj.leaf === false){
          makeFileListRequest(fileObj.path);
        }else{
          makeGetCapabilitiesRequest(data, fileObj.adaguc);
        }
      });
      
      $('.autowms_app_request_button').attr('onclick','').click(function(t){makeFileListRequest("");});
      $('.autowms_app_request_input').keyup(function(e){if(e.keyCode == 13) {makeFileListRequest("");}});
    }
    

    
    let url = requestURL+"request=getfiles&path="+path;
    
    element.html("... Reading <a href=\""+url+"\">"+url+"</a> ... ");
    try{
      $.ajax({
        contentType: "application/json",
        crossDomain: true,
        type: "GET",
        url: url,
        success: succes,
        error:function(e){
          console.log('Request failed without jsonp, trying jsonp');
          succes({result:[]});
          $.ajax({
            dataType: "jsonp",
            contentType: "application/jsonp",
            crossDomain: true,
            type: "GET",
            url: url,
            success: succes,
            error:function(e){
              console.log(e);
              errormessage('Unable to do ajax call');
            }
          })
        }
      })
    }catch(e){
      console.log(e);
      errormessage(e);
    }
    
    
  };
  
  this.enable = function(){
    init();
    
    enabled = true;

  };
  this.disable = function(){
    enabled = false;
  };
  this.resize = function(w,h){
    console.log("w="+w);
  
  
  };
  
};

try{
  WMJSExtApplications["AutoWMS"]=autowms_app;
}catch(e){}
