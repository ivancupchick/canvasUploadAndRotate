function getId(id) {
  return document.getElementById(id);
}

class UI {
  constructor() {
    this.video = getId('video');
    this.photoCanvas = getId('photoCanvas');
    this.photoContext = this.photoCanvas.getContext('2d');
    this.photo = getId('photo');
    this.buttonCapture = getId('buttonCapture');
    this.mainCanvas = getId('mainCanvas');
    this.mainContext = this.mainCanvas.getContext('2d');
    this.centerOfMainCanvas = { 
      x: this.mainCanvas.width / 2, 
      y: this.mainCanvas.height / 2 
    };
  }

  clearMainCanvas() {
    this.mainContext.translate(0, 0);
    this.mainContext.fillStyle = "rgb(221, 221, 221)";
    this.mainContext.fillRect(0, 0, this.mainCanvas.offsetWidth, this.mainCanvas.offsetHeight);
    this.mainContext.fill();
    this.mainContext.save();
    this.mainContext.translate(this.centerOfMainCanvas.x, this.centerOfMainCanvas.y);
  }

  rotateMainCanvas(angle) {
    this.mainContext.rotate(angle);
    this.mainContext.drawImage(this.photoCanvas, -(this.photoCanvas.width / 2), -(this.photoCanvas.height / 2));
    this.mainContext.restore();
  }
}

window.onload = () => {
  const ui = new UI();

  navigator.getMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || 
  navigator.mozGetUserMedia || navigator.msGetUserMedia;
  
  navigator.getMedia({
    video: true,
    audio: false
  },
  (stream) => {
    ui.video.srcObject = stream;
    ui.video.play();
  }, 
  (error) => {
    console.log(error.message);
  });

  ui.buttonCapture.addEventListener('click', function() {
    ui.photoContext.drawImage(ui.video, 0, 0, 400, 300);
    ui.photo.setAttribute('src', ui.photoCanvas.toDataURL('image/png')); 
  });
  
  ui.mainCanvas.addEventListener('mousemove', (event) => {
    ui.clearMainCanvas();

    let offset = {
      dx: event.offsetX - ui.centerOfMainCanvas.x,
      dy: event.offsetY - ui.centerOfMainCanvas.y
    };

    let angle = Math.atan(offset.dy / offset.dx);

    if (offset.dx < 0) angle += Math.PI;

    ui.rotateMainCanvas(angle);
  }, false);
};