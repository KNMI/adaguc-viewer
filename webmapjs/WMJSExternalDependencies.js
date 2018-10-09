/* Use the following three imports in case of a fully fledged npm / webpack environment */
// import $ from 'jquery';
// import moment from 'moment';
// import proj4 from 'proj4';

/* Use the following three definitions in case of loading the WebMapJS modules directly in a browser or google closure */
let $ = window.$;
let moment = window.moment;
let proj4 = window.proj4;
export { $, moment, proj4 };
