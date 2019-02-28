function getById(id) {
  return document.getElementById(id);
}

class UI {
  constructor() {
    this.video = getById('video');
    this.photoCanvas = getById('photoCanvas');
    this.photoContext = this.photoCanvas.getContext('2d');
    this.photo = getById('photo');
    this.buttonCapture = getById('buttonCapture');
    this.mainCanvas = getById('mainCanvas');
    this.mainContext = this.mainCanvas.getContext('2d');
    this.isDown = false;
    this.previouslyAngle = 0;
    this.angle = 0;
    this.centerOfMainCanvas = { 
      x: this.mainCanvas.width / 2, 
      y: this.mainCanvas.height / 2 
    };
  }

  rotatePhotoCanvas() {
    this.mainContext.translate(0, 0);
    this.mainContext.fillStyle = "rgb(221, 221, 221)";
    this.mainContext.fillRect(0, 0, this.mainCanvas.offsetWidth, this.mainCanvas.offsetHeight);
    this.mainContext.fill();
    this.mainContext.save();
    this.mainContext.translate(this.centerOfMainCanvas.x, this.centerOfMainCanvas.y);

    this.mainContext.rotate(this.angle);
    this.mainContext.drawImage(this.photoCanvas, -(this.photoCanvas.width / 2), -(this.photoCanvas.height / 2));
    this.mainContext.restore();
  }

  calculateAngle(event) {
    let offset = {
      dx: event.offsetX - this.centerOfMainCanvas.x,
      dy: event.offsetY - this.centerOfMainCanvas.y
    };

    this.angle = Math.atan(offset.dy / offset.dx);
    if (offset.dx < 0) this.angle += Math.PI;
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

    ui.rotatePhotoCanvas(); 
  });

  ui.mainCanvas.addEventListener('mousedown', event => {
    ui.isDown = true;
    ui.calculateAngle(event);
    ui.previouslyAngle = ui.previouslyAngle - ui.angle;
  })

  ui.mainCanvas.addEventListener('mouseup', event => {
    ui.previouslyAngle = ui.angle;
    ui.isDown = false;
  })

  ui.mainCanvas.addEventListener('mouseout', event => {
    ui.previouslyAngle = ui.angle;
    ui.isDown = false;
  })

  ui.mainCanvas.addEventListener('mousemove', event => {
    if (!ui.isDown) {
      return;
    }

    ui.calculateAngle(event);
    ui.angle = ui.previouslyAngle + ui.angle;

    ui.rotatePhotoCanvas();
  }, false)
};