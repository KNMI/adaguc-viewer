export default class WMJSTileRenderer {
  render (currentBBOX, newBBOX, srs, width, height, ctx, bgMapImageStore, tileOptions, layerName) {
    let renderedURLs = {};
    const imagesToRender = [];
    bgMapImageStore.stopLoading();
    if (!layerName) {
      console.error('layerName not defined');
      return;
    }
    /* Temporal mappings from bgmaps.cgi service names to names defined here */
    if (layerName === 'streetmap') layerName = 'OSM';
    if (layerName === 'pdok') layerName = 'OSM';
    if (layerName === 'naturalearth2') layerName = 'NaturalEarth2';
    let tileLayer = tileOptions[layerName];
    if (!tileLayer) {
      console.error('Tiled layer with name ' + layerName + ' not found');
      return;
    }
    let tileSettings = tileLayer[srs];

    /* If current map projection is missing in the tilesets, try to find an alternative */
    if (!tileSettings) {
      for (var tileOption in tileOptions) {
        if (tileOptions.hasOwnProperty(tileOption)) {
          for (var epsgCode in tileOptions[tileOption]) {
            if (tileOptions[tileOption].hasOwnProperty(epsgCode)) {
              if (epsgCode === srs) {
                // console.log('Projection not supported by tileserver: Falling back to ', tileOption, epsgCode);
                tileSettings = tileOptions[tileOption][epsgCode];
              }
            }
          }
        }
      }
    }

    let pi = Math.PI;
    /* Default settings for OSM Mercator */
    let tileSize = 256;
    let initialResolution = 2 * pi * 6378137 / tileSize;
    let originShiftX = -2 * pi * 6378137 / 2.0;
    let originShiftY = 2 * pi * 6378137 / 2.0;

    if (tileSettings.tileSize) tileSize = tileSettings.tileSize;
    if (tileSettings.resolution) initialResolution = tileSettings.resolution;
    if (tileSettings.origX) originShiftX = tileSettings.origX;
    if (tileSettings.origY) originShiftY = tileSettings.origY;
    let screenWidth = width;
    let bboxw = currentBBOX.right - currentBBOX.left;
    let originShiftX2 = initialResolution * tileSize + originShiftX;
    let originShiftY2 = originShiftY - initialResolution * tileSize;
    let tileSetWidth = originShiftX2 - originShiftX;
    let tileSetHeight = originShiftY - originShiftY2;
    let levelF = Math.log((Math.abs(originShiftX2 - originShiftX)) / ((bboxw / screenWidth) * tileSize)) / Math.log(2);
    let level = parseInt(levelF + 0.5);
    let getAttribution = (textileLayer) => {
      if (!textileLayer || !srs || !tileLayer[srs] || !tileLayer[srs].copyRight) return null;
      return tileLayer[srs].copyRight;
    };
    let drawBGTiles = (level) => {
      let home = tileSettings.home;
      let tileServerType = tileSettings.tileServerType; // 'osm' or 'argisonline'
      let tileServerFormat = tileSettings.tileServerFormat || 'png';
      let tmsEnabled = tileSettings.tms || false; // 'osm' or 'argisonline'
      if (level < tileSettings.minLevel) level = tileSettings.minLevel;
      if (level > tileSettings.maxLevel) level = tileSettings.maxLevel;
      let numTilesAtLevel = Math.pow(2, level);
      let numTilesAtLevelX = tileSetWidth / ((initialResolution / numTilesAtLevel) * tileSize);// / Math.abs(originShiftY / originShiftX);
      let numTilesAtLevelY = tileSetHeight / ((initialResolution / numTilesAtLevel) * tileSize);
      let tilenleft = parseInt(Math.round((((((currentBBOX.left - originShiftX) / (tileSetWidth)) * (numTilesAtLevelX))) / 1) + 0.5));
      let tilenright = parseInt(Math.round((((((currentBBOX.right - originShiftX) / (tileSetWidth)) * (numTilesAtLevelX))) / 1) + 0.5));
      let tilentop = parseInt(Math.round((numTilesAtLevelY - ((((currentBBOX.bottom - originShiftY2) / tileSetHeight) * numTilesAtLevelY))) + 0.5));
      let tilenbottom = parseInt(Math.round((numTilesAtLevelY - ((((currentBBOX.top - originShiftY2) / tileSetHeight) * numTilesAtLevelY))) + 0.5));

      let tileXYZToMercator = function (level, x, y) {
        let tileRes = initialResolution / Math.pow(2, level);
        let p = { x: x * tileRes + (originShiftX), y:  originShiftY - y * tileRes };
        return p;
      };
      let getTileBounds = function (level, x, y) {
        let p1 = tileXYZToMercator(level, (x) * tileSize, (y) * tileSize);
        let p2 = tileXYZToMercator(level, (x + 1) * tileSize, (y + 1) * tileSize);
        return { left:p1.x, bottom:p1.y, right:p2.x, top: p2.y };
      };

      let getPixelCoordFromGeoCoord = function (coordinates, b, w, h) {
        var x = (w * (coordinates.x - b.left)) / (b.right - b.left);
        var y = (h * (coordinates.y - b.top)) / (b.bottom - b.top);
        return { x:parseFloat(x), y:parseFloat(y) };
      };

      let drawTile = function (ctx, level, x, y, loadImage = true) {
        let bounds = getTileBounds(level, x, y);
        let bl = getPixelCoordFromGeoCoord({ x: bounds.left, y: bounds.bottom }, newBBOX, width, height);
        let tr = getPixelCoordFromGeoCoord({ x: bounds.right, y: bounds.top }, newBBOX, width, height);

        let imageURL;
        if (tileServerType === 'osm') {
          if (tmsEnabled) {
            imageURL = home + level + '/' + x + '/' + ((numTilesAtLevelY - 1) - y) + '.' + tileServerFormat;
          } else {
            imageURL = home + level + '/' + x + '/' + (y) + '.' + tileServerFormat;
          }
        } else if (tileServerType === 'arcgisonline' || tileServerType === 'wmst') {
          imageURL = home + level + '/' + y + '/' + (x);
        } else if (tileServerType === 'skyvector') {
          imageURL = home + 2 * (11 - Math.round(level)) + '/' + x + '/' + (y) + '.' + tileServerFormat;
        }

        if (renderedURLs[imageURL]) {
          return;
        }
        renderedURLs[imageURL] = true;
        let image = bgMapImageStore.getImage(imageURL);
        // let image = bgMapImageStore.getImageForSrc(imageURL);

        if (loadImage === false) {
          /* Here we display lower resolution images, if not available switch to an even higher resolution */
          if (image.isLoaded()) {
            try {
              ctx.drawImage(image.getElement()[0], parseInt(bl.x), parseInt(bl.y), parseInt(tr.x - bl.x) + 1, parseInt(tr.y - bl.y) + 1);
            } catch (e) {
            }
          } else {
            /* If desired image is not yet loaded, try to load a higher resolution variant instead */
            if (level > 1) {
              drawTile(ctx, level - 1, parseInt(x / 2), parseInt(y / 2), false);
            }
          }
        } else {
          /* Not all images need to load, as we can switch to lower resolutions for the time being */
          if (loadImage) {
            if (image.isLoaded() === false && image.hasError() === false && image.isLoading() === false) {
              image.load();
            }
          }
          /* Here we display the images we like to have at the desired resolution */
          if (image.isLoaded()) {
            imagesToRender.push({
              i: image.getElement()[0],
              x:  parseInt(bl.x),
              y: parseInt(bl.y),
              w: parseInt(tr.x - bl.x) + 1,
              h: parseInt(tr.y - bl.y) + 1,
              level: level
            });
          } else {
            /* If desired image is not yet loaded, try to load a higher resolution variant instead */
            if (level > 1) {
              drawTile(ctx, level - 1, parseInt(x / 2), parseInt(y / 2), false);
            }
          }
        }
      };
      if (srs === 'EPSG:4326' || srs === 'EPSG:4258') {
        numTilesAtLevelX *= 2;
      }
      if (tilenbottom < 1)tilenbottom = 1; if (tilenbottom > numTilesAtLevelY)tilenbottom = numTilesAtLevelY;
      if (tilenleft < 1)tilenleft = 1; if (tilenleft > numTilesAtLevelX)tilenleft = numTilesAtLevelX;
      if (tilentop < 1)tilentop = 1; if (tilentop > numTilesAtLevelY)tilentop = numTilesAtLevelY;
      if (tilenright < 1)tilenright = 1; if (tilenright > numTilesAtLevelX)tilenright = numTilesAtLevelX;
      if (tilentop - tilenbottom > 20) { console.error('Too many tiles in vertical', tilentop - tilenbottom); return; }
      if (tilenright - tilenleft > 20) { console.error('Too many tiles in horizontal', tilentop - tilenbottom); return; }
      for (let ty = tilenbottom - 1; ty < tilentop; ty++) {
        for (let tx = tilenleft - 1; tx < tilenright; tx++) {
          drawTile(ctx, level, tx, ty);
        }
      }
    };
    drawBGTiles(level);
    imagesToRender.sort((imageA, imageB) => {
      if (imageA.level < imageB.level) return -1;
      if (imageA.level > imageB.level) return 1;
      return 0;
    });
    for (let i = 0; i < imagesToRender.length; i++) {
      ctx.drawImage(imagesToRender[i].i,
        imagesToRender[i].x,
        imagesToRender[i].y,
        imagesToRender[i].w,
        imagesToRender[i].h
      );
      // ctx.fillText(i, imagesToRender[i].x + 20, imagesToRender[i].y + 20);
    };
    const attributionText = getAttribution(tileLayer);
    return {
      attributionText: attributionText
    };
  }
};
