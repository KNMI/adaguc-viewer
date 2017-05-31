var autowms_app = function(element, webmapjs) {

  var _this = this;

  var currentData = {};
  
  var prevPath = [];  
  
  var enabled = false;
  
  var errormessage = function(data){
    
    var html = createReturnLink();
     
    element.html(html+dump(data));
    $(".autowms_app_fileitem_return").attr('onclick','').click(function(t){
      prevPath = [];        
      makeFileListRequest("");
    });
  }
  
  var createFile = function(data){
    return "<span class='autowms_app_fileitem' name='"+data.name+"'>" + data.name + "</span>";
  };
  
  var createLayer = function(data,wmsServiceURL){
    if(data.name == "baselayer" || data.name == "overlay")return "";
    var previewURL = wmsServiceURL+"&service=WMS&request=getmap&format=image/png&layers="+data.name+",overlay&width=400&CRS=EPSG:4326&STYLES=&EXCEPTIONS=INIMAGE&showlegend=true&"+Math.random();
    var html =  "<span class='autowms_app_layeritem' title='Click to add to viewer' name='"+data.name+"'>" + data.text +" - ("+data.name+")";
    html+="<img height=\"250\" src=\""+previewURL+"\" />";
    html += "</span>";
    return html;
  };
  
  var createReturnLink = function(wmsServiceURL){
    var html = "";
    html+="<span class='autowms_app_currentpath'>Path: /"+prevPath[prevPath.length-1]+"</span>";
    if(wmsServiceURL){
      html+="<span class='autowms_app_currentpath'>WMS: <a target=\"_blank\" href=\""+wmsServiceURL+"&service=WMS&request=GetCapabilities\">"+wmsServiceURL+"</a></span>";
    }
    html += "<span class=\"autowms_app_fileitem_return\">..</span>" ;
    return html;
  };
  
  
  var init = function(){
    element.html('<div>Initializing...</div>');
    makeFileListRequest("");
  }
  var makeFileListRequest = function(path){
    
    if(path === undefined){
      path = "";
    }
    console.log("makeFileListRequest ["+path+"]");
    
    var succes = function(data){
      
      currentData= {}
      console.log(data);
      prevPath.push(path);
      var html = createReturnLink();
      element.html("... working ... ");
      for(var j=0;j<data.result.length;j++){
        html+=createFile(data.result[j]);
        currentData[data.result[j].name]=data.result[j];
      }
      //console.log(currentData);
      element.html(html);
      $(".autowms_app_fileitem_return").attr('onclick','').click(function(t){
        prevPath.pop();
        makeFileListRequest(prevPath.pop());
      });
      
      $(".autowms_app_fileitem").attr('onclick','').click(function(t){
        var fileObj = currentData[$(this).attr('name')];
        console.log(fileObj);
        if(fileObj.leaf === false){
          makeFileListRequest(fileObj.path);
        }else{
          console.log("WMS!"+fileObj.path);
          var wmsServiceURL = data.adagucserver+"source="+URLEncode(fileObj.path) + "&";
       
          console.log(wmsServiceURL);
          var service = WMJSgetServiceFromStore(wmsServiceURL);
          var getcapabilitiesdone = function(layers){
            console.log(layers);
            prevPath.push(path);
            var html = createReturnLink(wmsServiceURL);
            
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
              prevPath.pop();
              makeFileListRequest(prevPath.pop());
            });
          };
          service.getLayerObjectsFlat(getcapabilitiesdone,errormessage);
        }
      });
    }
    
    element.html("... working ... ");
    $.ajax({
      dataType: "jsonp",
      contentType: "application/jsonp",
      jsonpCallback: "resultGeo",
      crossDomain: true,
      type: "GET",
      url: autowmsURL+"request=getfiles&path="+path,
      success: succes,
      error:_this.errormessage
    });
    
    
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
