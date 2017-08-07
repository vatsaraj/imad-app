console.log('Loaded!');

// Modify the text content of a particular section on the fly.
var element = document.getElementById('ramblings-text');
var injection = element.innerHTML + '<div class="sublime-text"> <i>THIS LINE WAS SUBLIMINALLY INJECTED VIA JAVASCRIPT MODIFYING THE innerHTML PROPERTY OF A \'div\' SECTION - IT WILL NOT BE PRESENT WHEN YOU VIEW THE PAGE SOURCE.</i><br></div>';
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
var froggy = document.getElementById('frog-pic');
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


// Make a snowman shiver.
var snowman=document.getElementById('snowman-pic');
var snowmanMarginLeft = 0;
var shiverFactor = 2;
var startShivering = 0;
var shiveringInterval;
function doTheShiver() {

  if(snowmanMarginLeft == 0) { snowmanMarginLeft = shiverFactor; }
  else { snowmanMarginLeft = 0; }
  snowman.style.marginLeft = snowmanMarginLeft + 'px';
  // console.log('I\'m shivering..', snowmanMarginLeft);
}
function snowmanShiver() {
  if(startShivering == 0) {
    startShivering = 1;
    shiveringInterval = setInterval(doTheShiver, 5);
  } else {
    startShivering = 0;
    clearInterval(shiveringInterval);
  }
}


// This function loads the child pages /article1 /article2 and /article3.
var myProtocol = location.protocol;
var myPort     = location.port;
var myBaseURL  = location.hostname;
var whereAmI   = myProtocol + myPort + '//' + myBaseURL;
// console.log('All guns blazing on ', whereAmI);

function loadArticle(which) {
  location = whereAmI + '/article' + which;
}

