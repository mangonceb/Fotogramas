
// Configuramos Idexeddb para la  configuración implementada en cada navegado. 
// Este objeto proporciona el método open que nos permite crear o abrir  la base de datos.
var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
var dataBaseC = null;
var dataBase = null;
var registroActual = null;
var cursor = null;
var nuevo = true;

//Si no hemos cargado video, que los botones de grabar y captura esten deshabilitados
if (Video1.src == "") {
    document.getElementById("Grabar").disabled = true;
    document.getElementById("capturar").disabled = true;
}

function startDB() {

    dataBase = indexedDB.open("BdGaleriaImagenes", 1);
    // Creamos  o abrimos la base de datos con un numero de version
    // Es importante el significado de la  versión(1), pero aún no no tengo claro.
    dataBase.onupgradeneeded = function (e) {
        // El método   onupgradeneeded se ejecuta la primera vez que se crea la base de datos  
        // El método createObjectStore solo se puede utilizar dentro de esta function
        // Si cambiamos de versión tambien se dispara onupgradeneeded
        // Como hemos dicho  Ese evento también se dispará la primera vez que se abre la BD y 
        // ahí es donde se deben crear tablas e índices.
        orden = dataBase.result;
        // onder es un objeto que nos permite ejecutar acciones contra la base de datos creada, como crear un tabla
        var tabla = orden.createObjectStore("GaleriaImagenes", { keyPath: 'id', autoIncrement: true });
        //  createObjectStore crea una tabla, el campo clave obligatorio por medio de KeyPath y si el indice es autoincremento                  
        //tabla.createIndex('by_Id', 'claveId', { unique: false });
        //!!!!!!! cuidado con mayúsculas y mnísculas. No es igual by_IdCliente que by_idCliente
        tabla.createIndex('by_cat', 'Categoria', { unique: false });
        // Creamos cuanto indices necesitemos para despues realizar búsquedas. Se crea un indice por cada campo de la tabla 
        // que vayamos a necesitar
        alert('Base de datos creada');
    };
    dataBase.onerror = function (e) {
        // Si se produce un error se ejecuta este método. Ocurre cuando cambiamos de versión
        alert('Error cargandoo la base de datos ' + e.target);
    };
}


//////////////////////////////////// G R A B A R //////////////////////////////////

//////////////////////////////////// G R A B A R //////////////////////////////////


document.getElementById("Grabar").addEventListener("click", comprobarCaptura, false);

//Compruebo que se haya hecho captura de la foto para poder guardar
function comprobarCaptura() {
    if (foto.getAttribute("width") != null) {
        grabar()
    }
}

function grabar() {
    var Descripcion = document.getElementById("cDescripcion").value;
    var Titulo = document.getElementById("cTitulo").value;
    var Categoria = document.getElementById("cCategoria").value;
    var orden = dataBase.result;
    // Crea un objeto para ejecutar ordenes contra la base de datos               
    var transacion = orden.transaction(["GaleriaImagenes"], "readwrite");
    // Crea una transación sobre una  tabla de la base de datos para lectura y escritura
    var tabla = transacion.objectStore("GaleriaImagenes");
    var request = null;
    request = tabla.add({
        Categoria: Categoria,
        Titulo: Titulo,
        Descripcion: Descripcion,
        Url: imgUrl,
    });
    request.onerror = function (e) {
        // Error de grabación                    
        alert(request.error.name + '\n\n' + request.error.message);
    };
    transacion.oncomplete = function (e) {
        // La transacion se ha ejecutado sin problemas y borramos el contenido de los <input> de texto                    
        document.getElementById("cDescripcion").value = "";
        document.getElementById("cTitulo").value = "";
        document.getElementById("cCategoria").value = "";
        alert('Registro grabado');
    };
}


//////////////////////////////////// B U S C A R //////////////////////////////////

//////////////////////////////////// B U S C A R //////////////////////////////////

document.getElementById("busqueda").addEventListener("click", function () { busqueda(false) }, false);
document.getElementById("todo").addEventListener("click", function () { busqueda(true) }, false);

//Le pasamos a la busqueda un booleano que es el que indica si estamos filtrando por palabra o no
function busqueda(opcion) {
    var db = dataBase.result;
    var transaction = db.transaction(["GaleriaImagenes"], "readwrite");
    transaction.onerror = function (event) {
        console.log('<li>Transaction not opened due to error: ' + transaction.error + '</li>');
    };
    var objectStore = transaction.objectStore("GaleriaImagenes");
    //Cogemos el indice por categoria
    var index = objectStore.index("by_cat");
    var dato = cdatoabuscar.value
    //Si la opcion es true, mostraremos todos los registros de la base de datos
    if (opcion) {
        document.getElementById("galeriaTodo").innerHTML = "";
        //No mandamos ningún parámetro al openCursor() para que no filtre
        index.openCursor().onsuccess = function (event) {
            var cursor = event.target.result;
            if (cursor) {
                //Llamamos a la función de crearGaleria a la que le pasamos el id del contenedor de la tercera pestaña, y el cursor
                crearGaleria(galeriaTodo, cursor);
                cursor.continue();
            }
        };
    } else {
        document.getElementById("galeriaContenedor").innerHTML = "";
        index.openCursor(dato).onsuccess = function (event) {
            var cursor = event.target.result;
            if (cursor) {
                //Llamamos a la función de crearGaleria a la que le pasamos el id del contenedor de la segunda pestaña, y el cursor
                crearGaleria(galeriaContenedor, cursor);
                cursor.continue();
            }
        }

    };
}

//A PARTIR DE ESTE PUNTO, LAS FUNCIONES ESTÁN EN funciones.js

//Cargamos la bbdd
window.onload = function () {
    // Crear oyente para el input de type "file" con ide=files
    startDB();
}
