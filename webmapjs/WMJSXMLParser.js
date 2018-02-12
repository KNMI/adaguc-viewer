
function WMJSXMLParser () {
  this.fetchXMLAndParseToJSON = (url, ready, error) => {
    let t=this;
    $.ajax({
      url: url,
      crossDomain:true
    }).done(function(data) {
      let path = '';
      let json = {};
      let traverse = (data,path,json) => {
        if(data.children && data.children.length){
          for(let childc=0;childc<data.children.length;childc++){
            let child = data.children[childc];
            let newPath = path + '->' + child.nodeName;
            let newJson = null;
            let nodeName = child.nodeName;
            if( json[nodeName]){
              newJson = {attr:{}};  
              if(json[nodeName] instanceof Array){
              } else {
                let obj = Object.assign({}, json[nodeName]);
                json[nodeName] = [];
                json[nodeName].push(obj);
              }
              json[nodeName].push(newJson);
            }else{
              json[nodeName] = {attr:{}};
              newJson = json[nodeName];
            }
            // Value
            if (child.childNodes && child.childNodes.length > 0 ){
              if( child.childNodes[0].nodeValue){
                let value = child.childNodes[0].nodeValue.trim();
                if(value!=='\n' && value.length > 0){
                  newJson.value = value;
                }
              }
            }
            // Attributes
            if (child.attributes && child.attributes.length > 0) {
              for (let attrc = 0; attrc<child.attributes.length; attrc++){
                newJson.attr[child.attributes[attrc].name]=child.attributes[attrc].value;
              }
            }

            traverse(child, newPath, newJson);
          }
        }
      };
      traverse(data, '',json);
      try{
        console.log("WMJSXMLParser succesfully completed", json);
        ready(json);
      }catch(e){
        error({"error":"WMJSXMLParser: ready failed","exception":e});
      }
    }).fail(function(e) {
      error({ "error":"WMJSXMLParser: Request failed for " + url, 'exception': e });
    });
  }
};
