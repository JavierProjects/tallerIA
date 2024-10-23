// ml5.js: Pose Estimation with PoseNet
// The Coding Train / Daniel Shiffman
// https://thecodingtrain.com/Courses/ml5-beginners-guide/7.1-posenet.html
// https://youtu.be/OIo-DIOkNVg
// https://editor.p5js.org/codingtrain/sketches/ULA97pJXR

let video;
let poseNet;
let pose;
let skeleton;
let catEars;

let wEars;
let hEars;
// let rotar = 0;

let PUNTOS = true;

function preload(){
  catEars = loadImage('data/orejas.gif');
}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.hide();
  poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on('pose', gotPoses);
  wEars = catEars.width/2;
  hEars = catEars.height/2;
  angleMode(DEGREES);
     
}

function gotPoses(poses) {
  let noPoses = poses.length;
  
  if (noPoses > 0) {
    let maxDistance = 0; // Variable to keep track of the maximum distance
    let maxIndex = -1;   // Variable to keep track of the index of the pose with the maximum distance

    for (let index = 0; index < noPoses; index++) {
      const rightEye = poses[index].pose.rightEye;
      const leftEye = poses[index].pose.leftEye;

      // Check if both eyes are detected
      if (rightEye && leftEye) {
        // Calculate distance between the eyes
        const distance = dist(rightEye.x, rightEye.y, leftEye.x, leftEye.y);
        
        // Update maxDistance and maxIndex if this distance is greater
        if (distance > maxDistance) {
          maxDistance = distance;
          maxIndex = index;
        }
      }
    }

    // If a valid index was found, update pose and skeleton
    if (maxIndex !== -1) {
      pose = poses[maxIndex].pose;
      skeleton = poses[maxIndex].skeleton;
    }
  }
}



function modelLoaded() {
  console.log('poseNet Listo!');
}

function draw() {
  //move image by the width of image to the left
  translate(video.width, 0);
  //then scale it by -1 in the x-axis
  //to flip the image
  scale(-1, 1);
  image(video, 0, 0);

  if (pose) {
    let eyeR = pose.rightEye;
    let eyeL = pose.leftEye;
    
    let dx = eyeR.x - eyeL.x;
    let dy = eyeR.y - eyeL.y;
    let m1 = dy/dx;
    let m2 = -1/m1;
    let mid_x = eyeL.x + dx/2;
    let mid_y = eyeL.y + dy/2;
        
    let d = dist(eyeR.x, eyeR.y, eyeL.x, eyeL.y);
    h = d*1.4;        
    
    let deltax = h*cos(atan(m2));
    let deltay = h*sin(atan(m2));
    let px = 0;
    let py = 0;
    let angulo;
    
    if (m2 < 0){
      px = mid_x + deltax;
      py = mid_y + deltay;
      angulo = atan(m2) + 90;
    }else{
      px = mid_x - deltax;
      py = mid_y - deltay;
      angulo = atan(m2) - 90;
    }
    
    let scale = map(d, 30, 200, 0.4, 2);
    let wEarsNow = scale*wEars;
    let hEarsNow = scale*hEars;            
  
    push();
    
    /* 
    Dado un punto P(px, py), este sirve como
    eje de rotacion al ajustar: imageMode(CENTER);
    
    Caso contrario la imagen gira alrededor
    */
    
    imageMode(CENTER); 
    translate(px, py);
    // rotar = rotar + 10;
    // rotate(rotar);    

    rotate(angulo);        
    image(catEars, 0, 0, 
          wEarsNow, hEarsNow);
    pop();
    
    if (PUNTOS){
      fill(255, 0, 0);
      ellipse(mid_x, mid_y, 16); // Punto medio
      ellipse(px, py, 16); // Punto de referencia

      stroke(255, 255, 0);
      strokeWeight(2);
      line(eyeR.x, eyeR.y, eyeL.x, eyeL.y);  // Linea entre los ojos
      // Linea entre punto medio y punto de referencia
      line(mid_x, mid_y, px, py); 

      fill(0, 0, 255);
      ellipse(pose.rightWrist.x, pose.rightWrist.y, 32);
      ellipse(pose.leftWrist.x, pose.leftWrist.y, 32);

      for (let i = 0; i < pose.keypoints.length; i++) {
        let x = pose.keypoints[i].position.x;
        let y = pose.keypoints[i].position.y;
        fill(0,255,0);
        ellipse(x,y,16,16);
      }

      for (let i = 0; i < skeleton.length; i++) {
        let a = skeleton[i][0];
        let b = skeleton[i][1];
        strokeWeight(2);
        stroke(255);
        line(a.position.x, a.position.y,
             b.position.x,b.position.y);     
      }
     
    }
  }
}