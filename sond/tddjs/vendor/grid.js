/*===============================================================
 *
 * Libreria para manejar coordenadas geograficas y puntos de grid
 *
 * Permite pasar de coordenadas geograficas al punto de grid mas 
 * cercano y viceversa.
 * Para ello se basa en informacion obtenida de los ficheros GRIB
 * correspondiente de cada modelo y codificado en el diccionario
 * "grids". Debe actualizarse con cada cambio de rejilla.
 * Hace uso de la librerioa proj4 para los calculos
 *
 *
 * version 1.0 - 2017/04/25 - Marcos Gomez Molina
 *===============================================================
 */


var WGS84 = "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs"

var grids = {
/*
    'IFS' : {
        'proj' : "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs",
        'lat0' : 65,
        'lon0' : -15,
        'Nx'   : 571,
        'Ny'   : 351,
        'Dx'   : 0.1,
        'Dy'   : 0.1,
        'Sx'   : 1,  // scan 1 left to right
        'Sy'   : -1, // scan 1 bottom to top
    },
*/
    'IFS' : {
        'proj' : "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs",
        'lat0' : 51.4,
        'lon0' : -36,
        'Nx'   : 541,
        'Ny'   : 327,
        'Dx'   : 0.1,
        'Dy'   : 0.1,
        'Sx'   : 1,  // scan 1 left to right
        'Sy'   : -1, // scan 1 bottom to top
    },

    'AIB': {
        'proj' : "+proj=lcc +lat_1=40 +lat_2=40 +lat_0=40 +lon_0=-5 +a=6371220.0 +b=6371220.0 +units=m +no_defs",
        'lat0' : 29.433,
        'lon0' : -19.541,
        'Nx'   : 1141,
        'Ny'   : 853,
        'Dx'   : 2500,
        'Dy'   : 2500,
        'Sx'   : 1,
        'Sy'   : 1,
    },

    'AIC': {
        'proj' : "+proj=lcc +lat_1=29 +lat_2=29 +lat_0=29 +lon_0=-17.5 +a=6371220.0 +b=6371220.0 +units=m +no_defs",
        'lat0' : 23.562,
        'lon0' : -24.39,
        'Nx'   : 565,
        'Ny'   : 469,
        'Dx'   : 2500,
        'Dy'   : 2500,
        'Sx'   : 1,
        'Sy'   : 1,
    },


}


/** */
function lonlat_to_ij(mod, lonlat){
    var cor0 = proj4(WGS84, grids[mod]['proj'], [grids[mod]['lon0'], grids[mod]['lat0']])
    var cor1 = proj4(WGS84, grids[mod]['proj'], lonlat)
    var incx = cor1[0] - cor0[0]
    var incy = cor1[1] - cor0[1] //y1 - y0
    var i = parseInt(Math.round(incx / grids[mod]['Dx']*grids[mod]['Sx']))
    var j = parseInt(Math.round(incy / grids[mod]['Dy']*grids[mod]['Sy']))
    var index = j*grids[mod]['Nx'] + i
    return [i, j]
}


/** */
function ij_to_lonlat(mod, ij){
    var cor0 = proj4(WGS84, grids[mod]['proj'], [grids[mod]['lon0'], grids[mod]['lat0']])
    var x1 = cor0[0] + ij[0]*grids[mod]['Dx']*grids[mod]['Sx']
    var y1 = cor0[1] + ij[1]*grids[mod]['Dy']*grids[mod]['Sy']
    var cor1 = proj4(grids[mod]['proj'], WGS84, [x1, y1])
    return cor1
}


/** */
function ij_to_index(mod, ij){
    return ij[1]*grids[mod]['Nx'] + ij[0]
}


/** */
function index_to_ij(mod, index){
    var j = parseInt(index/grids[mod]['Nx'])
    var i = parseInt(index%grids[mod]['Nx'])
    return [i, j]
}


/** */
function lonlat_to_index(mod, lonlat){
    var ij = lonlat_to_ij(mod, lonlat)
    return ij_to_index(mod, ij)
}


/** */
function index_to_lonlat(mod, index){
    var ij = index_to_ij(mod, index)
    return ij_to_lonlat(mod, ij)
}




