console.log('Loaded!');

// Modify the text content of a particular section on the fly.
var element = document.getElementById('ramblings-text');
var injection = element.innerHTML + "<i>THIS LINE WAS SUBLIMINALLY INJECTED VIA JAVASCRIPT MODIFYING THE innerHTML PROPERTY.</i><br>";
element.innerHTML = injection;


// If you click the image, it will jump right by 100 pixels.
var aloha = document.getElementById('aloha-pic');
var marginLeft = 0;
function aloha_slide_right() {
  marginLeft = marginLeft + 1;
  aloha.style.marginLeft = marginLeft + 'px';
}

aloha.onclick = function() {
  var interval = setInterval(aloha_slide_right, 50);
};

// Make a frog hop around.
var frogXPos = 0;
var frogDir = "right";
var frogJumpDistance = 40;
var frogStartPoint = 0;
var frogEndPoint = 120;
froggy = document.getElementById('frog-pic');
function frogJump() {
  if(frogDir === "right") {
    if(frogXPos == frogEndPoint) {
      froggy.src = '/ui/frog_left.png';
      frogDir = "left";
      frogXPos -= frogJumpDistance;
    } else {
      frogXPos += frogJumpDistance;
    }
  } else {
    if(frogXPos == frogStartPoint) {
      froggy.src = '/ui/frog_right.png';
      frogDir = "right";
      frogXPos += frogJumpDistance;
    } else {
      frogXPos -= frogJumpDistance;
    }
  }

  froggy.style.marginLeft = frogXPos + "px";
}

froggy.onclick = function() { frogJump(); };

// Change the face picture when a mouse hovers over it.
queasy = document.getElementById('queasy-pic');

function queasyMouseOver() {
  queasy.src = '/ui/face2.png';
}
function queasyMouseOut() {
  queasy.src = '/ui/face1.png';
}

