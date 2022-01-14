
var video = document.getElementById("Video1");
document.getElementById('files').addEventListener('change', VisualizarVideoSleccionado, false);

function VisualizarVideoSleccionado(evt)
{   
    var files = evt.target.files; // Se crea el array files con los ficheros seleccioandos

    f = files[0]; // Solo no interesa el primero. Sera un fichero .xml con los datos de la biblioteca
    reader = new FileReader(); // El objeto reader leera el archivo cuando ocurra el evento onload

  //  VideoReproduciendose.value = f.name;
    var ElElFichero = f.name;//"http://127.0.0.1:8080/sostenible.mp4"//
    reader.onload = (function (ElFichero) {
        return function (e) {
            try {
                video.src = e.target.result;
                video.currentTime = 0;
                video.load();
                video.play();
                //Habilitamos los botones ya que hemos cargado un video
                document.getElementById("Grabar").disabled = false;
                document.getElementById("capturar").disabled = false;
            }
            catch (err) {
                //  alert("Error : " + err);
            }

        };
    })(f);
    reader.readAsDataURL(f);
}

var imgUrl;
function capturarFoto()
{
      oFoto = document.querySelector('#foto');
    // Definen la resolución de la fotofrafia capturada.La Calidad de la imagen
    w = 500; //oCamara.width();
    h = 333; //oCamara.height();
    oFoto.width = w;
    oFoto.height = h;
    

    //  Obtener el contecto 2d del canvas que posibilita capturar la imagen
    oContexto = oFoto.getContext('2d');
    oContexto.drawImage(video, 0, 0, 500, 333);
    //   alert(cclasificacion.value)
    imgUrl = oFoto.toDataURL("image/png");
    //console.log(myImage)
   // imagenCapturada.src=myImage;
}

// Cargar el modal
var modal = document.getElementById("myModal");

//Al pulsar en la ventana, se cierra el modal
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

//Función para crear la galería de imágenes
function crearGaleria(galeria,cursor){
  console.log("Descripcion: " + cursor.value.Descripcion + ", Titulo: " + cursor.value.Titulo + ", Categoria: " + cursor.value.Categoria);
  var div = document.createElement("div");
  var img = document.createElement("img");
  div.setAttribute("class", "gallery-item")
  img.setAttribute("class", "gallery-image btn")
  //Creamos una función onclick en cada imagen a la que le pasamos this para acceder luego al id
  img.setAttribute("onclick", "buscarPorID(this);")
  img.setAttribute("src", cursor.value.Url)
  img.setAttribute("id", cursor.primaryKey)
  div.appendChild(img)
  //Depende de la opción previa (si hemos filtrado o no), se unirá al div de una pestaña u otra
  galeria.appendChild(div)
}

/*En esta función accederemos a la base de datos para recuperar 
el registro con el id correspondiente a la imagen que hemos hecho click*/
function buscarPorID(evt) {
  console.log(evt.id)
  //Borramos el modal
  document.querySelector(".modal-content").innerHTML=""
  var db = dataBase.result;
  var transaction = db.transaction("GaleriaImagenes", "readonly");
  var objectStore = transaction.objectStore("GaleriaImagenes");
  var request = objectStore.get(parseInt(evt.id));
  request.onsuccess = function (event) {
      var campo = event.target.result;
      //Pasamos el campo, que es el resultado de la consulta, a la función de crear modal
      crearModal(campo);
  };
}


function crearModal(campo) {
  var modalContenido=document.querySelector(".modal-content")
  var span = document.createElement("span");
  //Creamos el botón de cerrar
  span.setAttribute("class","close");
  span.innerHTML="X"
  modalContenido.appendChild(span)
  //Creamos la imagen
  var imagen = document.createElement("img");
  imagen.setAttribute("src",campo.Url)
  console.log(campo)
  modalContenido.appendChild(imagen)
  //Creamos el texto recuperando los campos del registro en la base de datos
  crearTexto("Titulo",campo.Titulo,modalContenido);
  crearTexto("Categoria",campo.Categoria,modalContenido);
  crearTexto("Descripcion",campo.Descripcion,modalContenido)
  //Mostramos el modal
  modal.style.display = "block";
  //Si pulsamos la X, cerramos el modal
  span.onclick = function() {
      modal.style.display = "none";
    }
}

function crearTexto(desc,texto,modal){
var parrafo = document.createElement("p");
  parrafo.innerHTML=desc + " : " +texto
  modal.appendChild(parrafo)
}