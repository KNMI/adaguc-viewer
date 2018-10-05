// export default class WMSTileRenderer {
//   constructor () {
//     this._canvas = undefined;
//     this._context = undefined;
//     this._url = undefined;
//     this._minX = undefined;
//     this._minY = undefined;
//     this._maxX = undefined;
//     this._maxY = undefined;
//     this._initX = -285401.92;
//     this._initY = 903401.92;
//     this._initR = 3440.64;
//     this._divElement = undefined;
//     this._drawTile = this._drawTile.bind(this);
//     this.init = this.init.bind(this);
//     this.clear = this.clear.bind(this);
//     this.render = this.render.bind(this);
//   }
//   _drawTile (context, url, x, y, w, h) {
//     let imageObj = new Image();
//     imageObj.padding = 0;
//     imageObj.margin = 0;
//     imageObj.onload = () => {
//       if (w) {
//         context.drawImage(imageObj, 0, 0, 256, 256, x, y, w, h);
//       } else {
//         context.drawImage(imageObj, x, y);
//       }
//     };
//     imageObj.src = url;
//   }
//   /**
//    * @param divElement The divElement to render to
//    * @param _url The URL where the tiles are located
//    * @param initX The initial X location of the tiles
//    * @param initY The initial Y location of the tiles
//    * @param initR The initial resolution the tile at first zoom level (0)
//    */
//   init (_divElement) {
//     this._divElement = _divElement;
//     this._canvas = document.createElement('canvas');
//     this._canvas.setAttribute('width', parseInt(this._divElement.style.width));
//     this._canvas.setAttribute('height', parseInt(this._divElement.style.height));
//     this._canvas.setAttribute('class', 'mapping');
//     this._divElement.appendChild(this._canvas);
//     try {
//       this._canvas = G_vmlCanvasManager.initElement(this._canvas); // eslint-disable-line no-undef
//     } catch (e) {
//     }
//     try {
//       this._context = this._canvas.getContext('2d');
//     } catch (e) {
//       alert('This browser is not supported by WMSTileRenderer');
//     }
//   }

//   clear () {
//     if (!this._context) return;
//     this._canvas.width = this._canvas.width;
//   }

//   /**
//    * renders on the given bbox
//    */
//   render (_minX, _minY, _maxX, _maxY, _url, _initX, _initY, _initR, _extension) {
//     if (!context) return;

//     /* Check if width/height have changed */
//     let width = this._canvas.width;
//     let height = this._canvas.height;
//     let _width = parseInt(this._divElement.style.width);
//     let _height = parseInt(this._divElement.style.height);
//     if (width !== _width || height !== _height) {
//       this._canvas.width = _width;
//       this._canvas.height = _height;
//       width = _width;
//       height = _height;
//     } else {
//       /* Check if other parameters have changed */
//       if (this._minX === _minX &&
//         this._minY === _minY &&
//         this._maxX === _maxX &&
//         this._maxY === _maxY &&
//         this._url === _url &&
//         this._initX === _initX &&
//         this._initY === _initY &&
//         this._initR === _initR) return;
//     }
//     this._url = _url;
//     this._initX = _initX;
//     this._initY = _initY;
//     this._initR = _initR;
//     this._minX = _minX;
//     this._minY = _minY;
//     this._maxX = _maxX;
//     this._maxY = _maxY;

//     this._canvas.width = this._canvas.width;
//     let level = 0;
//     /* Find the right zoomlevel based on min max extent and width of the image */
//     let OSM = false;
//     if (_extension) OSM = true;

//     if (OSM) {
//       let z = parseInt(Math.log((this._maxX - this._minX) / (width / 256)) / Math.log(0.5) + 26.0);
//       level = z;
//       if (level > 17) level = 17;
//       if (level < 0) level = 0;
//     } else {
//       let z = parseInt(Math.log((this._maxX - this._minX) / (width / 256)) / Math.log(0.5) + 21);
//       level = z;
//       if (level > 12) level = 12;
//       if (level < 0) level = 0;
//     }

//     /* How many tiles are there on this zoomlevel? */
//     let d = parseInt(Math.pow(2, level));

//     /* Get the resolution of a tile */
//     let r = (this._initR / d) * 256;

//     let startX = parseInt((this._minX - this._initX) / r);
//     let endX = parseInt((this._maxX - this._initX) / r) + 1;
//     let startY = parseInt(-(this._maxY - this._initY) / r);
//     let endY = parseInt((this._minY - this._initY) / r) + 1;

//     let widthX = (r / (this._maxX - this._minX)) * width + 1;
//     let widthY = (r / (this._maxY - this._minY)) * height + 1;
//     let scaleW = width / (this._maxX - this._minX);
//     let scaleH = height / (this._maxY - this._minY);
//     let geoX1 = 0;
//     let geoY1 = 0;

//     let extension = '';
//     if (_extension) extension = _extension;

//     let nTilesDrawn = 0;
//     if (startX < 0)startX = 0;
//     if (startY < 0)startY = 0;
//     if (endX < 0)endX = 0;
//     if (endY < 0)endY = 0;

//     if (startX > d) startX = d;
//     if (startY > d) startY = d;
//     if (endX > d) endX = d;
//     if (endY > d) endY = d;

//     if (OSM) {
//       for (let x = startX; x < endX; x++) {
//         for (let y = startY; y < endY; y++) {
//           geoX1 = (this._initX + x * r - this._minX) * scaleW;
//           geoY1 = height - (this._initY - y * r - this._minY) * scaleH;
//           if (geoX1 + widthX >= 0 &&
//             geoY1 + widthY >= 0 &&
//             geoX1 < width &&
//             geoY1 < height) {
//             if (x < d && y < d) {
//               this._drawTile(context, this._url + level + '/' + x + '/' + y + extension, geoX1, geoY1, widthX, widthY);
//               nTilesDrawn++;
//               if (nTilesDrawn > 120) return;
//             }
//           }
//         }
//       }
//     } else {
//       for (let x = startX; x < endX; x++) {
//         for (let y = startY; y < endY; y++) {
//           geoX1 = (this._initX + x * r - this._minX) * scaleW;
//           geoY1 = height - (this._initY - y * r - this._minY) * scaleH;
//           if (geoX1 + widthX >= 0 &&
//             geoY1 + widthY >= 0 &&
//             geoX1 < width &&
//             geoY1 < height) {
//             if (x < d && y < d) {
//               this._drawTile(context, this._url + level + '/' + y + '/' + x, geoX1, geoY1, widthX, widthY);
//               nTilesDrawn++;
//               if (nTilesDrawn > 120) return;
//             }
//           }
//         }
//       }
//     }
//   }
// };
