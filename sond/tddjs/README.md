# Thermodynamic Diagrams in JavaScript - tddjs

Libreria modificada para el adaguc-viewer.
* Es necesario modificar la libreria d3-6.7.js ya que las serie temporales de adaguc utiliza otra version de la libreria d3.
  (Se renombran todas las referencias a d3 como s3)
 

## Descripción

La librería de Diagramas Termodinámicos en Javascript, en adelante **tddjs**, permite
calcular y representar sondeos termodinámicos en un diagráma Skew-T.

Se puede incorporar fácilmente en una página web a modo de plugin.
Internamente hace uso de un servicio de datos en tiempo real para los sondeos previstos de modelos numéricos.

Las principales características de esta librería son:
* Gráfico vectorial que se puede ampliar sin pérdida de calidad.
* Exploración de los datos con el ratón.
* Zoom sobre el diagrama con la rueda del ratón.
* Creación de ascensos haciendo clic de ratón.
* Selección de diferentes burbujas desde la leyenda.
* Selección de líneas y valores a visualizar desde la leyenda.
* Hodógrafa ampliable.
* Ayuda y explicación de los índices presentados.

Está basada en la librería skewt de Álvaro Subías: https://gitlab.aemet.es/asubiasd/skewt.


## Dependencia de datos 

La librería hace uso interno del servicio API REST de sondeos previstos de modelos

http://brisa.aemet.es/webtools/sREST


## Dependencias

Requiere usar las siguientes librerías

* jquery-3.3.1.min.js
* d3-6.7.js
* moment-with-locales.min.js
* mathjax.js

El directorio *vendor* incluye una copia de todo lo necesario que puede ser usado de la siguiente forma:

```
<script src="../vendor/jquery-3.3.1.min.js"></script>
<script src="../vendor/d3-6.7.js"></script>
<script src="../vendor/moment-with-locales.min.js"></script>
<script src="../vendor/mathjax.js"></script>
```

Opcionalmente se puede inclir también la siguiente librería. No se usa por defecto.

```
<script src="../vendor/lambertw/lambertw.js"></script>
```

## Cómo usarla

Referenciar la librería y hoja de estilo del directorio *dist*

```
<script src="../dist/tdd.js"></script>
<link rel="stylesheet" type="text/css" href="../dist/tdd.css"/>
```

Crear una *div* con un *id* específico donde se encuadrará el diagrama. 

```
<div id="mitdd"></div>
```

Crear un nuevo *TDD* pasando el id (sin #). Opcionalmente se pueden pasar las dimensiones.

```
<script>
    var tdd = new TDD('mitdd');
</script>
```

Cargar el sondeo previsto a través del método *load()* indicando el modelo, índice, día, pasada y alcance.

```
tdd.load(modelo, indice, dia, pasada, alcance)
```

Notar que el *índice* es la posición dentro de la matriz del modelo.

El plugin tiene una relación de aspecto fija, en caso de pasar dimensiones de ancho y alto 
se prioriza el alto para establecer el ancho en función de la relación de aspecto.


## API Reference


TDD(id, options={})

* id: identificador del tag <div> donde quedará contenido el gráfico.
* options: {width: w, height: h} - objecto para especificar las dimensiones.


TDD.load(model, index, date, run, step)

* model: IFS, AIB, AIC.
* index: índice del punto en la matriz del modelo.
* date: fecha con formato AAAAMMDD.
* run: 0, 6, 12 o 18.
* step: alcance: de 0 a 72 para Harmonie, de 0 a 90 para HRES-IFS.


## Datos

Los datos suministrados por el servicio API REST de sondeos previstos tienen la siguiente estructura:


```javascript
{
"meta": {                // metadatos
    "model": "AIB",      // modelo: IFS,AIB,AIC
    "index": 661247,     // índice en la matriz de datos del modelo (desde 0 a Ni*Nj)
    "date": 20210915,    // fecha con formato AAAAMMDD 
    "run": 0,            // pasada
    "step": 12,          // alcance 
    "lon": -3.8263014,   // longitud del punto de grid 
    "lat": 43.431903,    // latitud del punto de grid 
    "ps": 1013.1114,     // presión en superficie (hPa)
    "zs": 9.5788347,     // topografía del modelo (m) 
    "name": "SANTANDER"  // nombre del punto en caso de estar registrado
},
"data": [                 // lista de objetos con los datos en los niveles del modelo 
    {
    "n": 0,               // número de nivel en los datos (sin mayor importancia)   
    "p": 110.31801,       // presión (hPa)
    "z": 15898.015,       // altitud (m)
    "t": -59.39908,       // temperatura (ºC)
    "q": 0.0000036728634, // humedad específica (g/kg) 
    "u": 5.7928686,       // componente 'u' del viento (m/s) 
    "v": -0.027453772     // componente 'v' del viento (m/s) 
    },
    ...
]
}

#Modificaciones para adaguc.
Mod pluciag: Se cambia d3 por s3 por imcopatibilidad de las series temporales de adaguc que utilizan otra version del la libreria d3
             No se utiliza el Th.math2met porque invierte la direccion del viento en adaguc
             Se introducen if para que calcule q en funcion de si tenemos rh o td
             Se introducen if para calcular el viento en funcion de si tenemos u,v o wD,wS

## Autor

* **Marcos Gómez Molina** / mgomezm@aemet.es
* **Álvaro Subias Díaz-Blanco** / asubiasd@aemet.es






