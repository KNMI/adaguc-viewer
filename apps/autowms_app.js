var autowms_app = function(element, webmapjs) {

  element.addClass("autowms_app_container");
  
  var _this = this;

  var currentData = {};
  
  var prevPath = [];  
  
  var enabled = false;
  
  var errormessage = function(data){
    console.log('errormessage called');
    var html = createReturnLink();
     
    element.html(html+dump(data));
    $(".autowms_app_fileitem_return").attr('onclick','').click(function(t){
      prevPath = [];        
      makeFileListRequest("");
    });
  }
  
  var createFile = function(data){
    let name = data.name;
    return "<span class='autowms_app_fileitem' name='"+data.name+"'>" + name + "</span>";
  };
  
  var createLayer = function(data,wmsServiceURL){
    if(data.name == "baselayer" || data.name == "overlay")return "";
    var previewURL = wmsServiceURL+"&service=WMS&request=getmap&format=image/png&layers="+data.name+"&width=400&CRS=EPSG:4326&STYLES=&EXCEPTIONS=INIMAGE&showlegend=true&"+Math.random();
    var html =  "<span class='autowms_app_layeritem' title='Click to add to viewer' name='"+data.name+"'>" + data.text +" - ("+data.name+")";
    html+="<img height=\"250\" src=\""+previewURL+"\" />";
    html += "</span>";
    return html;
  };
  
  var createReturnLink = function(wmsServiceURL){
    var html = "";
    html+="<span class='autowms_app_currentpath'>Current folder: /"+prevPath[prevPath.length-1]+"</span>";
    if(wmsServiceURL){
      html+="<span class='autowms_app_currentpath'>WMS: <a target=\"_blank\" href=\""+wmsServiceURL+"&service=WMS&request=GetCapabilities\">"+wmsServiceURL+"</a></span>";
    }
    html += "<span class=\"autowms_app_fileitem_return\">../ (&#8679;)</span>" ;
    return html;
  };
  
  
  var init = function(){
    element.html('<div>Initializing...</div>');
    makeFileListRequest("");
  }
  var makeFileListRequest = function(path){
    
    if(!path || path === 'undefined'){
      path = "";
    }
    
    console.log("makeFileListRequest ["+path+"]");
    
    var succes = function(data){
      if (data.error){
        element.html("Error from server: " + data.error);
        return;
      }
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
          element.html("... working ... ");
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
    
    let requestURL = 'http://localhost:8090//adaguc-services/autowms?request=getfiles&path=&';
    
    try{
      requestURL = autowmsURL;
    }catch(e){
    }
    
    let url = requestURL+"request=getfiles&path="+path;
    
    element.html("... Reading <a href=\""+url+"\">"+url+"</a> ... ");
    try{
      $.ajax({
        dataType: "jsonp",//TODO change to json in servlet with cors flag enables
        contentType: "application/jsonp",
        crossDomain: true,
        type: "GET",
        url: url,
        success: succes,
        error:function(e){console.log(e);errormessage('Unable to do ajax call');}
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
