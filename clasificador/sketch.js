// Este programa calsifica las imagenes obtenidas con la 
// camara del sipositivo


// Ctrl + Command + space: 👍🎸🤓⏳😎🤓🤔
let clase1 = 'Normal';
let clase1Emoji = '🤓';
let clase2 = 'Pensar';
let clase2Emoji = '🤔';
let clase3 = 'Rocker';
let clase3Emoji = '🎸';

const defaultEmoji = '⏳';
const defaultText = 'Esperando ...';

let label = defaultText;
let confidence = 0;
let emoji = defaultEmoji;

let video; 
let anchoVideo = 640;

let clasificador;
//let modeloURL='https://teachablemachine.withgoogle.com/models/FQR43z5Im/';
// let modeloURL='https://teachablemachine.withgoogle.com/models/gb9b3wadX/'
let modeloURL='./modelo/'

// PASO 1: Cargar el modelo antes de iniciar
function preload() {
  // clasificador = ml5.imageClassifier(modeloURL + 'model.json');
  clasificador = ml5.imageClassifier(modeloURL + 'model.json');
  console.log("Modelo inicializado...");  
}

function setup() {  
  
  // Inicializar el tamaño del canvas (lienzo) 
  createCanvas(
    anchoVideo,     // Ancho del video
    anchoVideo*3/4  // Alto del video
  );
    
  // Crear la captura del video
  video = createCapture(VIDEO);
  video.size(width, height); // Cambiar el tamaño del vídeo para que se ajuste al canvas
  video.hide();

  // PASO 2: Clasificar
  classificarVideo()
  
  console.log("Clasificador de imagenes inicializado")
}


function draw() {
  
  background(0);
  image(video, 0, 0, width, height); // Dibuja el video para llenar el lienzo.

  // PASO 3: Pintar el resultado en pantalla
  if (confidence > 0.5){
    
    if (label == clase1) {    
    emoji = clase1Emoji; 
    
    } else if (label ==  clase2){    
      emoji = clase2Emoji;

    } else {
      emoji = clase3Emoji;
    }
  } else {
    emoji = defaultEmoji;
    label = defaultText;
  }
  
  // Esquina superior izquierda
  textSize(140);
  text(emoji, 80, 160);  
  
  // Texto de la etiqueta
  textAlign(CENTER, BOTTOM); 
  fill('Gold');
  textSize(60);
  text(label + ': ' + confidence.toFixed(2), width/2, height);  
}


function classificarVideo() {
  clasificador.classify(video, gotResults);
}

function gotResults(error, results) {
  // Si algo sale mal!
  if (error) {
    console.error(error);
    return;
  }else{
  // console .log(results)    
  /*
  (3) [Object, Object, Object]
    0: Object
      label: "Ok"
      confidence: 0.8666914105415344
    1: Object
      label: "Normal"
      confidence: 0.13018932938575745
    2: Object
      label: "Arriba"
      confidence: 0.0031192440073937178
  */    
    // Actualizar variables globales
    label = results[0].label;
    confidence = round(results[0].confidence, 2);    
    classificarVideo();    
  }  
}