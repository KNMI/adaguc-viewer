const WMJSXMLParser = (url) => {
  return new Promise((resolve, reject) => {
    fetch(url, {
      method: 'GET',
      mode: 'cors'
    }).then((response) => {
      let contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/xml')) {
        return response.text();
      }
      return response.text();
      // reject(TypeError('Oops, we haven\'t got XML!'));
    }).catch((e) => {
      reject(e);
    }).then((data) => {
      if (typeof data !== 'object') {
        data = new DOMParser().parseFromString(data, 'text/xml');
        if (data.documentElement.nodeName === 'parseerror') {
          reject(new Error('Error while parsing: ' + data));
        }
      }
      let json = {};
      // let path = '';
      let traverse = (data, path, json) => {
        if (data.children && data.children.length) {
          for (let childc = 0; childc < data.children.length; childc++) {
            let child = data.children[childc];
            let newPath = path + '->' + child.nodeName;
            let newJson = null;
            let nodeName = child.nodeName;
            if (json[nodeName]) {
              newJson = { attr:{} };
              if (json[nodeName] instanceof Array) {
              } else {
                let obj = Object.assign({}, json[nodeName]);
                json[nodeName] = [];
                json[nodeName].push(obj);
              }
              json[nodeName].push(newJson);
            } else {
              json[nodeName] = { attr:{} };
              newJson = json[nodeName];
            }
            // Value
            if (child.childNodes && child.childNodes.length > 0) {
              if (child.childNodes[0].nodeValue) {
                let value = child.childNodes[0].nodeValue.trim();
                if (value !== '\n' && value.length > 0) {
                  newJson.value = value;
                }
              }
            }
            // Attributes
            if (child.attributes && child.attributes.length > 0) {
              for (let attrc = 0; attrc < child.attributes.length; attrc++) {
                newJson.attr[child.attributes[attrc].name] = child.attributes[attrc].value;
              }
            }

            traverse(child, newPath, newJson);
          }
        }
      };
      traverse(data, '', json);
      resolve(json);
    });
  });
};
export default WMJSXMLParser;
